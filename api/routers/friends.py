from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional

from db import get_db
from models.user import User, Friendship
from auth import get_current_user

router = APIRouter(prefix="/friends", tags=["friends"])


class FriendInfo(BaseModel):
    id: str
    display_name: str
    avatar_url: Optional[str] = None
    friend_code: str

    class Config:
        from_attributes = True


class FriendshipOut(BaseModel):
    id: str
    friend: FriendInfo

    class Config:
        from_attributes = True


@router.get("/my-code")
def get_my_code(current_user: User = Depends(get_current_user)):
    return {"friend_code": current_user.friend_code}


@router.post("/add", status_code=status.HTTP_201_CREATED)
def add_friend(
    body: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    code = (body.get("friend_code") or "").strip().upper()
    if not code:
        raise HTTPException(status_code=400, detail="friend_code is required")

    target = db.query(User).filter(User.friend_code == code).first()
    if not target:
        raise HTTPException(status_code=404, detail="No user found with that friend code")
    if target.id == current_user.id:
        raise HTTPException(status_code=400, detail="You can't add yourself")

    existing = db.query(Friendship).filter(
        Friendship.user_id == current_user.id,
        Friendship.friend_id == target.id,
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already friends")

    # Create both directions so the relationship is mutual
    db.add(Friendship(user_id=current_user.id, friend_id=target.id))
    db.add(Friendship(user_id=target.id, friend_id=current_user.id))
    db.commit()

    return {"message": f"You're now friends with {target.display_name}!", "friend": {
        "id": target.id,
        "display_name": target.display_name,
        "avatar_url": target.avatar_url,
        "friend_code": target.friend_code,
    }}


@router.get("", response_model=list[FriendInfo])
def list_friends(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    friendships = db.query(Friendship).filter(Friendship.user_id == current_user.id).all()
    return [f.friend for f in friendships]


@router.delete("/{friend_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_friend(
    friend_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    db.query(Friendship).filter(
        Friendship.user_id == current_user.id,
        Friendship.friend_id == friend_id,
    ).delete()
    db.query(Friendship).filter(
        Friendship.user_id == friend_id,
        Friendship.friend_id == current_user.id,
    ).delete()
    db.commit()
