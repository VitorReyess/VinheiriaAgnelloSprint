const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken'); // Importa o pacote jsonwebtoken
const app = express();
const PORT = process.env.PORT || 3000; // Usa a variável de ambiente ou 3000 como padrão
// Use uma chave secreta forte para produção. Aqui, obtida da variável de ambiente.
const JWT_SECRET = process.env.JWT_SECRET || 'uma_chave_secreta_muito_segura_e_longa_para_dev_se_nao_definida_em_env';

app.use(express.json()); // Middleware para parsing de JSON no corpo da requisição

// Middleware para autenticação JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    // O token geralmente vem no formato "Bearer TOKEN_AQUI"
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).send('Token não fornecido.'); // 401 Unauthorized
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            console.error('Erro na verificação do token:', err.message);
            return res.status(403).send('Token inválido ou expirado.'); // 403 Forbidden
        }
        req.user = user; // Adiciona as informações do usuário decodificadas ao objeto da requisição
        next(); // Continua para a próxima função middleware/rota
    });
};

app.get('/', (req, res) => {
    res.send('Olá do Microsserviço de Pedidos da Vinheria Agnello! ��');
});

// Endpoint de login simulado para emitir um JWT
app.post('/login', (req, res) => {
    // Em um cenário real, você verificaria o nome de usuário e senha no banco de dados.
    // Para esta simulação, apenas um nome de usuário é suficiente para gerar um token.
    const { username } = req.body;

    if (!username) {
        return res.status(400).send('Nome de usuário é obrigatório.');
    }

    const user = { name: username, role: 'user' }; // Informações que você deseja incluir no token

    // Gera o token com validade de 1 hora
    const accessToken = jwt.sign(user, JWT_SECRET, { expiresIn: '1h' });
    res.json({ accessToken: accessToken });
});

app.get('/pedidos', (req, res) => {
    const pedidos = [
        { id: 101, cliente: 'Maria Silva', itens: [{ produtoId: 1, quantidade: 2 }], status: 'Processando' },
        { id: 102, cliente: 'João Pereira', itens: [{ produtoId: 3, quantidade: 1 }], status: 'Concluído' }
    ];
    res.json(pedidos);
});

// Esta rota agora está protegida pelo middleware JWT
app.get('/pedidos/com-produtos', authenticateToken, async (req, res) => {
    try {
        // req.user contém as informações do usuário extraídas do token
        console.log(`Requisição autenticada pelo usuário: ${req.user.name}`);

        // Chama o microsserviço de produtos usando a variável de ambiente PRODUTOS_API_URL
        const produtosApiUrl = process.env.PRODUTOS_API_URL || 'http://microsservico-produtos:3000'; // Fallback
        const produtosResponse = await axios.get(`${produtosApiUrl}/produtos`);
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
    console.log(`Microsserviço de Pedidos rodando na porta ${PORT}. JWT_SECRET configurado.`);
});