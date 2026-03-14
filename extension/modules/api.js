const OliviaAPI = {
    serverUrl: "http://localhost:5000",
    
    askOlivia: async function(endpoint, text) {
        const limitedText = text.substring(0, 12000);

        try {
            const response = await fetch(`${this.serverUrl}/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: limitedText }),
            });

            if (!response.ok) {
                throw new Error(`Erro: ${response.status}`);
            }

            const data = await response.json();

            return { 
                status: "success", 
                message: data.message 
            };

        } catch (err) {
            return { 
                status: "error", 
                message: "Não consegui falar com a OlívIA agora." 
            };
        }
    }
};