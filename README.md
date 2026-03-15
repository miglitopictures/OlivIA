# OlivIA

<aside>

Extensão do Chrome para apoiar estudos de pessoas de 10 a 13 anos com TDAH e TEA, simplificando conteúdo web com IA (Gemini).

</aside>

---

## MVP

A **OlivIA** processa conteúdos web complexos e devolve versões mais **simples e diretas** do texto. É nessa funcionalidade central que focamos os esforços do nosso MVP.

[![Watch the video](https://img.youtube.com/vi/H1Cgc1ZoZas/maxresdefault.jpg)](https://youtu.be/H1Cgc1ZoZas)

### [Watch this video on YouTube](https://youtu.be/H1Cgc1ZoZas)

---

## História e Fluxo

**"Como estudante com TDAH, quero poder resumir páginas complexas da web"**, essa é a história principal da OlivIA.

Para contemplar essa funcionalidade base, utilizamos a API de extensões do Chrome para "sumonar" a assitente virtual em qualquer site, assim como Flask no backend para enviar os prompts personalizados para geração do resumo com o Gemini.

### Fluxo Principal (Resumo de Página):

1. **Entrada:** O estudante acessa uma página web com conteúdo extenso ou complexo.

2. **Ação:** Clica no ícone da OlivIA na barra de extensões do Chrome e pede o resumo de página.

3. **Processamento:** A extensão limpar o excesso de informações (anúncios/menus) e envia o texto puro para o backend Flask onde será criado o prompt.

4. **IA:** O Gemini processa o texto e gera uma versão simplificada, com linguagem direta e tópicos.

5. **Entrega:** A interface da OlivIA exibe um resumo amigável.

6. **Persistência (Opcional):** O estudante clica em "Salvar" para armazenar o resumo no banco de dados local (IndexedDB) para revisar depois.

### Fluxo Secundário (Dúvida Pontual):

1. **Seleção:** O estudante encontra uma palavra difícil ou parágrafo confuso e faz o *highlight* (seleciona) do texto.

2. **Ação:** Clica com o botão direito e seleciona "Olivia Explica" no menu de contexto.

3. **Resposta:** Uma pequena janela flutuante aparece explicando apenas aquele trecho de forma didática.

---

## Estrutura do projeto

> A estrutura modular permite que a equipe trabalhe em paralelo sem conflitos.
> 

```
/backend     # Servidor Python (Flask) que faz a ponte com a IA
/extension   # Código do plugin Chrome
--/assets      # Ícones, Imagens...
--/css         # Estilização da interface (styles.css)
--/modules     # Lógica de negócio (API, Scraper, UI, Database)
```

---

## Dicionário de Arquivos

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

### Database (CRUD)

- **`modules/database.js`**: Este módulo lida com o CRUD dos resumos no IndexedDB (direto na memória do browser).

### Estilos e Assets

- **`css/styles.css`**:  Define as cores, fontes e o visual amigável da interface.
- **`assets/`**: Guarda os ícones da OlívIA em diferentes tamanhos para o navegador.

---

## Configuração do ambiente

1. Criar ambiente virtual (venv)
    
    Dentro da pasta `/backend`, execute:
    
    ```bash
    python -m venv venv
    ```
    
2. Ativar o venv
    - **Windows**
    
    ```powershell
    .\venv\Scripts\activate
    ```
    
    - **Mac/Linux**
    
    ```bash
    source venv/bin/activate
    ```
    
3. Instalar dependências do `requirements.txt`
    
    ```bash
    pip install -r requirements.txt
    ```

4. Configurar Chave da API no `.env`
    1. Dentro da pasta `/backend`, crie um arquivo chamado `.env`
    2. Visite o site [Google Ai Studio](https://aistudio.google.com/api-keys), gere e copie sua Chave da API do Gemini
    2. no arquivo `.env`, declare a seguinte variável e salve o arquivo:
    ```bash
    GEMINI_API_KEY=ColeSuaChaveAQUI
    ```
    

<aside>

**Atenção:** nunca suba a pasta `venv` ou o arquivo `.env` para o repositório. Use o `.gitignore`.

</aside>

---

## Como testar

1. Inicie o backend: `python app.py`.
2. No Chrome, acesse `chrome://extensions/`.
3. Ative o **Modo do Desenvolvedor**.
4. Clique em **Carregar sem compactação** e selecione a pasta `/extension`.
5. Abra qualquer site e clique no ícone da OlívIA ou use o botão direito em um texto selecionado.

---


## Equipe
Miguel Duarte
Ruan
Lucas Valença
Rodrigo Montenegro