"use client";

import { useEffect, useRef, useCallback } from "react";

const VERT = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

const FRAG = `
precision highp float;
varying vec2 v_uv;
uniform sampler2D u_marble;
uniform sampler2D u_disp;
uniform float u_strength;
uniform float u_time;

void main(){
  vec2 uv = v_uv;

  // Ambient flowing wave distortion
  float t = u_time * 0.12;
  vec2 w = uv * 2.5;
  for(float i = 1.0; i < 5.0; i++){
    w.x += 0.4 / i * cos(i * 2.5 * w.y + t);
    w.y += 0.4 / i * cos(i * 1.5 * w.x + t * 0.8);
  }
  vec2 waveOffset = (w - uv * 2.5) * 0.008;
  uv += waveOffset;

  // Displacement from mouse drag
  vec4 d = texture2D(u_disp, v_uv);
  vec2 offset = -(d.rg - 0.5) * 2.0 * u_strength;
  uv += offset;

  uv = clamp(uv, 0.0, 1.0);
  gl_FragColor = texture2D(u_marble, uv);
}`;

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Shader compile error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

const DISP_SIZE = 512;

interface ShaderBackgroundProps {
  variant?: "hero" | "header";
  className?: string;
}

export default function ShaderBackground({ variant = "hero", className = "" }: ShaderBackgroundProps) {
  const isHero = variant === "hero";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const mouseRef = useRef({ x: -1, y: -1, px: -1, py: -1, active: false });
  const dispRef = useRef<{ canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } | null>(null);
  const startTimeRef = useRef(performance.now());

  const initDispCanvas = useCallback(() => {
    if (dispRef.current) return dispRef.current;
    const c = document.createElement("canvas");
    c.width = DISP_SIZE;
    c.height = DISP_SIZE;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "rgb(128, 128, 128)";
    ctx.fillRect(0, 0, DISP_SIZE, DISP_SIZE);
    dispRef.current = { canvas: c, ctx };
    return dispRef.current;
  }, []);

  const paintDisplacement = useCallback(() => {
    const d = dispRef.current;
    if (!d) return;
    const { ctx } = d;
    const m = mouseRef.current;

    ctx.fillStyle = "rgba(128, 128, 128, 0.004)";
    ctx.fillRect(0, 0, DISP_SIZE, DISP_SIZE);

    if (!m.active || m.px < 0) return;

    const vx = m.x - m.px;
    const vy = m.y - m.py;
    const speed = Math.sqrt(vx * vx + vy * vy);
    if (speed < 0.0008) return;

    const nvx = vx / speed;
    const nvy = vy / speed;
    const intensity = Math.min(speed * 15, 1.0);

    const r = Math.round(128 + nvx * 127 * intensity);
    const g = Math.round(128 - nvy * 127 * intensity);

    const cx = m.x * DISP_SIZE;
    const cy = m.y * DISP_SIZE;
    const pcx = m.px * DISP_SIZE;
    const pcy = m.py * DISP_SIZE;
    const brushRadius = 25 + speed * 600;

    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, brushRadius);
    grad.addColorStop(0, `rgba(${r}, ${g}, 128, 0.8)`);
    grad.addColorStop(0.3, `rgba(${r}, ${g}, 128, 0.4)`);
    grad.addColorStop(0.7, `rgba(${r}, ${g}, 128, 0.1)`);
    grad.addColorStop(1, "rgba(128, 128, 128, 0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, brushRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = `rgba(${r}, ${g}, 128, 0.55)`;
    ctx.lineWidth = brushRadius * 0.5;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(pcx, pcy);
    ctx.lineTo(cx, cy);
    ctx.stroke();

    const perpX = -nvy;
    const perpY = nvx;
    const wakeR = brushRadius * 1.5;
    for (let side = -1; side <= 1; side += 2) {
      const wx = cx + perpX * brushRadius * 0.4 * side;
      const wy = cy + perpY * brushRadius * 0.4 * side;
      const wakeGrad = ctx.createRadialGradient(wx, wy, 0, wx, wy, wakeR);
      const wr = Math.round(128 + nvx * 50 * intensity);
      const wg = Math.round(128 - nvy * 50 * intensity);
      wakeGrad.addColorStop(0, `rgba(${wr}, ${wg}, 128, 0.15)`);
      wakeGrad.addColorStop(1, "rgba(128, 128, 128, 0)");
      ctx.fillStyle = wakeGrad;
      ctx.beginPath();
      ctx.arc(wx, wy, wakeR, 0, Math.PI * 2);
      ctx.fill();
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { alpha: false, antialias: false });
    if (!gl) return;

    const vs = compileShader(gl, gl.VERTEX_SHADER, VERT);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      return;
    }

    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(program, "a_position");
    const marbleLoc = gl.getUniformLocation(program, "u_marble");
    const dispLoc = gl.getUniformLocation(program, "u_disp");
    const strengthLoc = gl.getUniformLocation(program, "u_strength");
    const timeLoc = gl.getUniformLocation(program, "u_time");

    gl.useProgram(program);
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    // Marble texture (unit 0)
    const marbleTex = gl.createTexture();
    const marbleImg = new Image();
    let textureLoaded = false;

    marbleImg.onload = () => {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, marbleTex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, marbleImg);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.uniform1i(marbleLoc, 0);
      textureLoaded = true;
    };
    marbleImg.src = "/illustrations/marbled-endpaper.jpg";

    // Displacement texture (unit 1)
    const disp = initDispCanvas();
    const dispTex = gl.createTexture();

    function uploadDisp(g: WebGLRenderingContext) {
      g.activeTexture(g.TEXTURE1);
      g.bindTexture(g.TEXTURE_2D, dispTex);
      g.pixelStorei(g.UNPACK_FLIP_Y_WEBGL, true);
      g.texImage2D(g.TEXTURE_2D, 0, g.RGBA, g.RGBA, g.UNSIGNED_BYTE, disp.canvas);
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.CLAMP_TO_EDGE);
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.CLAMP_TO_EDGE);
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, g.LINEAR);
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, g.LINEAR);
    }
    uploadDisp(gl);
    gl.uniform1i(dispLoc, 1);

    startTimeRef.current = performance.now();

    function render() {
      if (!canvas || !gl) return;

      const dpr = Math.min(window.devicePixelRatio, 2);
      const w = canvas.clientWidth * dpr;
      const h = canvas.clientHeight * dpr;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }

      if (textureLoaded) {
        paintDisplacement();
        uploadDisp(gl);
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform1f(strengthLoc, 0.4);
        gl.uniform1f(timeLoc, (performance.now() - startTimeRef.current) / 1000);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }

      animRef.current = requestAnimationFrame(render);
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const m = mouseRef.current;
      m.px = m.x;
      m.py = m.y;
      m.x = (e.clientX - rect.left) / rect.width;
      m.y = (e.clientY - rect.top) / rect.height;
      m.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    animRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animRef.current);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [initDispCanvas, paintDisplacement]);

  return (
    <div
      className={`absolute inset-0 overflow-hidden ${className}`}
      style={{ opacity: isHero ? 1 : 0.45 }}
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
