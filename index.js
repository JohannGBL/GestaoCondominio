const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'GestaoDeCondominios',
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
    } else {
        console.log('Conectado ao banco de dados!');
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/cadastrar', (req, res) => {
    res.sendFile(path.join(__dirname, 'cadastrar.html'));
});

app.post('/pesquisaBlocos', (req, res) => {
    const { bloco, apartamento } = req.body;
    
    const sql = "INSERT INTO bloco (bloco, apartamento) VALUES (?, ?)";
    db.query(sql, [bloco, apartamento], (err, result) => {
        if (err) {
            console.error('Erro ao cadastrar bloco:', err);
            return res.status(500).send('Erro ao cadastrar bloco');
        }
        console.log('Bloco cadastrado com sucesso!');
        res.redirect('/pesquisaBlocos');
    });
});

app.post('/deleteBloco/:id', (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM bloco WHERE id = ?";
    
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Erro ao deletar bloco:', err);
            return res.status(500).send('Erro ao deletar bloco');
        }
        res.redirect('/pesquisaBlocos');
    });
});

app.post('/editBloco/:id', (req, res) => {
    const id = req.params.id;
    const { bloco, apartamento } = req.body;
    const sql = "UPDATE bloco SET bloco = ?, apartamento = ? WHERE id = ?";
    
    db.query(sql, [bloco, apartamento, id], (err, result) => {
        if (err) {
            console.error('Erro ao editar bloco:', err);
            return res.status(500).send('Erro ao editar bloco');
        }
        res.redirect('/pesquisaBlocos');
    });
});

