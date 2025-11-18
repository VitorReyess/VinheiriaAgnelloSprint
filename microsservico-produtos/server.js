const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000; // Usa a variável de ambiente ou 3000 como padrão

app.get('/', (req, res) => {
    res.send('Olá do Microsserviço de Produtos da Vinheria Agnello! 🍇');
});

app.get('/produtos', (req, res) => {
    const produtos = [
        { id: 1, nome: 'Vinho Tinto Cabernet Sauvignon', preco: 85.00, estoque: 150 },
        { id: 2, nome: 'Vinho Branco Chardonnay', preco: 60.00, estoque: 200 },
        { id: 3, nome: 'Espumante Brut Rosé', preco: 120.00, estoque: 80 }
    ];
    res.json(produtos);
});

app.listen(PORT, () => {
    console.log(`Microsserviço de Produtos rodando na porta ${PORT}`);
});