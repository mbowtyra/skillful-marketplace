"""initial schema

Revision ID: 001
Revises:
Create Date: 2026-04-20
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID

revision = "001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("email", sa.String(), nullable=False, unique=True, index=True),
        sa.Column("display_name", sa.String(), nullable=False),
        sa.Column("password_hash", sa.String(), nullable=False),
        sa.Column("avatar_url", sa.String(), nullable=True),
        sa.Column("created_at", sa.DateTime(), server_default=sa.text("now()")),
    )

    op.create_table(
        "books",
        sa.Column("id", UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("owner_id", UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("title", sa.String(), nullable=False, index=True),
        sa.Column("author", sa.String(), nullable=False, index=True),
        sa.Column("cover_image_url", sa.String(), nullable=True),
        sa.Column("spine_color", sa.String(), server_default="'#8B4513'"),
        sa.Column("condition", sa.String(), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("available", sa.Boolean(), server_default=sa.text("true")),
        sa.Column("exchange_type", sa.String(), server_default="'both'"),
        sa.Column("created_at", sa.DateTime(), server_default=sa.text("now()")),
    )

    op.create_table(
        "checkouts",
        sa.Column("id", UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("book_id", UUID(as_uuid=True), sa.ForeignKey("books.id"), nullable=False),
        sa.Column("borrower_id", UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("status", sa.String(), server_default="'requested'"),
        sa.Column("exchange_method", sa.String(), nullable=False),
        sa.Column("borrower_note", sa.Text(), nullable=True),
        sa.Column("requested_at", sa.DateTime(), server_default=sa.text("now()")),
        sa.Column("approved_at", sa.DateTime(), nullable=True),
        sa.Column("returned_at", sa.DateTime(), nullable=True),
    )

    op.create_table(
        "notifications",
        sa.Column("id", UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("user_id", UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("checkout_id", UUID(as_uuid=True), sa.ForeignKey("checkouts.id"), nullable=True),
        sa.Column("type", sa.String(), nullable=False),
        sa.Column("message", sa.Text(), nullable=False),
        sa.Column("read", sa.Boolean(), server_default=sa.text("false")),
        sa.Column("created_at", sa.DateTime(), server_default=sa.text("now()")),
    )


def downgrade() -> None:
    op.drop_table("notifications")
    op.drop_table("checkouts")
    op.drop_table("books")
    op.drop_table("users")
