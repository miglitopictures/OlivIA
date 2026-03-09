/**
 * App principal do frontend OlivIA.
 * Orquestra a UI e as chamadas à API.
 */
import { API } from './api.js';

const $ = (sel, root = document) => root.querySelector(sel);

const input = $('#input-text');
const charCount = $('#char-count');
const btnSimplify = $('#btn-simplify');
const btnExplain = $('#btn-explain');
const outputArea = $('#output-area');
const outputLoading = $('#output-loading');

const MESSAGES = {
    empty: 'Digite ou cole um texto para começar.',
    error: (err) => {
        const msg = err?.message || '';
        if (msg.toLowerCase().includes('abort') || msg.includes('timeout')) {
            return 'Demorou demais. Verifique sua internet e tente novamente.';
        }
        if (msg.includes('Failed to fetch') || msg.includes('NetworkError')) {
            return 'Não foi possível conectar ao servidor. Certifique-se de que o backend está rodando: python app.py na pasta backend.';
        }
        return `Não foi possível processar: ${msg || 'Verifique se o backend está rodando e se a GEMINI_API_KEY está no .env.'}`;
    },
};

let isLoading = false;

function setLoading(loading) {
    isLoading = loading;
    outputLoading.hidden = !loading;
    outputArea.hidden = loading;
    btnSimplify.disabled = loading;
    btnExplain.disabled = loading;
}

function showResult(html, isError = false) {
    setLoading(false);
    outputArea.hidden = false;
    outputArea.innerHTML = `<p class="output-text ${isError ? 'output-error' : ''}">${html}</p>`;
}

function showError(message) {
    showResult(escapeHtml(message), true);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function updateCharCount() {
    const len = input.value.length;
    charCount.textContent = len.toLocaleString('pt-BR');
}

async function handleAction(action) {
    const text = input.value.trim();
    if (!text) {
        showError(MESSAGES.empty);
        return;
    }

    setLoading(true);
    outputArea.innerHTML = '';

    try {
        const result = action === 'simplify'
            ? await API.simplify(text)
            : await API.explain(text);
        showResult(escapeHtml(result.message));
    } catch (err) {
        console.error(err);
        showError(typeof MESSAGES.error === 'function' ? MESSAGES.error(err) : MESSAGES.error);
    }
}

input.addEventListener('input', updateCharCount);
input.addEventListener('paste', () => setTimeout(updateCharCount, 0));

btnSimplify.addEventListener('click', () => handleAction('simplify'));
btnExplain.addEventListener('click', () => handleAction('explain'));

updateCharCount();

setLoading(false);
if (!outputArea.textContent.trim()) {
    outputArea.innerHTML = '<p class="output-placeholder">O resultado aparecerá aqui.</p>';
}
