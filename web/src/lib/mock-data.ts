export interface User {
  id: string;
  displayName: string;
  email: string;
  avatarUrl?: string;
}

export interface Checkout {
  id: string;
  bookId: string;
  borrower: User;
  status: "requested" | "approved" | "returned" | "declined";
  exchangeMethod: "local" | "shipping";
  borrowerNote?: string;
  requestedAt: string;
  approvedAt?: string;
  returnedAt?: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  coverImageUrl?: string;
  spineColor: string;
  condition: string;
  description?: string;
  available: boolean;
  exchangeType: "local" | "shipping" | "both";
  owner: User;
  checkouts: Checkout[];
}

export const currentUser: User = {
  id: "u1",
  displayName: "Melissa",
  email: "melissa@bookbuds.co",
};

export const users: User[] = [
  currentUser,
  { id: "u2", displayName: "Jordan", email: "jordan@bookbuds.co" },
  { id: "u3", displayName: "Priya", email: "priya@bookbuds.co" },
  { id: "u4", displayName: "Sam", email: "sam@bookbuds.co" },
  { id: "u5", displayName: "Alex", email: "alex@bookbuds.co" },
  { id: "u6", displayName: "Casey", email: "casey@bookbuds.co" },
];

function olCover(isbn: string): string {
  return `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;
}

export const books: Book[] = [
  {
    id: "b13",
    title: "My Favorite Thing is Monsters",
    author: "Emil Ferris",
    coverImageUrl: olCover("9781606999592"),
    spineColor: "#1A1A2E",
    condition: "Like New",
    description: "Set against the backdrop of late-'60s Chicago, Karen Reyes documents her life in her diary — rendered in the style of a horror magazine.",
    available: true,
    exchangeType: "both",
    owner: currentUser,
    checkouts: [
      {
        id: "c16", bookId: "b13", borrower: users[4], status: "requested",
        exchangeMethod: "local", requestedAt: "2026-04-21",
      },
    ],
  },
  {
    id: "b14",
    title: "Autobiography of Red",
    author: "Anne Carson",
    coverImageUrl: olCover("9780375701290"),
    spineColor: "#B91C1C",
    condition: "Good",
    description: "A novel in verse about the winged red monster Geryon and his love for Herakles, reimagining an ancient Greek myth.",
    available: true,
    exchangeType: "local",
    owner: currentUser,
    checkouts: [
      {
        id: "c13", bookId: "b14", borrower: users[2], status: "returned",
        exchangeMethod: "local", requestedAt: "2026-02-10", approvedAt: "2026-02-11", returnedAt: "2026-03-20",
      },
    ],
  },
  {
    id: "b15",
    title: "Fun Home",
    author: "Alison Bechdel",
    coverImageUrl: olCover("9780618871711"),
    spineColor: "#365314",
    condition: "Good",
    description: "A graphic memoir about Bechdel's childhood and her relationship with her closeted father, who ran the family funeral home.",
    available: true,
    exchangeType: "both",
    owner: currentUser,
    checkouts: [
      {
        id: "c14", bookId: "b15", borrower: users[1], status: "returned",
        exchangeMethod: "local", requestedAt: "2025-11-15", approvedAt: "2025-11-16", returnedAt: "2025-12-20",
      },
      {
        id: "c17", bookId: "b15", borrower: users[3], status: "approved",
        exchangeMethod: "local", requestedAt: "2026-04-05", approvedAt: "2026-04-06",
      },
    ],
  },
  {
    id: "b1",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    coverImageUrl: olCover("9780743273565"),
    spineColor: "#2D5016",
    condition: "Good",
    description: "A portrait of the Jazz Age in all of its decadence and excess. Nick Carraway navigates the world of the impossibly rich.",
    available: false,
    exchangeType: "both",
    owner: users[1],
    checkouts: [
      {
        id: "c1", bookId: "b1", borrower: users[2], status: "returned",
        exchangeMethod: "local", requestedAt: "2025-09-15", approvedAt: "2025-09-16", returnedAt: "2025-10-01",
      },
      {
        id: "c2", bookId: "b1", borrower: currentUser, status: "approved",
        exchangeMethod: "local", requestedAt: "2026-04-10", approvedAt: "2026-04-11",
      },
    ],
  },
  {
    id: "b2",
    title: "Beloved",
    author: "Toni Morrison",
    coverImageUrl: olCover("9781400033416"),
    spineColor: "#6B1D2A",
    condition: "Like New",
    description: "A powerful examination of the legacy of slavery told through the haunting story of Sethe, who escaped enslavement but is trapped by her past.",
    available: true,
    exchangeType: "local",
    owner: users[2],
    checkouts: [
      {
        id: "c3", bookId: "b2", borrower: users[0], status: "returned",
        exchangeMethod: "local", requestedAt: "2025-08-20", approvedAt: "2025-08-21", returnedAt: "2025-09-15",
      },
    ],
  },
  {
    id: "b3",
    title: "Klara and the Sun",
    author: "Kazuo Ishiguro",
    coverImageUrl: olCover("9780593318171"),
    spineColor: "#D4A843",
    condition: "Good",
    description: "An Artificial Friend named Klara observes the world from a store window, waiting to be chosen by a customer.",
    available: true,
    exchangeType: "both",
    owner: users[3],
    checkouts: [
      {
        id: "c15", bookId: "b3", borrower: currentUser, status: "requested",
        exchangeMethod: "shipping", requestedAt: "2026-04-20",
      },
    ],
  },
  {
    id: "b4",
    title: "Normal People",
    author: "Sally Rooney",
    coverImageUrl: olCover("9781984822185"),
    spineColor: "#1B3A4B",
    condition: "Fair",
    description: "Connell and Marianne grow up in the same small town in rural Ireland, but their worlds are very different.",
    available: true,
    exchangeType: "local",
    owner: users[4],
    checkouts: [
      {
        id: "c4", bookId: "b4", borrower: users[1], status: "returned",
        exchangeMethod: "local", requestedAt: "2025-07-10", approvedAt: "2025-07-11", returnedAt: "2025-08-05",
      },
      {
        id: "c5", bookId: "b4", borrower: users[0], status: "returned",
        exchangeMethod: "local", requestedAt: "2025-10-01", approvedAt: "2025-10-02", returnedAt: "2025-11-15",
      },
      {
        id: "c6", bookId: "b4", borrower: users[2], status: "returned",
        exchangeMethod: "local", requestedAt: "2026-01-05", approvedAt: "2026-01-06", returnedAt: "2026-02-10",
      },
    ],
  },
  {
    id: "b5",
    title: "Dune",
    author: "Frank Herbert",
    coverImageUrl: olCover("9780441172719"),
    spineColor: "#C4722A",
    condition: "Good",
    description: "Set in the distant future, the novel tells the story of Paul Atreides on the desert planet Arrakis.",
    available: true,
    exchangeType: "both",
    owner: users[1],
    checkouts: [],
  },
  {
    id: "b6",
    title: "The Vanishing Half",
    author: "Brit Bennett",
    coverImageUrl: olCover("9780525536291"),
    spineColor: "#4A2C5E",
    condition: "Like New",
    description: "Twin sisters who run away from their small Southern town at sixteen choose to live in two very different worlds.",
    available: true,
    exchangeType: "local",
    owner: users[5],
    checkouts: [
      {
        id: "c7", bookId: "b6", borrower: users[3], status: "returned",
        exchangeMethod: "local", requestedAt: "2025-12-01", approvedAt: "2025-12-02", returnedAt: "2026-01-10",
      },
    ],
  },
  {
    id: "b7",
    title: "Station Eleven",
    author: "Emily St. John Mandel",
    coverImageUrl: olCover("9780385353304"),
    spineColor: "#1A5C3A",
    condition: "Good",
    description: "A novel that moves between timelines before and after a devastating pandemic, exploring art, memory, and human connection.",
    available: true,
    exchangeType: "shipping",
    owner: users[3],
    checkouts: [],
  },
  {
    id: "b8",
    title: "Circe",
    author: "Madeline Miller",
    coverImageUrl: olCover("9780316556347"),
    spineColor: "#8B6914",
    condition: "Like New",
    description: "In the house of Helios, god of the sun, a daughter is born. Circe is a strange child—not powerful like her father, not fiercely beautiful like her mother.",
    available: true,
    exchangeType: "both",
    owner: users[4],
    checkouts: [
      {
        id: "c8", bookId: "b8", borrower: users[5], status: "returned",
        exchangeMethod: "shipping", requestedAt: "2025-06-15", approvedAt: "2025-06-17", returnedAt: "2025-07-20",
      },
      {
        id: "c9", bookId: "b8", borrower: users[1], status: "returned",
        exchangeMethod: "local", requestedAt: "2025-09-01", approvedAt: "2025-09-02", returnedAt: "2025-10-05",
      },
    ],
  },
  {
    id: "b9",
    title: "Parable of the Sower",
    author: "Octavia Butler",
    coverImageUrl: olCover("9781538732182"),
    spineColor: "#3D1C02",
    condition: "Fair",
    description: "In 2025, a young woman with a powerful gift flees her burning neighborhood and heads north, founding a new community along the way.",
    available: true,
    exchangeType: "both",
    owner: users[2],
    checkouts: [],
  },
  {
    id: "b10",
    title: "A Little Life",
    author: "Hanya Yanagihara",
    coverImageUrl: olCover("9780385539258"),
    spineColor: "#2B2B2B",
    condition: "Good",
    description: "Four classmates from a small Massachusetts college move to New York to make their way. Over the decades, their relationships deepen and darken.",
    available: true,
    exchangeType: "local",
    owner: users[5],
    checkouts: [
      {
        id: "c10", bookId: "b10", borrower: users[0], status: "returned",
        exchangeMethod: "local", requestedAt: "2026-02-01", approvedAt: "2026-02-02", returnedAt: "2026-03-15",
      },
    ],
  },
  {
    id: "b11",
    title: "The Goldfinch",
    author: "Donna Tartt",
    coverImageUrl: olCover("9780316055437"),
    spineColor: "#A67B2E",
    condition: "Good",
    description: "A boy in New York is taken in by the family of a wealthy friend. Surviving an accident that kills his mother, he clings to a small Dutch painting.",
    available: true,
    exchangeType: "both",
    owner: users[1],
    checkouts: [],
  },
  {
    id: "b12",
    title: "Pachinko",
    author: "Min Jin Lee",
    coverImageUrl: olCover("9781455563937"),
    spineColor: "#C44536",
    condition: "Like New",
    description: "Following one Korean family through the generations, beginning in the early 1900s, Pachinko is an epic tale of love, sacrifice, ambition, and loyalty.",
    available: true,
    exchangeType: "local",
    owner: users[4],
    checkouts: [
      {
        id: "c11", bookId: "b12", borrower: users[2], status: "returned",
        exchangeMethod: "local", requestedAt: "2025-10-15", approvedAt: "2025-10-16", returnedAt: "2025-11-20",
      },
      {
        id: "c12", bookId: "b12", borrower: users[0], status: "returned",
        exchangeMethod: "local", requestedAt: "2026-01-10", approvedAt: "2026-01-11", returnedAt: "2026-02-15",
      },
    ],
  },
];

export interface Notification {
  id: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
  bookId?: string;
}

export const notifications: Notification[] = [
  { id: "n1", type: "checkout_request", message: "Priya requested your copy of The Great Gatsby", read: false, createdAt: "2026-04-19T14:30:00", bookId: "b1" },
  { id: "n2", type: "book_returned", message: "Circe has been marked as returned", read: false, createdAt: "2026-04-18T09:15:00", bookId: "b8" },
  { id: "n3", type: "checkout_approved", message: "Your request for Pachinko was approved!", read: true, createdAt: "2026-04-15T16:45:00", bookId: "b12" },
];

export interface Activity {
  id: string;
  user: User;
  action: "added" | "requested" | "returned" | "borrowed";
  bookTitle: string;
  bookId: string;
  timeAgo: string;
}

export const activities: Activity[] = [
  { id: "a1", user: users[1], action: "added", bookTitle: "Dune", bookId: "b5", timeAgo: "2h ago" },
  { id: "a2", user: users[2], action: "returned", bookTitle: "Beloved", bookId: "b2", timeAgo: "5h ago" },
  { id: "a3", user: users[4], action: "requested", bookTitle: "Pachinko", bookId: "b12", timeAgo: "1d ago" },
  { id: "a4", user: users[5], action: "added", bookTitle: "The Vanishing Half", bookId: "b6", timeAgo: "1d ago" },
  { id: "a5", user: users[3], action: "borrowed", bookTitle: "Normal People", bookId: "b4", timeAgo: "2d ago" },
  { id: "a6", user: users[1], action: "returned", bookTitle: "Circe", bookId: "b8", timeAgo: "3d ago" },
];
