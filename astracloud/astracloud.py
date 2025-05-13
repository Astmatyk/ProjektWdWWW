from flask import Flask, request, jsonify, send_from_directory
import os

# konstruktor
app = Flask(__name__)
app.url_map.strict_slashes = False

# tworzenie folderu magazynującego
# to docelowo może być podkatalogiem użytkownika
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/upload', methods=['POST'])
def upload_file():
    file = request.files.get('file')
    if file:
        filepath = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(filepath)
        return jsonify({'status': 'success', 'filename': file.filename}), 200
    return jsonify({'status': 'error', 'message': 'No file uploaded'}), 400

@app.route('/files')
def list_files():
    try:
        file_infos = []
        for filename in os.listdir(UPLOAD_FOLDER):
            path = os.path.join(UPLOAD_FOLDER, filename)
            if os.path.isfile(path):
                file_infos.append({
                    'name': filename,
                })
        return jsonify(file_infos)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/astracloud')
def serve_index():
    return send_from_directory('', 'index.html')

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1')
