from flask import Flask, request, jsonify, send_from_directory
from functools import wraps
from werkzeug.utils import secure_filename
import jwt
import os
import hashlib
import datetime

# konstruktor
app = Flask(__name__)
app.url_map.strict_slashes = False

# tworzenie folderu magazynującego
# docelowo pliki zapisywane są w katalogach użytkowników
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# klucz do szyfrowania jwt, to czytamy z env w produkcji
KEY = "bezpiecznyklucz123"

# bardzo bezpieczna tablica użytkowników i haseł, bez pamięci trwałej!
# w wolnej chwili przenieść do sql i zhaszować
USERS = [
    {"email": "admin@example.com", "login": "admin", "password": "haslo123"},
    {"email": "user@example.com", "login": "uzytkownik", "password": "12345"}
]

# hasher - generuje identyfikatory
def hasher(plik):
    return hashlib.md5(plik.encode('utf-8')).hexdigest()

# upośledzony dehasher
def dehasher(id, user):
    dir = os.path.join(UPLOAD_FOLDER, user)
    for plik in os.listdir(dir):
        if hasher(plik) == id:
            return plik
    return None

# weryfikator tokenu - dekorator zapytania
# wiekszosc zapytan do api wymaga tokena, inaczej adios
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth = request.headers.get("Authorization", "")
        token = auth.replace("Bearer ", "")
        if not token:
            return jsonify({"error": "Token required"}), 401
        try:
            data = jwt.decode(token, KEY, algorithms=["HS256"])
            request.user = data["sub"]
        except:
            return jsonify({"error": "Invalid token"}), 401
        return f(*args, **kwargs)
    return decorated

# API
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()

    email = data.get('email')
    login = data.get('login')
    password = data.get('password')

    if not email or not login or not password:
        return jsonify({"error": "Wszystkie pola są wymagane"}), 400

    for user in USERS:
        if user['login'] == login:
            return jsonify({"error": "Login już istnieje"}), 400
        if user['email'] == email:
            return jsonify({"error": "Email już istnieje"}), 400
        #if user['password'] == password:
            #mały trol
            #return jsonify({"error": f"Hasło jest już używane przez użytkownika {user['login']}"}), 400

    # super baza
    USERS.append({
        "email": email,
        "login": login,
        "password": password
    })

    # katalog użytkownika
    os.makedirs(os.path.join("uploads", login), exist_ok=True)

    return jsonify({"message": "Rejestracja zakończona pomyślnie"}), 201

@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()

    login = data.get("login")
    password = data.get("password")

    for user in USERS:
        if user['login'] == login and user['password'] == password:
            token = jwt.encode({
                'sub': login,
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=2)
            }, KEY, algorithm="HS256")

            return jsonify({'token': token})        

    return jsonify({'error': 'Nieprawidłowy login lub hasło'}), 401

@app.route('/api/upload', methods=['POST'])
@token_required
def upload_file():
    file = request.files.get('file')
    user = request.user
    if file:
        user_folder = os.path.join("uploads", user)
        filepath = os.path.join(user_folder, file.filename)
        file.save(filepath)
        return jsonify({'status': 'success', 'filename': file.filename}), 200
    return jsonify({'status': 'error', 'message': 'No file uploaded'}), 400

@app.route('/api/files/<user>', methods=["GET"])
@token_required
def list_files(user):
    if user != request.user:
        return jsonify({"error": "Access denied"}), 403
    try:
        file_infos = []
        user_folder = os.path.join("uploads", user)
        for filename in os.listdir(user_folder):
            path = os.path.join(user_folder, filename)
            if os.path.isfile(path):
                stat = os.stat(path)
                file_infos.append({
                    'id': hasher(filename),
                    'name': filename,
                    'size': stat.st_size,
                    'extension': os.path.splitext(filename)[1].lower(),
                })
        return jsonify(file_infos)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route("/api/search", methods=["GET"])
@token_required
def search_files():
    query = request.args.get("search", "").lower()
    user = request.user

    matching_files = []
    dir = os.path.join(UPLOAD_FOLDER, user)

    for file in os.listdir(dir):
        if query in file.lower():
            path = os.path.join(dir, file)
            if os.path.isfile(path):
                stat = os.stat(path)
                matching_files.append({
                    'id': hasher(file),
                    'name': file,
                    'size': stat.st_size,
                    'extension': os.path.splitext(file)[1].lower(),
                })

    return jsonify(matching_files)

@app.route('/api/delete', methods=['POST'])
@token_required
def delete_file():
    data = request.get_json()
    user = request.user
    id = data.get('id')

    filename = dehasher(id, user)
    if not filename:
        return jsonify({'status': 'error', 'message': 'ID not found'}), 404
    
    # zapobiegamy atakom typu ../
    filename = secure_filename(filename)
    filepath = os.path.join(UPLOAD_FOLDER, user, filename)

    if os.path.exists(filepath):
        os.remove(filepath)
        return jsonify({'status': 'ok'})
    else:
        return jsonify({'status': 'not found'}), 404

# main
@app.route('/astracloud')
def serve_index():
    return send_from_directory('', 'index.html')

# serwowanie podstron flaskiem
@app.route('/login')
def serve_login():
    return send_from_directory('', 'login.html')

@app.route('/register')
def serve_register():
    return send_from_directory('', 'register.html')

@app.route('/account')
def serve_account():
    return send_from_directory('', 'account.html')

@app.route('/accountfail')
def serve_accountfail():
    return send_from_directory('', 'accountfail.html')

@app.route('/logout')
def serve_logout():
    return send_from_directory('', 'logout.html')

if __name__ == '__main__':
    app.run(host='127.0.0.1')
