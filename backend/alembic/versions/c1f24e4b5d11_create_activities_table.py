"""create activities table

Revision ID: c1f24e4b5d11
Revises: 7bbc58345bd3
Create Date: 2026-06-01 03:10:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c1f24e4b5d11'
down_revision: Union[str, Sequence[str], None] = '7bbc58345bd3'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'activities',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('customer_id', sa.Integer(), nullable=False),
        sa.Column('type', sa.String(), nullable=False),
        sa.Column('note', sa.String(), nullable=False),
        sa.Column('activity_date', sa.DateTime(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['customer_id'], ['customers.id']),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_activities_id'), 'activities', ['id'], unique=False)
    op.create_index(op.f('ix_activities_customer_id'), 'activities', ['customer_id'], unique=False)
    op.create_index(op.f('ix_activities_type'), 'activities', ['type'], unique=False)
    op.create_index(op.f('ix_activities_activity_date'), 'activities', ['activity_date'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_activities_activity_date'), table_name='activities')
    op.drop_index(op.f('ix_activities_type'), table_name='activities')
    op.drop_index(op.f('ix_activities_customer_id'), table_name='activities')
    op.drop_index(op.f('ix_activities_id'), table_name='activities')
    op.drop_table('activities')
