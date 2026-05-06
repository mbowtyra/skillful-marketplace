"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, rotateY: 4, x: 30 }}
        animate={{ opacity: 1, rotateY: 0, x: 0 }}
        exit={{ opacity: 0, rotateY: -4, x: -30 }}
        transition={{
          duration: 0.35,
          ease: [0.22, 1, 0.36, 1],
        }}
        style={{ perspective: 1200, transformOrigin: "center center" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
