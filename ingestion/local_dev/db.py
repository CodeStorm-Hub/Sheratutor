"""Local-dev Postgres connection helper — points at the userspace cluster
started for RAG testing (no root/Docker required). See local_dev/schema.sql
for why this exists instead of the real Supabase/pgvector setup."""

import psycopg2
import psycopg2.extras

DSN = "host=/tmp port=5433 dbname=sheratutor_local user=postgres"


def get_conn():
    conn = psycopg2.connect(DSN)
    psycopg2.extras.register_uuid()
    return conn
