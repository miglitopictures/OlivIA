/**
 * Configuração do frontend OlivIA.
 * Usa sempre a URL completa do backend para evitar falhas de roteamento.
 */
const CONFIG = {
    apiBase: (() => {
        const { protocol, hostname, port } = window.location;
        const isSameOrigin = (hostname === 'localhost' || hostname === '127.0.0.1') && port === '5000';
        return isSameOrigin ? `${protocol}//${hostname}:${port}` : `${protocol}//${hostname}:5000`;
    })(),
};

export { CONFIG };
