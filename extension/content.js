const ui = new OliviaUI();


/**
 * Orquestra o fluxo de trabalho: Ativa a UI, chama a API e exibe o resultado.
 * @param {string} action - O tipo de processamento (ex: 'simplify', 'explain').
 * @param {string} text - O conteúdo bruto capturado pelo Scraper.
 */
async function handleAction(action, text) {
    ui.inject(); // Ensure UI is open
    ui.updateStatus(action === 'simplify' ? "Simplificando..." : "Explicando \"" + text + "\"...");

    const response = await OliviaAPI.askOlivia(action, text);
    
    // ui.updateStatus("");
    if (response.status === "success") {
        ui.displayResult(response.message);
    } else {
        ui.displayResult("Puxa, a OlivIA se confundiu. Tente novamente!");
    }
    
    return response;
}

// --- Eventos Externos (Click no Icone / Menu Contextual) [background.js] ---
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    if (request.action === "explain_selection") {
        handleAction('explain', request.text).then(sendResponse);
        return true;
    }

    if (request.action === "show_olivia") {
        ui.inject();
        sendResponse({ status: "Olivia Spawned" });
        return true;
    }
});

// --- Eventos Internos (Acoes da Interface da Olivia) [oliviaUI.js] ---
window.addEventListener('olivia-summarize-page', () => {
    const cleanText = Scraper.getCleanPageText();
    handleAction('simplify', cleanText);
});

// --- Eventos Internos (Acoes da Interface da Olivia) [oliviaUI.js] ---
window.addEventListener('btn-close', () => {
    const cleanText = Scraper.getCleanPageText();
    handleAction('simplify', cleanText);
});

