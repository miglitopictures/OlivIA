const Scraper = {
    normalizeText: (str) => {
        return str ? str.replace(/\s+/g, ' ').trim() : "";
    },

    getCleanPageText: function() {
        const main = document.querySelector('main') || document.querySelector('article') || 
                     document.querySelector('#content') || document.body;

        const clone = main.cloneNode(true);
        const noise = clone.querySelectorAll('nav, header, footer, script, style, ad, .menu, .sidebar');
        noise.forEach(el => el.remove());
        
        return this.normalizeText(clone.innerText);
    }
};