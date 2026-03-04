/**
 * @fileoverview Gerencia a Interface de Usuário (UI) da OlívIA.
 * Responsável pela criação, injeção e atualização dos elementos visuais na página.
 */
class OliviaUI {
    constructor() {
        this.container = null;
    }

    /**
     * Insere a interface da olivIA no DOM.
     */
    inject() {
        if (document.getElementById('olivia-root')) return;

        this.container = document.createElement('div');
        this.container.id = 'olivia-root';
        this.container.className = 'olivia-over'; // Uses your manifest CSS
        
        const mascotUrl = chrome.runtime.getURL("assets/olivia_icon_128.png");

        this.container.innerHTML = `
            <img src="${mascotUrl}" id="olivia-mascot" />
            <div id="olivia-header">
                <span class="olivia-title">OlivIA</span>
                <span id="olivia-close">&times;</span>
            </div>
            <div id="olivia-body">
                <div id="olivia-status">Status Message</div>
                <div id="olivia-results">
                    Hey there! I'm ready to help you learn. Select some text and I'll explain it!
                </div>
                <button id="btn-resumir">Resumir página</button>
            </div>
        `;

        document.body.appendChild(this.container);
        this.setupActions();
    }

    /**
     * Exibe a resposta da OlivIA com um efeito de digitação.
     * Limpa a área de resultados anterior e revela o novo texto de forma gradual.
     * * @param {string} text - O conteúdo processado (resumo ou explicação) vindo da API.
     */
    displayResult(text) {
        const resultsArea = this.container.querySelector('#olivia-results');
        if (resultsArea) {
            
            resultsArea.innerHTML = `<div class="olivia-answer"></div>`;
            const target = resultsArea.querySelector('.olivia-answer');

            typewrite(target, text);
        }
    }

    /**
     * Atualiza a barra de status na interface da OlívIA.
     * @param {string} message - O texto a ser exibido (ex: "Pensando...").
     */
    updateStatus(text) {
        const status = this.container?.querySelector('#olivia-status');
        if (status) status.innerText = text;
    }


    /**
     * Configura as ações da interface (ex. Botões).
     */
    setupActions() {

        // BOTAO: Resumir Página
        const summarizeBtn = this.container.querySelector('#btn-resumir');
        summarizeBtn.onclick = () => {
            // We dispatch a custom event that content.js can hear
            const event = new CustomEvent('olivia-summarize-page');
            window.dispatchEvent(event);
        };

        // BOTAO: Fechar OlivIA (x)
        const closeBtn = this.container.querySelector('#olivia-close');
        closeBtn.onclick = () => {
            this.container.remove();
        };
    }

}


/**
 * Cria um efeito de digitação (typewriter) em um elemento HTML.
 * A função é recursiva e adiciona um caractere por vez ao elemento.
 * * @param {HTMLElement} element - O elemento do DOM onde o texto será inserido.
 * @param {string} text - O texto completo que será digitado.
 * @param {number} [delay=10] - O tempo de espera (em milissegundos) entre cada caractere.
 * @param {number} [i=0] - O índice do caractere atual (usado internamente pela recursão).
 */
function typewrite(element, text, delay=10, i=0){
    if (i === 0){
        element.textContent = ''
    }
    element.textContent += text[i]
    if (i === text.length - 1){
        return
    }
    setTimeout(() => typewrite(element, text, delay, i+1),delay)
}