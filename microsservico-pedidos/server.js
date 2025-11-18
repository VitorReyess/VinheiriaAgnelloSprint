const express = require('express');
const axios = require('axios'); // Para chamar o microsserviço de produtos
const app = express();
const PORT = 8081;

app.get('/', (req, res) => {
    res.send('Olá do Microsserviço de Pedidos da Vinheria Agnello! ��');
});

app.get('/pedidos', (req, res) => {
    const pedidos = [
        { id: 101, cliente: 'Maria Silva', itens: [{ produtoId: 1, quantidade: 2 }], status: 'Processando' },
        { id: 102, cliente: 'João Pereira', itens: [{ produtoId: 3, quantidade: 1 }], status: 'Concluído' }
    ];
    res.json(pedidos);
});

app.get('/pedidos/com-produtos', async (req, res) => {
    try {
        // Chama o microsserviço de produtos usando o nome do serviço no Docker Compose
        const produtosResponse = await axios.get('http://produtos-ms:8080/produtos');
        const produtos = produtosResponse.data;

        const pedidos = [
            { id: 101, cliente: 'Maria Silva', itens: [{ produtoId: 1, quantidade: 2 }], status: 'Processando' },
            { id: 102, cliente: 'João Pereira', itens: [{ produtoId: 3, quantidade: 1 }], status: 'Concluído' }
        ];

        const pedidosComDetalhes = pedidos.map(pedido => {
            const itensDetalhes = pedido.itens.map(item => {
                const produto = produtos.find(p => p.id === item.produtoId);
                return { ...item, produto: produto ? produto.nome : 'Produto Desconhecido' };
            });
            return { ...pedido, itens: itensDetalhes };
        });

        res.json(pedidosComDetalhes);
    } catch (error) {
        console.error('Erro ao buscar produtos:', error.message);
        res.status(500).send('Erro ao buscar detalhes dos produtos.');
    }
});

app.listen(PORT, () => {
    console.log(`Microsserviço de Pedidos rodando na porta ${PORT}`);
});