import os
from dotenv import load_dotenv
from google import genai
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

load_dotenv() 

gemini_key = "COLOQUE O SEU GEMINI_KEY AQUI"

client = genai.Client(api_key=gemini_key)

@app.route('/')
def home():
    return "Servidor da Olívia Online!"

@app.route('/simplify', methods=['POST'])
def simplify():
    try:
        dados = request.get_json()
        if not dados or 'text' not in dados:
            return jsonify({"status": "error", "message": "Texto não enviado"}), 400
            
        texto_recebido = dados.get('text', '')

        response = client.models.generate_content(
            model="gemini-2.0-flash", 
            contents=f"Você é OlívIA, assistente de estudos para crianças de 10 a 13 anos com TEA e TDAH. Resuma de forma muito simples em até 5 frases, sem markdown: {texto_recebido}"
        )

        return jsonify({
            "message": response.text,
            "status": "success"
        }), 200
    except Exception as e:
        print(f"Erro: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/explain', methods=['POST'])
def explain():
    dados = request.get_json()
    texto_recebido = dados.get('text', '')

    response = client.models.generate_content(
            model="gemini-2.0-flash", 
            contents=f"Você é OlívIA, uma assistente de estudos para crianças com TEA e TDAH. Explique de maneira simplificada em até 3 frases: {texto_recebido}"
        )

    return jsonify({
        "message": response.text,
        "status": "processado"
    }), 200

if __name__ == '__main__':
    app.run(port=5000, debug=True)