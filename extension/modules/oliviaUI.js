class OliviaUI {
    constructor() {
        this.container = null;
    }

    inject() {
        if (document.getElementById('olivia-root')) return;

        this.container = document.createElement('div');
        this.container.id = 'olivia-root';
        this.container.className = 'olivia-over';
        
        const mascotUrl = chrome.runtime.getURL("assets/olivia_icon_128.png");

        this.container.innerHTML = `
            <img src="${mascotUrl}" id="olivia-mascot" />
            <div id="olivia-header">
                <span class="olivia-title">OlivIA</span>
                <div class="header-right">
                    <button id="btn-historico">📂</button>
                    <span id="olivia-close">&times;</span>
                </div>
            </div>
            <div id="olivia-body">
                <div id="olivia-status"></div>
                <div id="olivia-results">
                    Olá! Selecione um texto ou clique abaixo para resumir a página.
                </div>
                <div id="olivia-actions">
                    <button id="btn-resumir">Resumir página</button>
                    <button id="btn-salvar" style="display: none;">💾 Salvar</button>
                    <button id="btn-voltar" style="display: none;">Voltar</button>
                </div>
            </div>
        `;

        document.body.appendChild(this.container);
        this.setupActions();
    }

    displayResult(text) {
        const resultsArea = this.container.querySelector('#olivia-results');
        const saveBtn = this.container.querySelector('#btn-salvar');
        const resumirBtn = this.container.querySelector('#btn-resumir');

        resultsArea.innerHTML = `<div class="olivia-answer"></div>`;
        typewrite(resultsArea.querySelector('.olivia-answer'), text);
        
        saveBtn.style.display = 'inline-block';
        resumirBtn.style.display = 'none';
    }

    showHistory(items) {
        const resultsArea = this.container.querySelector('#olivia-results');
        const saveBtn = this.container.querySelector('#btn-salvar');
        const resumirBtn = this.container.querySelector('#btn-resumir');
        const voltarBtn = this.container.querySelector('#btn-voltar');

        saveBtn.style.display = 'none';
        resumirBtn.style.display = 'none';
        voltarBtn.style.display = 'inline-block';

        if (items.length === 0) {
            resultsArea.innerHTML = "<p>Nenhum resumo salvo ainda.</p>";
            return;
        }

        resultsArea.innerHTML = '<div class="olivia-history-list"></div>';
        const list = resultsArea.querySelector('.olivia-history-list');

        items.forEach(item => {
            const el = document.createElement('div');
            el.className = 'history-item';
            el.innerHTML = `<small>${item.date}</small><p>${item.text.substring(0, 80)}...</p>`;
            el.onclick = () => {
                resultsArea.innerHTML = `<div class="olivia-answer">${item.text}</div>`;
            };
            list.appendChild(el);
        });
    }

    updateStatus(text) {
        const status = this.container?.querySelector('#olivia-status');
        if (status) status.innerText = text;
    }

    setupActions() {
        this.container.querySelector('#btn-resumir').onclick = () => {
            window.dispatchEvent(new CustomEvent('olivia-summarize-page'));
        };

        this.container.querySelector('#btn-salvar').onclick = () => {
            const text = this.container.querySelector('.olivia-answer').textContent;
            window.dispatchEvent(new CustomEvent('olivia-save-content', { detail: { text } }));
            this.container.querySelector('#btn-salvar').style.display = 'none';
            this.container.querySelector('#btn-resumir').style.display = 'inline-block';
        };

        this.container.querySelector('#btn-historico').onclick = () => {
            window.dispatchEvent(new CustomEvent('olivia-load-history'));
        };

        this.container.querySelector('#btn-voltar').onclick = () => {
            this.container.querySelector('#olivia-results').innerHTML = "Olá! Escolha uma nova ação.";
            this.container.querySelector('#btn-voltar').style.display = 'none';
            this.container.querySelector('#btn-resumir').style.display = 'inline-block';
        };

        this.container.querySelector('#olivia-close').onclick = () => this.container.remove();
    }
}

function typewrite(element, text, delay=10, i=0){
    if (i === 0) element.textContent = '';
    element.textContent += text[i];
    if (i < text.length - 1) setTimeout(() => typewrite(element, text, delay, i+1), delay);
}