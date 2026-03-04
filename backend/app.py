import os
from dotenv import load_dotenv
from google import genai
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)

CORS(app) # O CORS permite que a extensão (Chrome) converse com este servidor (Python)

load_dotenv() # Pega as variavei sensívei do arquivo .env

geminiKey = os.getenv("GEMINI_API_KEY") 
client = genai.Client(api_key=geminiKey) # Inicialização do Cliente Gemini

#-------

def criar_prompt(texto, max_frases = 5):
    """
    Gera o prompt focado em acessibilidade.
    Linguagem literal, frases curtas e sem distrações visuais(markdowns)
    """
    return (
        f"Você é a OlivIA, uma assistente didática e acolhedora. "
        f"Seu objetivo é explicar o texto abaixo para uma criança de 10 a 13 anos com TDAH ou TEA. "
        f"Siga estas regras estritamente:\n"
        f"1. Use linguagem clara, direta e sem metáforas.\n"
        f"2. Use no máximo {max_frases} frases curtas.\n"
        f"3. Não use negrito, itálico, asteriscos ou qualquer formatação markdown.\n"
        f"4. Foque apenas na ideia principal e use palavras simples.\n\n"
        f"Texto para simplificar: {texto}")


@app.route('/')
def home():
    return "Servidor da Olívia Online! 🚀"


@app.route('/simplify', methods=['POST']) # Aceita apenas POST
def simplify():
    dados = request.get_json()
    texto_recebido = dados.get('text', '')
    
    print(f"Recebi {len(texto_recebido)} caracteres para processar!")

    response = client.models.generate_content(
            model = "gemini-2.5-flash", 
            contents = criar_prompt(texto_recebido, max_frases = 5)
    )

    print(response.text)

    return jsonify({
        "message": response.text,
        "status": "processado"
    }), 200


@app.route('/explain', methods=['POST']) # Aceita apenas POST
def explain():
    dados = request.get_json()
    texto_recebido = dados.get('text', '')

    print(f"Recebi {len(texto_recebido)} caracteres para processar!")

    response = client.models.generate_content(
            model = "gemini-2.5-flash", 
            contents = criar_prompt(texto_recebido, max_frases = 3)
    )

    print(response.text)

    return jsonify({
        "message": response.text,
        "status": "processado"
    }), 200


if __name__ == '__main__':
    app.run(port=5000, debug=True)