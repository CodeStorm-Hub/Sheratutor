#!/usr/bin/env python3
import os
import json
from pathlib import Path
from dotenv import load_dotenv
import psycopg2

load_dotenv("/home/syed/workspace/Sheratutor/ingestion/.env")

# Direct vector query using Supabase MCP or psycopg2 or Supabase client
# Let's read the vector from /tmp/test_q_vec.json
q_vec = json.loads(Path("/tmp/test_q_vec.json").read_text())

# Use Supabase client via REST RPC or SQL
print(f"Vector loaded with length: {len(q_vec)}")
