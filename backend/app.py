import os
import logging
from dotenv import load_dotenv
from google import genai
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

load_dotenv() 
geminiKey = os.getenv("GEMINI_API_KEY") 
client = genai.Client(api_key=geminiKey) 

logging.basicConfig(level = logging.INFO)

def prompt_simplificar(texto):
    return (
        f"Você é a OlivIA, uma assistente didática e acolhedora. "
        f"Seu objetivo é RESUMIR o texto abaixo para uma criança de 10 a 13 anos com TDAH ou TEA. "
        f"Siga estas regras estritamente:\n"
        f"1. Use linguagem clara, direta e sem metáforas.\n"
        f"2. Reduza ao essencial em no máximo 3 frases.\n"
        f"3. Não use negrito, itálico, asteriscos ou qualquer formatação markdown.\n"
        f"4. Foque apenas na ideia principal e use palavras simples.\n\n"
        f"Texto: {texto}"
        )

def prompt_explicar(texto):
     return (
        f"Você é a OlivIA, uma assistente didática e acolhedora. "
        f"Seu objetivo é EXPLICAR o texto abaixo para uma criança de 10 a 13 anos com TDAH ou TEA. "
        f"Siga estas regras estritamente:\n"
        f"1. Use linguagem clara, direta e sem metáforas.\n"
        f"2. Explique 'o que é' de forma literal em no MÁXIMO 5 ou 6 frases curtas.\n"
        f"3. Não use negrito, itálico, asteriscos ou qualquer formatação markdown.\n"
        f"4. Foque apenas na ideia principal e use palavras simples.\n\n"
        f"Texto: {texto}"
        )

@app.route('/')
def home():
    return "Servidor da Olívia Online! 🚀", 200

@app.route('/simplify', methods=['POST'])
def simplify():
    dados = request.get_json()
    texto_recebido = dados.get('text', '').strip()

    if not texto_recebido:
        return jsonify({"error": "Ops! Você esqueceu de enviar o texto."}), 400
    
    logging.info(f"Simplificando: {len(texto_recebido)} caracteres")

    try:
        response = client.models.generate_content(
            model = "gemini-2.5-flash", 
            contents = prompt_simplificar(texto_recebido)
    )
        
        texto_limpo = response.text.strip()
        return jsonify({"message": texto_limpo, "status": "sucesso"}), 200
    
    except Exception as e:
        logging.error(f'Erro no Gemini: {e}')
        return jsonify({"error": "A OlivIA se distraiu um pouco. Tente novamente!"}), 500
    
@app.route('/explain', methods=['POST']) 
def explain():
    dados = request.get_json() or {}
    texto_recebido = dados.get('text', '').strip()

    if not texto_recebido:
        return jsonify({"error": "Texto vazio"}), 400
    
    logging.info(f"Recebi {len(texto_recebido)} caracteres para processar!")

    try:
        response = client.models.generate_content(
            model = "gemini-2.5-flash", 
            contents = prompt_explicar(texto_recebido)
        )
    
        texto_limpo = response.text.strip()
        return jsonify({"message": texto_limpo, "status": "sucesso"}), 200

    except Exception as e:
        logging.error(f"Erro no Gemini: {e}")
        return jsonify({"error": "A OlívIA se distraiu um pouco. Tente novamente!"}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
    