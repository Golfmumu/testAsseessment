#!/usr/bin/env python3
import http.server
import socketserver
import os
from pathlib import Path

os.chdir(Path(__file__).parent / 'public')
PORT = 3000

Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"\n🚀 Website is running on http://localhost:{PORT}")
    print(f"📁 Serving files from: {os.getcwd()}\n")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n\nServer stopped.")
