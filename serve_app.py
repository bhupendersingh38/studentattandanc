"""
Simple HTTP Server to serve the app.html file
This fixes CORS issues when opening HTML from file system
"""
import http.server
import socketserver
import webbrowser
import os

PORT = 3000

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        super().end_headers()
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

def start_server():
    # Change to the directory where app.html is located
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    Handler = MyHTTPRequestHandler
    
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print("=" * 60)
        print("  AttendX AI - Frontend Server")
        print("=" * 60)
        print(f"\n✅ Server started successfully!")
        print(f"\n🌐 Open this URL in your browser:")
        print(f"   http://localhost:{PORT}/app.html")
        print(f"\n📊 Backend API: http://localhost:8000")
        print(f"📚 API Docs: http://localhost:8000/docs")
        print(f"\n🔑 Login Credentials:")
        print(f"   Student: 21CS001 / Std@C001")
        print(f"   Teacher: T001 / Tech@T001")
        print(f"   Admin: ADM001 / Adm@001")
        print(f"\n⚠️  Keep this window open!")
        print(f"   Press CTRL+C to stop the server")
        print("=" * 60)
        print()
        
        # Auto-open browser
        webbrowser.open(f'http://localhost:{PORT}/app.html')
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n🛑 Server stopped")
            httpd.shutdown()

if __name__ == "__main__":
    start_server()
