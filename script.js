const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;
app.use(cors({
    origin: 'http://127.0.0.1:5500',
}));

app.use(bodyParser.json());
app.use(express.static('public'));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'studentdb',
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database');
});

app.get('/api/users', (req, res) => {
    db.query('SELECT * FROM users', (err, result) => {
        if (err) throw err;
        console.log(result);
        res.json(result);
    });
});


app.post('/api/users', (req, res) => {
    const user = req.body;
    db.query('INSERT INTO users SET ?', user, (err, result) => {
        if (err) throw err;
        res.sendStatus(201);
    });
});


app.delete('/api/users/:id', (req, res) => {
    db.query('DELETE FROM users WHERE id = ?', [req.params.id], (err) => {
        if (err) throw err;
        res.sendStatus(201);
    });
});


app.get('/api/users/:id', (req, res) => {
    db.query('SELECT * FROM users WHERE id = ?', [req.params.id], (err, result) => {
        if (err) throw err;
        res.json(result[0]);
    });
});

app.put('/api/users/:id', (req, res) => {
   const {id}=req.params;
   const updateUser=req.body;
   db.query('UPDATE users SET ? WHERE id = ?',[updateUser,id],(err)=>{
    if(err) throw err;
    res.sendStatus(201);
   });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