app.get('/pesquisaBlocos', function(req, res) {
    const listar = "SELECT * FROM bloco";

    db.query(listar, function(err, rows) {
        if(!err) {
            console.log("Consulta realizada com sucesso!");
            res.send(`
                <html>
                <head>
                <title>Relatório de Blocos</title>
                <style>
                :root {
                    --primary-color: #2c3e50;
                    --secondary-color: #3498db;
                    --accent-color: #e74c3c;
                    --light-color: #ecf0f1;
                    --dark-color: #2c3e50;
                    --success-color: #2ecc71;
                    --border-radius: 8px;
                    --box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }
                
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.6;
                    background-color: #f5f7fa;
                    color: var(--dark-color);
                    padding: 20px;
                }
                
                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 20px;
                }
                
                h1 {
                    font-size: 2.5rem;
                    color: var(--primary-color);
                    margin-bottom: 30px;
                    text-align: center;
                    padding-bottom: 15px;
                    border-bottom: 2px solid var(--secondary-color);
                }
                
                /* Estilos da Tabela */
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 30px 0;
                    background-color: white;
                    box-shadow: var(--box-shadow);
                    border-radius: var(--border-radius);
                    overflow: hidden;
                }
                
                th, td {
                    padding: 15px;
                    text-align: left;
                    border-bottom: 1px solid #ddd;
                }
                
                th {
                    background-color: var(--primary-color);
                    color: white;
                    font-weight: bold;
                    text-transform: uppercase;
                    font-size: 0.9rem;
                }
                
                tr:nth-child(even) {
                    background-color: #f8f9fa;
                }
                
                tr:hover {
                    background-color: #f1f1f1;
                }
                
                /* Botões de ação */
                .action-btn {
                    padding: 8px 12px;
                    margin: 0 3px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: bold;
                    transition: all 0.3s;
                    font-size: 0.9rem;
                }
                
                .edit-btn {
                    background-color: var(--secondary-color);
                    color: white;
                }
                
                .edit-btn:hover {
                    background-color: #2980b9;
                }
                
                .delete-btn {
                    background-color: var(--accent-color);
                    color: white;
                }
                
                .delete-btn:hover {
                    background-color: #c0392b;
                }
                
                /* Botão/Link Voltar */
                .back-link {
                    display: inline-block;
                    margin-top: 20px;
                    padding: 12px 25px;
                    background-color: var(--secondary-color);
                    color: white;
                    text-decoration: none;
                    border-radius: var(--border-radius);
                    font-weight: bold;
                    transition: all 0.3s ease;
                }
                
                .back-link:hover {
                    background-color: #2980b9;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }
                
                /* Responsividade */
                @media (max-width: 768px) {
                    body {
                        padding: 10px;
                    }
                    
                    h1 {
                        font-size: 1.8rem;
                    }
                    
                    table {
                        display: block;
                        overflow-x: auto;
                    }
                    
                    th, td {
                        padding: 10px;
                        font-size: 0.9rem;
                    }
                    
                    .action-btn {
                        padding: 6px 8px;
                        margin: 0 2px;
                        font-size: 0.8rem;
                    }
                }
                </style>
                </head>
                <body>
                    <div class="container">
                        <h1>Blocos e apartamentos</h1>
                        <table>
                            <tr>
                                <th>ID</th>
                                <th>Bloco</th>
                                <th>Apartamentos</th>
                                <th>Ações</th>
                            </tr>
                            ${rows.map(row => `
                                <tr>
                                    <td>${row.id}</td>
                                    <td>${row.bloco}</td>
                                    <td>${row.apartamento}</td>
                                    <td>
                                        <button class="action-btn edit-btn" onclick="location.href='/editarBloco/${row.id}'">Editar</button>
                                        <button class="action-btn delete-btn" onclick="confirmDelete(${row.id})">Excluir</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </table>
                        <a href="/" class="back-link">Voltar</a>
                        <a href="/cadastrar">
                            <button style="padding: 12px 25px; background-color: var(--primary-color); color: white; border: none; border-radius: var(--border-radius); cursor: pointer; margin-top: 20px;">Cadastrar Novo Bloco</button>
                        </a>
                    </div>

                    <script>
                        function confirmDelete(id) {
                            if(confirm('Tem certeza que deseja excluir este bloco?')) {
                                fetch('/deleteBloco/' + id, {
                                    method: 'POST'
                                }).then(response => {
                                    if(response.redirected) {
                                        window.location.href = response.url;
                                    }
                                });
                            }
                        }
                    </script>
                </body>
                </html>
            `);
        } else {
            console.log("Erro na consulta de blocos: ", err);
            res.status(500).send("Erro ao carregar blocos");
        }
    });
});

app.get('/editarBloco/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM bloco WHERE id = ?";
    
    db.query(sql, [id], (err, result) => {
        if (err || result.length === 0) {
            console.error('Erro ao buscar bloco:', err);
            return res.status(500).send('Erro ao carregar bloco para edição');
        }
        
        const bloco = result[0];
        res.send(`
            <html>
            <head>
                <title>Editar Bloco</title>
                <style>
                :root {
                    --primary-color: #2c3e50;
                    --secondary-color: #3498db;
                    --accent-color: #e74c3c;
                    --light-color: #ecf0f1;
                    --dark-color: #2c3e50;
                    --success-color: #2ecc71;
                    --border-radius: 8px;
                    --box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }
                
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.6;
                    background-color: #f5f7fa;
                    color: var(--dark-color);
                    padding: 20px;
                }
                
                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 20px;
                }
                
                h1 {
                    font-size: 2.5rem;
                    color: var(--primary-color);
                    margin-bottom: 30px;
                    text-align: center;
                    padding-bottom: 15px;
                    border-bottom: 2px solid var(--secondary-color);
                }
                
                /* Estilos da Tabela */
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 30px 0;
                    background-color: white;
                    box-shadow: var(--box-shadow);
                    border-radius: var(--border-radius);
                    overflow: hidden;
                }
                
                th, td {
                    padding: 15px;
                    text-align: left;
                    border-bottom: 1px solid #ddd;
                }
                
                th {
                    background-color: var(--primary-color);
                    color: white;
                    font-weight: bold;
                    text-transform: uppercase;
                    font-size: 0.9rem;
                    text-align: left;
                }
                
                /* Alinhamento das colunas */
                td:nth-child(1) { /* ID */
                    text-align: right;
                    padding-right: 30px;
                }
                
                td:nth-child(2) { /* Bloco */
                    text-align: right;
                    padding-right: 30px;
                }
                
                td:nth-child(3) { /* Apartamentos */
                    text-align: center;
                }
                
                td:nth-child(4) { /* Ações */
                    text-align: center;
                }
                
                tr:nth-child(even) {
                    background-color: #f8f9fa;
                }
                
                tr:hover {
                    background-color: #f1f1f1;
                }
                
                /* Botões de ação */
                .action-btn {
                    padding: 8px 12px;
                    margin: 0 3px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: bold;
                    transition: all 0.3s;
                    font-size: 0.9rem;
                }
                
                .edit-btn {
                    background-color: var(--secondary-color);
                    color: white;
                }
                
                .edit-btn:hover {
                    background-color: #2980b9;
                }
                
                .delete-btn {
                    background-color: var(--accent-color);
                    color: white;
                }
                
                .delete-btn:hover {
                    background-color: #c0392b;
                }
                
                /* Botão/Link Voltar */
                .back-link {
                    display: inline-block;
                    margin-top: 20px;
                    padding: 10px 20px;
                    background-color: var(--light-color);
                    color: var(--primary-color);
                    text-decoration: none;
                    border-radius: var(--border-radius);
                    font-weight: 500;
                    transition: all 0.3s ease;
                    border: 1px solid #ddd;
                }
                
                .back-link:hover {
                    background-color: #e0e0e0;
                    transform: translateY(-1px);
                }
                
                /* Botão Cadastrar */
                .cadastrar-btn-container {
                    text-align: center;
                    margin-top: 20px;
                }
                
                .cadastrar-btn {
                    padding: 12px 25px;
                    background-color: var(--primary-color);
                    color: white;
                    border: none;
                    border-radius: var(--border-radius);
                    cursor: pointer;
                    font-weight: 500;
                    transition: all 0.3s;
                }
                
                .cadastrar-btn:hover {
                    background-color: #1a252f;
                    transform: translateY(-2px);
                }
                
                /* Responsividade */
                @media (max-width: 768px) {
                    body {
                        padding: 10px;
                    }
                    
                    h1 {
                        font-size: 1.8rem;
                    }
                    
                    table {
                        display: block;
                        overflow-x: auto;
                    }
                    
                    th, td {
                        padding: 10px;
                        font-size: 0.9rem;
                    }
                    
                    .action-btn {
                        padding: 6px 8px;
                        margin: 0 2px;
                        font-size: 0.8rem;
                    }
                }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Editar Bloco</h1>
                    <form action="/editBloco/${bloco.id}" method="post">
                        <div>
                            <label for="bloco">Bloco:</label>
                            <input type="text" id="bloco" name="bloco" value="${bloco.bloco}" required>
                        </div>
                        <div>
                            <label for="apartamento">Quantidade de Apartamentos:</label>
                            <input type="number" id="apartamento" name="apartamento" value="${bloco.apartamento}" min="1" required>
                        </div>
                        <button type="submit">Salvar Alterações</button>
                    </form>
                    <a href="/pesquisaBlocos" class="back-link">Voltar</a>
                </div>
            </body>
            </html>
        `);
    });
});

app.listen(3001, () => {
    console.log('Servidor rodando na porta http://localhost:3001');
});