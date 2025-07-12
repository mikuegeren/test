const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 数据库连接
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '你的数据库密码',
    database: 'your_db_name'
});

// 查询所有用户
app.get('/api/users', (req, res) => {
    db.query('SELECT id, username FROM users', (err, results) => {
        if (err) return res.status(500).json({error: err});
        res.json(results);
    });
});

// 添加用户
app.post('/api/users', (req, res) => {
    const { username, password } = req.body;
    db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], (err, result) => {
        if (err) return res.status(500).json({error: err});
        res.json({id: result.insertId, username});
    });
});

// 修改用户密码
app.put('/api/users/:id', (req, res) => {
    const { password } = req.body;
    db.query('UPDATE users SET password=? WHERE id=?', [password, req.params.id], (err) => {
        if (err) return res.status(500).json({error: err});
        res.json({success: true});
    });
});

// 删除用户
app.delete('/api/users/:id', (req, res) => {
    db.query('DELETE FROM users WHERE id=?', [req.params.id], (err) => {
        if (err) return res.status(500).json({error: err});
        res.json({success: true});
    });
});

// 登录
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    db.query('SELECT id, username FROM users WHERE username=? AND password=?', [username, password], (err, results) => {
        if (err) return res.status(500).json({error: err});
        if (results.length === 0) return res.status(401).json({error: '用户名或密码错误'});
        res.json(results[0]);
    });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));