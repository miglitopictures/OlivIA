# Frontend OlivIA

Interface web para demonstrar as funcionalidades da OlivIA (simplificar e explicar textos).

## Como usar

1. Inicie o backend: `python app.py` (na pasta `/backend`).
2. Acesse [http://localhost:5000/app](http://localhost:5000/app).

O frontend usa a mesma API que a extensão Chrome.

## Estrutura

```
frontend/
├── index.html      # Página principal
├── css/
│   └── styles.css  # Estilos
└── js/
    ├── config.js   # Configuração (URL da API)
    ├── api.js      # Cliente HTTP
    └── app.js      # Lógica da interface
```
