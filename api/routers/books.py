import os
import uuid as _uuid
from typing import Optional, List

from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, status
from sqlalchemy import or_
from sqlalchemy.orm import Session, joinedload

from db import get_db
from models.user import User
from models.book import Book
from schemas.book import BookCreate, BookUpdate, BookResponse, BookDetailResponse
from auth import get_current_user

router = APIRouter(prefix="/books", tags=["books"])

STATIC_DIR = os.path.join(os.path.dirname(__file__), "..", "static")


@router.get("", response_model=List[BookResponse])
def list_books(
    q: Optional[str] = Query(None),
    condition: Optional[str] = Query(None),
    exchange_type: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(Book).options(joinedload(Book.owner)).filter(Book.available == True)

    if q:
        pattern = f"%{q}%"
        query = query.filter(or_(Book.title.ilike(pattern), Book.author.ilike(pattern)))
    if condition:
        query = query.filter(Book.condition == condition)
    if exchange_type:
        query = query.filter(or_(Book.exchange_type == exchange_type, Book.exchange_type == "both"))

    return query.order_by(Book.created_at.desc()).all()


@router.post("", response_model=BookResponse, status_code=status.HTTP_201_CREATED)
def create_book(
    payload: BookCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    book = Book(**payload.model_dump(), owner_id=current_user.id)
    db.add(book)
    db.commit()
    db.refresh(book)
    return book


ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
MAX_COVER_SIZE_BYTES = 5 * 1024 * 1024  # 5 MB


@router.post("/{book_id}/cover", response_model=BookResponse)
async def upload_cover(
    book_id: _uuid.UUID,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"File type '{file.content_type}' not allowed. Use JPEG, PNG, WebP, or GIF.",
        )

    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    if book.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your book")

    os.makedirs(STATIC_DIR, exist_ok=True)
    content = await file.read()
    if len(content) > MAX_COVER_SIZE_BYTES:
        raise HTTPException(status_code=400, detail="File too large. Maximum size is 5 MB.")

    ext = file.filename.rsplit(".", 1)[-1].lower() if file.filename and "." in file.filename else "jpg"
    if ext not in ("jpg", "jpeg", "png", "webp", "gif"):
        ext = "jpg"
    filename = f"{book_id}.{ext}"
    filepath = os.path.join(STATIC_DIR, filename)

    with open(filepath, "wb") as f:
        f.write(content)

    book.cover_image_url = f"/static/{filename}"
    db.commit()
    db.refresh(book)
    return book


@router.get("/{book_id}", response_model=BookDetailResponse)
def get_book(book_id: _uuid.UUID, db: Session = Depends(get_db)):
    book = (
        db.query(Book)
        .options(joinedload(Book.owner), joinedload(Book.checkouts))
        .filter(Book.id == book_id)
        .first()
    )
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book


@router.patch("/{book_id}", response_model=BookResponse)
def update_book(
    book_id: _uuid.UUID,
    payload: BookUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    if book.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your book")

    for key, val in payload.model_dump(exclude_unset=True).items():
        setattr(book, key, val)

    db.commit()
    db.refresh(book)
    return book


@router.delete("/{book_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_book(
    book_id: _uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    if book.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your book")

    db.delete(book)
    db.commit()
