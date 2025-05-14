from flask import Flask, jsonify
from flask_cors import CORS  # Importa CORS
import requests
from urllib.parse import unquote

app = Flask(__name__)
CORS(app)  # Habilita CORS para todas las rutas

MAGICLOOPS_URL = 'https://magicloops.dev/api/loop/f8482be7-eb54-4d7d-8f37-c3e3e6a2b40d/run'

@app.route('/ask/<level>/<path:question>', methods=['GET'])
def ask(level, question):
    decoded_question = unquote(question)  # para manejar espacios y caracteres especiales
    payload = {
        "level": level,
        "question": decoded_question
    }

    try:
        response = requests.get(MAGICLOOPS_URL, json=payload)
        response.raise_for_status()
        return jsonify(response.json())
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
