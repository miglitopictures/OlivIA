const ui = new OliviaUI();

async function handleAction(action, text) {
    if (!text || text.trim().length < 5) {
        ui.inject();
        ui.displayResult("Selecione um texto um pouco maior para eu conseguir explicar!");
        return;
    }

    ui.inject();
    ui.updateStatus(action === 'simplify' ? "Lendo a página..." : "Pensando...");

    try {
        const response = await OliviaAPI.askOlivia(action, text);
        
        ui.updateStatus("");
        if (response && response.status === "success") {
            ui.displayResult(response.message);
        } else {
            ui.displayResult("Puxa, a OlivIA se confundiu! Tente novamente!");
        }
    } catch (err) {
        ui.updateStatus("");
        ui.displayResult("Erro ao conectar com o servidor.");
    }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "explain_selection") {
        handleAction('explain', request.text);
        sendResponse({ status: "processando" });
    }
    if (request.action === "show_olivia") {
        ui.inject();
        sendResponse({ status: "ok" });
    }
    return true;
});

window.addEventListener('olivia-summarize-page', () => {
    const pageText = Scraper.getCleanPageText();
    handleAction('simplify', pageText);
});

window.addEventListener('olivia-save-content', async (e) => {
    await OliviaDB.saveSummary(e.detail.text);
    ui.updateStatus("Salvo com sucesso!");
    setTimeout(() => ui.updateStatus(""), 2000);
});

window.addEventListener('olivia-load-history', async () => {
    ui.updateStatus("Abrindo histórico...");
    const history = await OliviaDB.getAllHistory();
    ui.updateStatus("");
    ui.showHistory(history);
});