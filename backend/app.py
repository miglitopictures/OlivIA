import os
from pathlib import Path
from flask_cors import CORS
from dotenv import load_dotenv
from google import genai
from flask import Flask, jsonify, request, send_from_directory

app = Flask(__name__)

CORS(app)  # CORS permite extensão Chrome e frontend web conversarem com o servidor

# Pasta do frontend (relativa ao backend)
FRONTEND_DIR = Path(__file__).resolve().parent.parent / "frontend"

load_dotenv() # Pega as variavei sensívei do arquivo .env

geminiKey = os.getenv("GEMINI_API_KEY") 
client = genai.Client(api_key=geminiKey) # Inicialização do Cliente Gemini

#-------


@app.route('/')
def home():
    return "Servidor da OlivIA Online! Acesse /app para acessar o frontend."


@app.route('/health')
def health():
    """Verifica se o backend está online (para debug)."""
    return jsonify({"status": "ok", "message": "Backend conectado"}), 200


@app.route('/app')
@app.route('/app/')
def app_index():
    """Serve o frontend da OlivIA."""
    return send_from_directory(FRONTEND_DIR, "index.html")


@app.route('/app/<path:filename>')
def app_static(filename):
    """Serve CSS, JS e outros arquivos do frontend."""
    return send_from_directory(FRONTEND_DIR, filename)


def _call_gemini(prompt):
    """Chama o Gemini e retorna o texto ou levanta exceção."""
    if not geminiKey:
        raise ValueError("GEMINI_API_KEY não configurada. Crie o arquivo .env na pasta backend.")
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
    )
    try:
        return response.text
    except (ValueError, AttributeError):
        c = getattr(response, 'candidates', []) or []
        if c and hasattr(c[0], 'content') and c[0].content and c[0].content.parts:
            return c[0].content.parts[0].text or str(response)
        return str(response)


@app.route('/simplify', methods=['POST'])
def simplify():
    try:
        dados = request.get_json(silent=True, force=True) or {}
        texto_recebido = dados.get('text', '')[:12000]
        print(f"[simplify] Recebido: {len(texto_recebido)} caracteres")
        if not texto_recebido.strip():
            return jsonify({"message": "Texto vazio.", "error": "empty"}), 400
        prompt = f"Você é OlívIA, assistente de estudos para crianças de 5 a 10 anos com TEA e TDAH. Simplifique o texto em até 5 frases (não use markdown): {texto_recebido}"
        result = _call_gemini(prompt)
        return jsonify({"message": result, "status": "processado"}), 200
    except Exception as e:
        print(f"Erro /simplify: {e}")
        return jsonify({"message": str(e), "error": "api_error"}), 500


@app.route('/explain', methods=['POST'])
def explain():
    try:
        dados = request.get_json(silent=True, force=True) or {}
        texto_recebido = dados.get('text', '')[:12000]
        print(f"[explain] Recebido: {len(texto_recebido)} caracteres")
        if not texto_recebido.strip():
            return jsonify({"message": "Texto vazio.", "error": "empty"}), 400
        prompt = f"Você é OlívIA, assistente de estudos para crianças de 5 a 10 anos com TEA e TDAH. Explique em até 3 frases simples: {texto_recebido}"
        result = _call_gemini(prompt)
        print(f"[explain] Sucesso: {len(result)} caracteres")
        return jsonify({"message": result, "status": "processado"}), 200
    except Exception as e:
        print(f"[explain] Erro: {e}")
        return jsonify({"message": str(e), "error": "api_error"}), 500


if __name__ == '__main__':
    app.run(port=5000, debug=True)