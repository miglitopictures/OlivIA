chrome.action.onClicked.addListener((tab) => {
    
    if (tab.id) {
        chrome.tabs.sendMessage(tab.id, { action: "show_olivia" }, (response) => {
            if (chrome.runtime.lastError) {
                console.warn("A OlivIA não pode ser carregada nesta página: ", chrome.runtime.lastError.message);
            }
        });
    }
});

function genericOnClick(info, tab) {
    if (info.menuItemId === "olivia-explica"){
        console.log('perguntou pra olivia sobre: \"' + info.selectionText + "\"");
        chrome.tabs.sendMessage(tab.id, { action: "explain_selection", text: info.selectionText }, (response) => {
            if (response) {
                console.log("background.js recebeu o sinal de content.js!")
                console.log(response)
            }
        });
    }
}

chrome.runtime.onInstalled.addListener(function () {

    chrome.contextMenus.onClicked.addListener(genericOnClick);

    chrome.contextMenus.create({
        id: 'olivia-explica',
        title: '🟢 OlivIA Explica',
        contexts: ["selection"],
    });
});