/**
 * BookBuds API client
 * All requests go to the FastAPI backend at API_BASE.
 * Open Chrome DevTools → Network tab to watch requests fire.
 */

import type { Book, User, Notification } from "@/lib/mock-data";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// ---------------------------------------------------------------------------
// Auth helpers
// ---------------------------------------------------------------------------

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("bookbuds_token");
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return token
    ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail ?? `Request failed (${res.status})`);
  }
  return res.json();
}

// ---------------------------------------------------------------------------
// Raw API types (snake_case from FastAPI)
// ---------------------------------------------------------------------------

interface ApiUser {
  id: string;
  email: string;
  display_name: string;
  avatar_url?: string;
}

interface ApiBook {
  id: string;
  title: string;
  author: string;
  cover_image_url?: string;
  spine_color: string;
  condition: string;
  description?: string;
  available: boolean;
  exchange_type: "local" | "shipping" | "both";
  owner: ApiUser;
}

interface ApiNotification {
  id: string;
  type: string;
  message: string;
  read: boolean;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Mappers: API shape → frontend types
// ---------------------------------------------------------------------------

function mapUser(u: ApiUser): User {
  return { id: u.id, displayName: u.display_name, email: u.email, avatarUrl: u.avatar_url };
}

export function mapBook(b: ApiBook): Book {
  return {
    id: b.id,
    title: b.title,
    author: b.author,
    coverImageUrl: b.cover_image_url,
    spineColor: b.spine_color,
    condition: b.condition,
    description: b.description,
    available: b.available,
    exchangeType: b.exchange_type,
    owner: mapUser(b.owner),
    checkouts: [],
  };
}

function mapNotification(n: ApiNotification): Notification {
  return {
    id: n.id,
    type: n.type,
    message: n.message,
    read: n.read,
    createdAt: n.created_at,
  };
}

// ---------------------------------------------------------------------------
// Books
// ---------------------------------------------------------------------------

/**
 * List available books. Pass `query` to search by title/author.
 * Watch in DevTools Network tab: GET /books or GET /books?q=...
 */
export async function fetchBooks(query?: string): Promise<Book[]> {
  const url = new URL(`${API_BASE}/books`);
  if (query?.trim()) url.searchParams.set("q", query.trim());

  const res = await fetch(url.toString());
  const data = await handleResponse<ApiBook[]>(res);
  return data.map(mapBook);
}

/**
 * Fetch a single book with checkout history.
 */
export async function fetchBook(bookId: string): Promise<Book> {
  const res = await fetch(`${API_BASE}/books/${bookId}`, {
    headers: authHeaders(),
  });
  const data = await handleResponse<ApiBook>(res);
  return mapBook(data);
}

export interface CreateBookPayload {
  title: string;
  author: string;
  condition: string;
  description?: string;
  exchange_type: "local" | "shipping" | "both";
  spine_color: string;
  cover_image_url?: string;
}

/**
 * Add a new book to the current user's shelf (requires auth).
 * Watch in DevTools: POST /books with a JSON body.
 */
export async function createBook(payload: CreateBookPayload): Promise<Book> {
  const res = await fetch(`${API_BASE}/books`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await handleResponse<ApiBook>(res);
  return mapBook(data);
}

/**
 * Delete a book from the current user's shelf (requires auth).
 */
export async function deleteBook(bookId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/books/${bookId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok && res.status !== 204) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail ?? "Delete failed");
  }
}

// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------

/**
 * Fetch the current user's notifications (requires auth).
 * Watch in DevTools: GET /notifications with Authorization header.
 */
export async function fetchNotifications(): Promise<Notification[]> {
  const res = await fetch(`${API_BASE}/notifications`, {
    headers: authHeaders(),
  });
  const data = await handleResponse<ApiNotification[]>(res);
  return data.map(mapNotification);
}

export async function fetchUnreadCount(): Promise<number> {
  const res = await fetch(`${API_BASE}/notifications/unread-count`, {
    headers: authHeaders(),
  });
  const data = await handleResponse<{ count: number }>(res);
  return data.count;
}

export async function markNotificationRead(notificationId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/notifications/${notificationId}/read`, {
    method: "PATCH",
    headers: authHeaders(),
  });
  await handleResponse(res);
}

// ---------------------------------------------------------------------------
// Checkouts
// ---------------------------------------------------------------------------

export interface MyCheckout {
  id: string;
  book_id: string;
  status: "requested" | "approved";
}

export interface RichCheckout {
  id: string;
  book_id: string;
  status: "requested" | "approved";
  exchange_method: string;
  requested_at: string;
  approved_at?: string;
  borrower: { id: string; display_name: string; avatar_url?: string };
  book: {
    id: string;
    title: string;
    author: string;
    cover_image_url?: string;
    spine_color: string;
  };
  book_owner_name: string;
  book_owner_avatar?: string;
}

/**
 * Return the current user's active checkouts (requested + approved).
 * Used to overlay status badges on the friends' books carousel.
 */
export async function fetchMyCheckouts(): Promise<MyCheckout[]> {
  const res = await fetch(`${API_BASE}/checkouts`, { headers: authHeaders() });
  return handleResponse<MyCheckout[]>(res);
}

/** Active checkouts on books you own — for showing request badges on your shelf. */
export async function fetchIncomingCheckouts(): Promise<MyCheckout[]> {
  const res = await fetch(`${API_BASE}/checkouts/incoming`, { headers: authHeaders() });
  return handleResponse<MyCheckout[]>(res);
}

/** My borrows with full book info — for the Checkouts section on the homepage. */
export async function fetchMyCheckoutsRich(): Promise<RichCheckout[]> {
  const res = await fetch(`${API_BASE}/checkouts/rich`, { headers: authHeaders() });
  return handleResponse<RichCheckout[]>(res);
}

/** Incoming requests on my books with full book info — for the Checkouts section. */
export async function fetchIncomingCheckoutsRich(): Promise<RichCheckout[]> {
  const res = await fetch(`${API_BASE}/checkouts/incoming/rich`, { headers: authHeaders() });
  return handleResponse<RichCheckout[]>(res);
}

// ---------------------------------------------------------------------------
// Friends
// ---------------------------------------------------------------------------

export interface FriendInfo {
  id: string;
  display_name: string;
  avatar_url?: string;
  friend_code: string;
}

export async function getMyFriendCode(): Promise<string> {
  const res = await fetch(`${API_BASE}/friends/my-code`, { headers: authHeaders() });
  const data = await handleResponse<{ friend_code: string }>(res);
  return data.friend_code;
}

export async function addFriend(friendCode: string): Promise<{ message: string; friend: FriendInfo }> {
  const res = await fetch(`${API_BASE}/friends/add`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ friend_code: friendCode.trim().toUpperCase() }),
  });
  return handleResponse(res);
}

export async function fetchFriends(): Promise<FriendInfo[]> {
  const res = await fetch(`${API_BASE}/friends`, { headers: authHeaders() });
  return handleResponse<FriendInfo[]>(res);
}

export async function removeFriend(friendId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/friends/${friendId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok && res.status !== 204) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail ?? "Failed to remove friend");
  }
}

/**
 * Request to borrow a book (requires auth).
 * Watch in DevTools: POST /books/{id}/checkout
 */
export async function requestCheckout(
  bookId: string,
  exchangeMethod: "local" | "shipping",
  borrowerNote?: string,
): Promise<void> {
  const res = await fetch(`${API_BASE}/books/${bookId}/checkout`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ exchange_method: exchangeMethod, borrower_note: borrowerNote }),
  });
  await handleResponse(res);
}
