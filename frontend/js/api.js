/**
 * Cliente da API OlivIA.
 * Centraliza as chamadas ao backend (simplify / explain).
 */
import { CONFIG } from './config.js';

const API = {
    base: CONFIG.apiBase,

    /**
     * Envia texto para simplificar.
     * @param {string} text
     * @returns {Promise<{status: string, message: string}>}
     */
    async simplify(text) {
        return this._post('/simplify', text);
    },

    /**
     * Envia texto para explicar.
     * @param {string} text
     * @returns {Promise<{status: string, message: string}>}
     */
    async explain(text) {
        return this._post('/explain', text);
    },

    async _post(endpoint, text) {
        const limited = String(text).substring(0, 12000);
        const base = this.base.replace(/\/$/, '');
        const url = `${base}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 90000); // 90s

        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: limited }),
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
            const msg = data.message || data.error || res.statusText;
            throw new Error(msg || `Erro ${res.status}`);
        }

        const message = data.message ?? data.text ?? 'Resposta vazia.';
        return { status: 'success', message };
    },
};

export { API };
