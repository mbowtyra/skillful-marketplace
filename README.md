# BookBuds

Share your books with your buds. BookBuds is a book exchange platform for friends — post the books you're willing to share, browse your friends' shelves, and request to borrow with a library card stamping experience.

## Tech Stack

- **Frontend:** Next.js 16 · TypeScript · Tailwind CSS v4
- **Backend:** Python FastAPI · SQLAlchemy ORM · Pydantic
- **Database:** SQLite (dev) / PostgreSQL (production)
- **Auth:** JWT tokens · bcrypt password hashing

## Getting Started

### Prerequisites

- Node.js v20+
- Python 3.9+

### Frontend

```bash
cd web
npm install
npm run dev
```

Opens at [http://localhost:3000](http://localhost:3000).

### API

```bash
cd api
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

Opens at [http://localhost:8000](http://localhost:8000). Interactive API docs (Swagger UI) at [http://localhost:8000/docs](http://localhost:8000/docs).

## Pages

| Route | Description |
| --- | --- |
| `/` | Homepage — hero, friends' book carousel, your shelf carousel |
| `/shelf` | Browse friends' shelves with search, filters, cover/list views |
| `/my-books` | Manage your shelf — add books, toggle availability, edit details |

## API Endpoints

### Auth

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| POST | `/auth/register` | No | Create account, returns JWT |
| POST | `/auth/login` | No | Login with email/password, returns JWT |
| GET | `/auth/me` | Bearer | Get current user profile |

### Books (CRUD)

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | `/books` | No | List books (search by title/author, filter by condition) |
| POST | `/books` | Bearer | Add a book to your shelf |
| GET | `/books/{id}` | No | Book detail with owner info and checkout history |
| PATCH | `/books/{id}` | Bearer | Update book info (owner only) |
| DELETE | `/books/{id}` | Bearer | Remove a book (owner only) |
| POST | `/books/{id}/cover` | Bearer | Upload a cover image (owner only) |

### Checkouts

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| POST | `/books/{id}/checkout` | Bearer | Request to borrow a book |
| PATCH | `/checkouts/{id}` | Bearer | Approve, decline, or mark returned |

### Notifications

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | `/notifications` | Bearer | List your notifications |
| GET | `/notifications/unread-count` | Bearer | Get unread notification count |
| PATCH | `/notifications/{id}/read` | Bearer | Mark a notification as read |

## Database Schema

Four tables managed by SQLAlchemy with Alembic migrations:

- **users** — id, email, display_name, password_hash, avatar_url, created_at
- **books** — id, owner_id → users, title, author, condition, description, available, exchange_type, cover_image_url, spine_color, created_at
- **checkouts** — id, book_id → books, borrower_id → users, status (requested/approved/declined/returned), exchange_method, borrower_note, timestamps
- **notifications** — id, user_id → users, checkout_id → checkouts, type, message, read, created_at

## Project Structure

```
web/                            # Next.js frontend
  src/
    app/
      page.tsx                  # Homepage
      globals.css               # Design system (fonts, colors, animations)
      layout.tsx                # Root layout (navbar + footer)
      (app)/
        shelf/page.tsx          # Friends' Shelves
        my-books/page.tsx       # My Shelf
    components/
      Navbar.tsx                # Navigation with logo
      Bookshelf.tsx             # Book grid/list with search & filters
      BookCover.tsx             # Book cover card (real images or generated)
      BookDetail.tsx            # Book detail modal (borrow / follow)
      MyBookDetail.tsx          # Owner book detail (edit, toggle availability)
      LibraryCard.tsx           # Library card checkout with stamp animation
      FriendBookCarousel.tsx    # Horizontal scroll of friends' books
      MyBookCarousel.tsx        # Horizontal scroll of your books
      NotificationBell.tsx      # Notifications + friends' activity dropdown
    lib/
      mock-data.ts              # Demo data (books, users, checkouts, activities)

api/                            # FastAPI backend
  main.py                       # App entry, CORS, router mounts
  db.py                         # SQLAlchemy engine + session
  auth.py                       # JWT + bcrypt utilities
  routers/
    auth.py                     # Register, login, profile
    books.py                    # Book CRUD + cover upload
    checkouts.py                # Checkout request + status updates
    notifications.py            # Notification list + mark read
  models/
    user.py                     # User ORM model
    book.py                     # Book ORM model
    checkout.py                 # Checkout ORM model
    notification.py             # Notification ORM model
  schemas/
    user.py                     # User request/response schemas
    book.py                     # Book request/response schemas
    checkout.py                 # Checkout request/response schemas
    notification.py             # Notification response schema
  alembic/                      # Database migrations
```
