import uuid as _uuid
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from db import get_db
from models.user import User
from models.book import Book
from models.checkout import Checkout
from models.notification import Notification
from schemas.checkout import CheckoutCreate, CheckoutUpdate, CheckoutResponse, RichCheckoutResponse, BookSummary
from auth import get_current_user

router = APIRouter(tags=["checkouts"])


@router.get("/checkouts", response_model=list[CheckoutResponse])
def list_my_checkouts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Active checkouts where the current user is the borrower."""
    return (
        db.query(Checkout)
        .filter(
            Checkout.borrower_id == current_user.id,
            Checkout.status.in_(["requested", "approved"]),
        )
        .order_by(Checkout.requested_at.desc())
        .all()
    )


@router.get("/checkouts/incoming", response_model=list[CheckoutResponse])
def list_incoming_checkouts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Active checkouts on books the current user owns."""
    return (
        db.query(Checkout)
        .join(Book, Checkout.book_id == Book.id)
        .filter(
            Book.owner_id == current_user.id,
            Checkout.status.in_(["requested", "approved"]),
        )
        .order_by(Checkout.requested_at.desc())
        .all()
    )


def _enrich(checkout: Checkout, book: Book) -> RichCheckoutResponse:
    return RichCheckoutResponse(
        id=checkout.id,
        book_id=checkout.book_id,
        borrower=checkout.borrower,
        status=checkout.status,
        exchange_method=checkout.exchange_method,
        borrower_note=checkout.borrower_note,
        requested_at=checkout.requested_at,
        approved_at=checkout.approved_at,
        returned_at=checkout.returned_at,
        book=BookSummary(
            id=book.id,
            title=book.title,
            author=book.author,
            cover_image_url=book.cover_image_url,
            spine_color=book.spine_color,
        ),
        book_owner_name=book.owner.display_name,
        book_owner_avatar=book.owner.avatar_url,
    )


@router.get("/checkouts/rich", response_model=list[RichCheckoutResponse])
def list_my_checkouts_rich(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Active checkouts where the current user is the borrower — with full book info."""
    rows = (
        db.query(Checkout)
        .filter(
            Checkout.borrower_id == current_user.id,
            Checkout.status.in_(["requested", "approved"]),
        )
        .order_by(Checkout.requested_at.desc())
        .all()
    )
    result = []
    for c in rows:
        book = db.query(Book).filter(Book.id == c.book_id).first()
        if book:
            result.append(_enrich(c, book))
    return result


@router.get("/checkouts/incoming/rich", response_model=list[RichCheckoutResponse])
def list_incoming_checkouts_rich(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Active checkouts on books the current user owns — with full book info."""
    rows = (
        db.query(Checkout)
        .join(Book, Checkout.book_id == Book.id)
        .filter(
            Book.owner_id == current_user.id,
            Checkout.status.in_(["requested", "approved"]),
        )
        .order_by(Checkout.requested_at.desc())
        .all()
    )
    result = []
    for c in rows:
        book = db.query(Book).filter(Book.id == c.book_id).first()
        if book:
            result.append(_enrich(c, book))
    return result


@router.post("/books/{book_id}/checkout", response_model=CheckoutResponse, status_code=status.HTTP_201_CREATED)
def request_checkout(
    book_id: _uuid.UUID,
    payload: CheckoutCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    if not book.available:
        raise HTTPException(status_code=400, detail="Book is not available")
    if book.owner_id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot check out your own book")

    active = (
        db.query(Checkout)
        .filter(
            Checkout.book_id == book_id,
            Checkout.borrower_id == current_user.id,
            Checkout.status == "requested",
        )
        .first()
    )
    if active:
        raise HTTPException(status_code=400, detail="You already have a pending request for this book")

    checkout = Checkout(
        book_id=book_id,
        borrower_id=current_user.id,
        exchange_method=payload.exchange_method,
        borrower_note=payload.borrower_note,
    )
    db.add(checkout)

    notification = Notification(
        user_id=book.owner_id,
        checkout_id=checkout.id,
        type="checkout_request",
        message=f"{current_user.display_name} requested your copy of {book.title}",
    )
    db.add(notification)

    db.commit()
    db.refresh(checkout)
    return checkout


@router.patch("/checkouts/{checkout_id}", response_model=CheckoutResponse)
def update_checkout(
    checkout_id: _uuid.UUID,
    payload: CheckoutUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    checkout = db.query(Checkout).filter(Checkout.id == checkout_id).first()
    if not checkout:
        raise HTTPException(status_code=404, detail="Checkout not found")

    book = db.query(Book).filter(Book.id == checkout.book_id).first()

    VALID_TRANSITIONS = {
        "requested": {"approved", "declined"},
        "approved": {"returned"},
    }
    allowed = VALID_TRANSITIONS.get(checkout.status, set())
    if payload.status not in allowed:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot change status from '{checkout.status}' to '{payload.status}'",
        )

    if payload.status == "approved":
        if book.owner_id != current_user.id:
            raise HTTPException(status_code=403, detail="Only the book owner can approve")
        checkout.status = "approved"
        checkout.approved_at = datetime.utcnow()
        book.available = False

        notification = Notification(
            user_id=checkout.borrower_id,
            checkout_id=checkout.id,
            type="checkout_approved",
            message=f"Your request for {book.title} was approved!",
        )
        db.add(notification)

    elif payload.status == "declined":
        if book.owner_id != current_user.id:
            raise HTTPException(status_code=403, detail="Only the book owner can decline")
        checkout.status = "declined"

        notification = Notification(
            user_id=checkout.borrower_id,
            checkout_id=checkout.id,
            type="checkout_declined",
            message=f"Your request for {book.title} was declined",
        )
        db.add(notification)

    elif payload.status == "returned":
        if current_user.id not in (checkout.borrower_id, book.owner_id):
            raise HTTPException(status_code=403, detail="Not authorized")
        checkout.status = "returned"
        checkout.returned_at = datetime.utcnow()
        book.available = True

        notify_user = book.owner_id if current_user.id == checkout.borrower_id else checkout.borrower_id
        notification = Notification(
            user_id=notify_user,
            checkout_id=checkout.id,
            type="book_returned",
            message=f"{book.title} has been marked as returned",
        )
        db.add(notification)

    else:
        raise HTTPException(status_code=400, detail="Invalid status")

    db.commit()
    db.refresh(checkout)
    return checkout
