"""
Seed the BookBuds database with demo users and books.
Run from the api/ directory: python seed.py
"""
import requests

BASE = "http://localhost:8000"

def ol_cover(isbn: str) -> str:
    return f"https://covers.openlibrary.org/b/isbn/{isbn}-L.jpg"

USERS = [
    {"display_name": "Jordan",  "email": "jordan@bookbuds.co",  "password": "BookBuds2026!"},
    {"display_name": "Priya",   "email": "priya@bookbuds.co",   "password": "BookBuds2026!"},
    {"display_name": "Sam",     "email": "sam@bookbuds.co",     "password": "BookBuds2026!"},
    {"display_name": "Alex",    "email": "alex@bookbuds.co",    "password": "BookBuds2026!"},
    {"display_name": "Casey",   "email": "casey@bookbuds.co",   "password": "BookBuds2026!"},
]

# Each entry: (owner_display_name, book_data)
BOOKS = [
    ("Jordan", {
        "title": "Dune",
        "author": "Frank Herbert",
        "cover_image_url": ol_cover("9780441172719"),
        "spine_color": "#C4722A",
        "condition": "Good",
        "description": "Set in the distant future, the novel tells the story of Paul Atreides on the desert planet Arrakis, the only source of the most precious substance in the universe.",
        "exchange_type": "both",
    }),
    ("Jordan", {
        "title": "The Goldfinch",
        "author": "Donna Tartt",
        "cover_image_url": ol_cover("9780316055437"),
        "spine_color": "#A67B2E",
        "condition": "Good",
        "description": "A boy in New York is taken in by the family of a wealthy friend after a museum explosion kills his mother. He clings to a small Dutch painting as his talisman.",
        "exchange_type": "both",
    }),
    ("Priya", {
        "title": "Beloved",
        "author": "Toni Morrison",
        "cover_image_url": ol_cover("9781400033416"),
        "spine_color": "#6B1D2A",
        "condition": "Like New",
        "description": "A powerful examination of the legacy of slavery told through the haunting story of Sethe, who escaped enslavement but is forever trapped by her past.",
        "exchange_type": "local",
    }),
    ("Priya", {
        "title": "Parable of the Sower",
        "author": "Octavia Butler",
        "cover_image_url": ol_cover("9781538732182"),
        "spine_color": "#3D1C02",
        "condition": "Fair",
        "description": "In 2025, a young woman with a powerful gift flees her burning neighborhood and heads north, founding a new community along the way.",
        "exchange_type": "both",
    }),
    ("Sam", {
        "title": "Klara and the Sun",
        "author": "Kazuo Ishiguro",
        "cover_image_url": ol_cover("9780593318171"),
        "spine_color": "#D4A843",
        "condition": "Good",
        "description": "An Artificial Friend named Klara observes the world from a store window, waiting to be chosen by a customer. A moving exploration of what it means to love.",
        "exchange_type": "both",
    }),
    ("Sam", {
        "title": "Station Eleven",
        "author": "Emily St. John Mandel",
        "cover_image_url": ol_cover("9780385353304"),
        "spine_color": "#1A5C3A",
        "condition": "Good",
        "description": "Moving between timelines before and after a devastating pandemic, exploring art, memory, and human connection. A haunting and beautiful novel.",
        "exchange_type": "shipping",
    }),
    ("Alex", {
        "title": "Normal People",
        "author": "Sally Rooney",
        "cover_image_url": ol_cover("9781984822185"),
        "spine_color": "#1B3A4B",
        "condition": "Fair",
        "description": "Connell and Marianne grow up in the same small town in rural Ireland but their worlds are very different. A tender and devastating story of love.",
        "exchange_type": "local",
    }),
    ("Alex", {
        "title": "Circe",
        "author": "Madeline Miller",
        "cover_image_url": ol_cover("9780316556347"),
        "spine_color": "#8B6914",
        "condition": "Like New",
        "description": "In the house of Helios, god of the sun, a daughter is born with strange powers. Circe discovers she is a witch, the first in the world.",
        "exchange_type": "both",
    }),
    ("Casey", {
        "title": "The Vanishing Half",
        "author": "Brit Bennett",
        "cover_image_url": ol_cover("9780525536291"),
        "spine_color": "#4A2C5E",
        "condition": "Like New",
        "description": "Twin sisters who run away from their small Southern black community at sixteen choose to live in two very different worlds, one returning and one passing as white.",
        "exchange_type": "local",
    }),
    ("Casey", {
        "title": "A Little Life",
        "author": "Hanya Yanagihara",
        "cover_image_url": ol_cover("9780385539258"),
        "spine_color": "#2B2B2B",
        "condition": "Good",
        "description": "Four classmates from a small Massachusetts college move to New York. Over the decades, their relationships deepen and darken around one friend's haunting past.",
        "exchange_type": "local",
    }),
    ("Jordan", {
        "title": "Pachinko",
        "author": "Min Jin Lee",
        "cover_image_url": ol_cover("9781455563937"),
        "spine_color": "#C44536",
        "condition": "Like New",
        "description": "Following one Korean family through the generations beginning in the early 1900s. An epic tale of love, sacrifice, ambition, and loyalty.",
        "exchange_type": "local",
    }),
    ("Priya", {
        "title": "The Great Gatsby",
        "author": "F. Scott Fitzgerald",
        "cover_image_url": ol_cover("9780743273565"),
        "spine_color": "#2D5016",
        "condition": "Good",
        "description": "A portrait of the Jazz Age in all of its decadence and excess, told through the eyes of Nick Carraway as he navigates the world of the impossibly rich.",
        "exchange_type": "both",
    }),
]


def register_or_login(user: dict):
    """Register a user; if already exists, log in. Returns JWT token."""
    r = requests.post(f"{BASE}/auth/register", json=user)
    if r.status_code == 200:
        print(f"  ✓ Registered {user['display_name']}")
        return r.json()["access_token"]
    # Already exists — try login
    r = requests.post(f"{BASE}/auth/login", json={
        "email": user["email"],
        "password": user["password"],
    })
    if r.status_code == 200:
        print(f"  ~ {user['display_name']} already exists, logged in")
        return r.json()["access_token"]
    print(f"  ✗ Failed for {user['display_name']}: {r.text}")
    return None


def seed():
    print("🌱 Seeding BookBuds database...\n")

    # 1. Register/login all users, collect tokens
    tokens: dict[str, str] = {}
    print("Users:")
    for u in USERS:
        token = register_or_login(u)
        if token:
            tokens[u["display_name"]] = token

    # 2. Add books
    print("\nBooks:")
    added = 0
    for owner_name, book in BOOKS:
        token = tokens.get(owner_name)
        if not token:
            print(f"  ✗ No token for {owner_name}, skipping '{book['title']}'")
            continue
        r = requests.post(
            f"{BASE}/books",
            json=book,
            headers={"Authorization": f"Bearer {token}"},
        )
        if r.status_code in (200, 201):
            print(f"  ✓ {owner_name}: {book['title']}")
            added += 1
        elif r.status_code == 400 and "already" in r.text.lower():
            print(f"  ~ {book['title']} already exists for {owner_name}")
        else:
            print(f"  ✗ {book['title']}: {r.status_code} {r.text[:80]}")

    print(f"\n✅ Done — {added} books added.")


if __name__ == "__main__":
    seed()
