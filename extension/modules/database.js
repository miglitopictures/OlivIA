const OliviaDB = {
    dbName: "OliviaDS",
    version: 1,

    open: function() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);
            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains("history")) {
                    db.createObjectStore("history", { keyPath: "id", autoIncrement: true });
                }
            };
            request.onsuccess = (e) => resolve(e.target.result);
            request.onerror = () => reject("Erro ao abrir IndexedDB");
        });
    },

    saveSummary: async function(content) {
        const db = await this.open();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(["history"], "readwrite");
            const store = transaction.objectStore("history");
            const data = {
                text: content,
                url: window.location.href,
                date: new Date().toLocaleString()
            };
            const request = store.add(data);
            request.onsuccess = () => resolve(true);
            request.onerror = () => reject(false);
        });
    },

    getAllHistory: async function() {
        const db = await this.open();
        return new Promise((resolve) => {
            const transaction = db.transaction(["history"], "readonly");
            const store = transaction.objectStore("history");
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
        });
    }
};