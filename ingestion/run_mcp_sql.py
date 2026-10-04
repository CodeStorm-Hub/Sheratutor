#!/usr/bin/env python3
import os
import sys
import json
import subprocess
import time
from dotenv import load_dotenv

load_dotenv("/home/kratzer/workspace/Sheratutor/web/.env.local")
token = os.getenv("SUPABASE_ACCESS_TOKEN", "")
project_id = "qjottictwewysfcjirma"

if len(sys.argv) < 2:
    print("Usage: python run_mcp_sql.py '<SQL_QUERY>'")
    sys.exit(1)

query = sys.argv[1]

env = os.environ.copy()
env["SUPABASE_ACCESS_TOKEN"] = token

p = subprocess.Popen(
    ["npx", "-y", "@supabase/mcp-server-supabase"],
    stdin=subprocess.PIPE,
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
    text=True,
    env=env
)

def send_msg(method, params, req_id):
    msg = json.dumps({"jsonrpc": "2.0", "id": req_id, "method": method, "params": params}) + "\n"
    p.stdin.write(msg)
    p.stdin.flush()

send_msg("initialize", {"protocolVersion": "2024-11-05", "capabilities": {}, "clientInfo": {"name": "sheratutor-cli", "version": "1.0"}}, 1)

# read response until id 1
while True:
    line = p.stdout.readline()
    if not line:
        break
    try:
        obj = json.loads(line)
        if obj.get("id") == 1:
            break
    except:
        pass

send_msg("tools/call", {"name": "execute_sql", "arguments": {"project_id": project_id, "query": query}}, 2)

result_text = None
while True:
    line = p.stdout.readline()
    if not line:
        break
    try:
        obj = json.loads(line)
        if obj.get("id") == 2:
            res = obj.get("result", {})
            content = res.get("content", [])
            if content:
                result_text = content[0].get("text", "")
            break
    except:
        pass

p.terminate()

if result_text:
    try:
        data = json.loads(result_text)
        print(data.get("result", result_text))
    except:
        print(result_text)
else:
    print("No response from MCP server")
