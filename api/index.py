import os
import json
import subprocess
import threading
import time
from flask import Flask, request, jsonify, Response, stream_with_context
from flask_cors import CORS
from pathlib import Path

app = Flask(__name__)
CORS(app)

# Configuration
BOT_DIR = Path(__file__).parent.parent / "my-bot"
TOKEN_FILE = BOT_DIR / "amine_token.txt"
LOG_BUFFER = []
LOG_LOCK = threading.Lock()
bot_process = None

# Ensure bot directory exists
BOT_DIR.mkdir(exist_ok=True)

def add_log(message):
    """Add log message to buffer"""
    with LOG_LOCK:
        LOG_BUFFER.append(message)
        if len(LOG_BUFFER) > 1000:
            LOG_BUFFER.pop(0)
    print(f"[BOT LOG] {message}")

@app.route('/api/bot', methods=['GET', 'POST'])
def bot_handler():
    global bot_process
    
    if request.method == 'GET':
        action = request.args.get('action')
        
        # SSE Stream for live logs
        if action == 'stream_logs':
            def generate():
                last_index = 0
                while True:
                    with LOG_LOCK:
                        if last_index < len(LOG_BUFFER):
                            for log in LOG_BUFFER[last_index:]:
                                yield f"data: {json.dumps({'log': log})}\n\n"
                            last_index = len(LOG_BUFFER)
                    
                    if bot_process and bot_process.poll() is not None:
                        yield f"data: {json.dumps({'status': 'completed'})}\n\n"
                        break
                    
                    time.sleep(0.5)
            
            return Response(stream_with_context(generate()), 
                          mimetype='text/event-stream',
                          headers={'Cache-Control': 'no-cache'})
        
        return jsonify({"status": "ok", "message": "Bot API is running"})
    
    elif request.method == 'POST':
        data = request.get_json()
        action = data.get('action')
        
        # Save credentials to amine_token.txt
        if action == 'save_credentials':
            guest_id = data.get('guest_id')
            guest_password = data.get('guest_password')
            
            if not guest_id or not guest_password:
                return jsonify({"error": "Missing credentials"}), 400
            
            # Save in required format
            token_data = {guest_id: guest_password}
            with open(TOKEN_FILE, 'w') as f:
                json.dump(token_data, f)
            
            add_log(f"SUCCESS: Credentials saved for {guest_id}")
            return jsonify({"status": "success", "message": "Credentials saved"})
        
        # Start bot process
        elif action == 'start_bot':
            if bot_process and bot_process.poll() is None:
                return jsonify({"error": "Bot already running"}), 400
            
            # Check if token file exists
            if not TOKEN_FILE.exists():
                return jsonify({"error": "No credentials found. Please save credentials first"}), 400
            
            try:
                # Run main.py from my-bot directory
                bot_process = subprocess.Popen(
                    ['python', str(BOT_DIR / 'main.py')],
                    cwd=str(BOT_DIR),
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    text=True,
                    bufsize=1
                )
                
                # Start threads to read output
                def read_output(pipe, is_error=False):
                    for line in iter(pipe.readline, ''):
                        if line.strip():
                            prefix = "ERROR" if is_error else "INFO"
                            add_log(f"[{prefix}] {line.strip()}")
                
                threading.Thread(target=read_output, args=(bot_process.stdout, False), daemon=True).start()
                threading.Thread(target=read_output, args=(bot_process.stderr, True), daemon=True).start()
                
                add_log("SUCCESS: Bot process started")
                return jsonify({"status": "success", "message": "Bot started"})
            
            except Exception as e:
                add_log(f"ERROR: Failed to start bot - {str(e)}")
                return jsonify({"error": str(e)}), 500
        
        # Stop bot process
        elif action == 'stop_bot':
            if bot_process and bot_process.poll() is None:
                bot_process.terminate()
                bot_process.wait(timeout=5)
                add_log("SYSTEM: Bot stopped by user")
                return jsonify({"status": "success", "message": "Bot stopped"})
            else:
                return jsonify({"status": "info", "message": "No bot running"})
        
        return jsonify({"error": "Invalid action"}), 400

@app.route('/api/bot/status', methods=['GET'])
def bot_status():
    global bot_process
    is_running = bot_process and bot_process.poll() is None
    return jsonify({
        "running": is_running,
        "pid": bot_process.pid if bot_process and is_running else None
    })

# Vercel handler
def handler(event, context):
    return app(event, context)

if __name__ == '__main__':
    app.run(debug=True, port=5000)