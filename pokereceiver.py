from flask import Flask, request
import os
import time

app = Flask(__name__)

# The folder where screenshots will save on your laptop
UPLOAD_FOLDER = os.path.expanduser("~/Desktop/Screenshots") 
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/upload', methods=['POST'])
def upload_file():
    # DEBUG PART: Force Flask to read the raw incoming network stream 
    # skipping standard form parsing to prevent 400 errors
    image_data = request.get_data(parse_form_data=False)
    
    # DEBUG PART: Print out exactly how many bytes hit the server
    print(f"Received data size: {len(image_data)} bytes") 
    
    # Validation check
    if not image_data or len(image_data) < 100:
        print("Error: Received data package was empty or too small.")
        return 'No data or file too small', 400
    
    # Generate a unique filename using the current timestamp
    filename = f"screenshot_{int(time.time())}.jpg"
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    
    # Write the binary data stream directly into a JPG file
    try:
        with open(filepath, 'wb') as f:
            f.write(image_data)
        print(f"Success! Saved to: {filename}")
        return 'Upload successful', 200
    except Exception as e:
        print(f"Error saving file: {str(e)}")
        return 'Server file writing error', 500

if __name__ == '__main__':
    print("--------------------------------------------------")
    print(f"Receiver active. Screenshots will save to: {UPLOAD_FOLDER}")
    print("--------------------------------------------------")
    # Listens on all local network interfaces on port 5000
    app.run(host='0.0.0.0', port=5000)