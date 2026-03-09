import os
import logging
from dotenv import load_dotenv
from google import genai
from flask import Flask, jsonify, request
from flask_cors import CORS

# 1. CONFIGURA O LOGGING PRIMEIRO, PARA QUE TODOS OS LOGS ABAIXO FUNCIONEM
logging.basicConfig(level=logging.INFO)

# 2. CARREGA O .ENV
load_dotenv()

app = Flask(__name__)
CORS(app)

# 3. BUSCA A CHAVE E INICIALIZA O CLIENTE
geminiKey = os.getenv("GEMINI_API_KEY")
client = None

if not geminiKey:
    logging.error("ERRO CRÍTICO: Variável GEMINI_API_KEY não encontrada no arquivo .env")
else:
    client = genai.Client(api_key=geminiKey)
    logging.info("Cliente Gemini inicializado com sucesso.")

def criar_prompt(texto, max_frases=5):
    """
    Gera o prompt focado em acessibilidade.
    Linguagem literal, frases curtas e sem distrações visuais (markdowns)
    """
    return (
        f"Você é a OlivIA, uma assistente didática e acolhedora. "
        f"Seu objetivo é explicar o texto abaixo para uma criança de 10 a 13 anos com TDAH ou TEA. "
        f"Siga estas regras estritamente:\n"
        f"1. Use linguagem clara, direta e sem metáforas.\n"
        f"2. Use no máximo {max_frases} frases curtas.\n"
        f"3. Não use negrito, itálico, asteriscos ou qualquer formatação markdown.\n"
        f"4. Foque apenas na ideia principal e use palavras simples.\n\n"
        f"Texto para simplificar: {texto}"
    )

@app.route('/')
def home():
    return "Servidor da Olívia Online! 🚀", 200

@app.route('/simplify', methods=['POST'])
def simplify():
    if not client:
        return jsonify({"error": "Servidor não configurado. Verifique o arquivo .env."}), 503

    dados = request.get_json() or {}
    texto_recebido = dados.get('text', '').strip()[:12000]

    if not texto_recebido:
        return jsonify({"error": "Ops! Você esqueceu de enviar o texto."}), 400

    logging.info(f"Simplificando: {len(texto_recebido)} caracteres")

    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=criar_prompt(texto_recebido, max_frases=5)
        )

        texto_limpo = response.text.strip()
        return jsonify({"message": texto_limpo, "status": "sucesso"}), 200

    except Exception as e:
        logging.error(f'Erro no Gemini: {e}')
        return jsonify({"error": "A OlivIA se distraiu um pouco. Tente novamente!"}), 500
    
@app.route('/explain', methods=['POST'])
def explain():
    if not client:
        return jsonify({"error": "Servidor não configurado. Verifique o arquivo .env."}), 503

    dados = request.get_json() or {}
    texto_recebido = dados.get('text', '').strip()[:12000]

    if not texto_recebido:
        return jsonify({"error": "Ops! Você esqueceu de enviar o texto."}), 400

    logging.info(f"Explicando: {len(texto_recebido)} caracteres")

    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=criar_prompt(texto_recebido, max_frases=3)
        )

        texto_limpo = response.text.strip()
        return jsonify({"message": texto_limpo, "status": "sucesso"}), 200

    except Exception as e:
        logging.error(f"Erro no Gemini: {e}")
        return jsonify({"error": "A OlívIA se distraiu um pouco. Tente novamente!"}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)    