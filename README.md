# OlivIA

<aside>

Extensão do Chrome para apoiar estudos de pessoas de 10 a 13 anos com TDAH e TEA, simplificando conteúdo web com IA (Gemini).

</aside>

---

## 📝 Visão Geral

A **OlívIA** processa conteúdos web complexos e devolve versões mais **simples e diretas** do texto.

---

## 📂 Estrutura do projeto

> A estrutura modular permite que a equipe trabalhe em paralelo sem conflitos.
> 

```
/backend     # Servidor Python (Flask) que faz a ponte com a IA
/extension   # Código do plugin Chrome
--/assets      # Ícones, Imagens...
--/css         # Estilização da interface (styles.css)
--/modules     # Lógica de negócio (API, Scraper, UI)
```

---

## 📂 Dicionário de Arquivos

### Backend (Servidor)

- **`app.py`**: O cérebro do servidor. Recebe os textos da extensão, envia para o Gemini e devolve a resposta simplificada.
- **`.env`**: Guarda sua `GEMINI_API_KEY` de forma privada.
- **`requirements.txt`**: Contém as bibliotecas necessárias para o Python rodar (Flask, Google GenAI, etc).

### Extensão (Chrome)

- **`manifest.json`**: O manual de instruções. Diz ao Chrome quais arquivos usar, as permissões e os ícones da OlívIA.
- **`content.js`**: Coordena a extração do texto, a chamada da API e a exibição do resultado na página.
- **`background.js`**: Fica em segundo plano esperando o usuário clicar no menu de contexto (botão direito) ou no ícone.

### Módulos (Lógica Isolada)

- **`modules/scraper.js`**: Limpa a página HTML para extrair apenas o texto que importa, removendo anúncios e menus.
- **`modules/api.js`**: Faz a ponte de comunicação entre a extensão e o seu servidor Python local.
- **`modules/oliviaUI.js`**: Cria e controla todos os elementos visuais da OlívIA que aparecem para o usuário.

### Estilos e Assets

- **`css/styles.css`**:  Define as cores, fontes e o visual amigável da interface.
- **`assets/`**: Guarda os ícones da OlívIA em diferentes tamanhos para o navegador.

---

## 🛠️ Configuração do ambiente

- 1. Criar ambiente virtual (venv)
    
    Dentro da pasta `/backend`, execute:
    
    ```bash
    python -m venv venv
    ```
    
- 2. Ativar o venv
    - **Windows**
    
    ```powershell
    .\venv\Scripts\activate
    ```
    
    - **Mac/Linux**
    
    ```bash
    source venv/bin/activate
    ```
    
- 3. Instalar dependências do `requirements.txt`
    
    ```bash
    pip install -r requirements.txt
    ```
    

<aside>
⚠️

**Atenção:** nunca suba a pasta `venv` ou o arquivo `.env` para o repositório. Use o `.gitignore`.

</aside>

---

## 🏁 Como testar

1. Inicie o backend: `python app.py`.
2. No Chrome, acesse `chrome://extensions/`.
3. Ative o **Modo do Desenvolvedor**.
4. Clique em **Carregar sem compactação** e selecione a pasta `/extension`.
5. Abra qualquer site e clique no ícone da OlívIA ou use o botão direito em um texto selecionado.

---
