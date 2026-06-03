"""add users and customer ownership

Revision ID: 0d3c9f9e9a11
Revises: c1f24e4b5d11
Create Date: 2026-06-03 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect


revision: str = "0d3c9f9e9a11"
down_revision: Union[str, Sequence[str], None] = "c1f24e4b5d11"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    bind = op.get_bind()
    inspector = inspect(bind)
    dialect_name = bind.dialect.name

    if "users" not in inspector.get_table_names():
        op.create_table(
            "users",
            sa.Column("id", sa.Integer(), nullable=False),
            sa.Column("email", sa.String(length=255), nullable=False),
            sa.Column("password_hash", sa.String(length=255), nullable=False),
            sa.Column("created_at", sa.DateTime(), nullable=False),
            sa.PrimaryKeyConstraint("id"),
            sa.UniqueConstraint("email"),
        )

    user_indexes = {index["name"] for index in inspector.get_indexes("users")} if "users" in inspector.get_table_names() else set()
    if op.f("ix_users_email") not in user_indexes:
        op.create_index(op.f("ix_users_email"), "users", ["email"], unique=True)
    if op.f("ix_users_id") not in user_indexes:
        op.create_index(op.f("ix_users_id"), "users", ["id"], unique=False)

    customer_columns = {column["name"] for column in inspector.get_columns("customers")}
    if "owner_id" not in customer_columns:
        op.add_column("customers", sa.Column("owner_id", sa.Integer(), nullable=True))

    customer_indexes = {index["name"] for index in inspector.get_indexes("customers")}
    if op.f("ix_customers_owner_id") not in customer_indexes:
        op.create_index(op.f("ix_customers_owner_id"), "customers", ["owner_id"], unique=False)

    foreign_keys = {fk["name"] for fk in inspector.get_foreign_keys("customers")}
    if dialect_name != "sqlite" and "fk_customers_owner_id_users" not in foreign_keys:
        op.create_foreign_key("fk_customers_owner_id_users", "customers", "users", ["owner_id"], ["id"])


def downgrade() -> None:
    op.drop_constraint("fk_customers_owner_id_users", "customers", type_="foreignkey")
    op.drop_index(op.f("ix_customers_owner_id"), table_name="customers")
    op.drop_column("customers", "owner_id")
    op.drop_index(op.f("ix_users_id"), table_name="users")
    op.drop_index(op.f("ix_users_email"), table_name="users")
    op.drop_table("users")
