const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Middleware CORS -- permite que el servidor reciba solicitudes de otras rutas
app.use(cors());


// Middleware body-parser para analizar el cuerpo de las solicitudes
app.use(bodyParser.json());


// MySQL Connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'tp_g4',
  password: '123456789',
  database: 'tp_g4_db'
});

connection.connect((err) => {
  if (err) {
    console.error('Error al conectarse a la base de datos: ' + err.stack);
    return;
  }
  console.log('conexion exitosa a base de datos tp_g4_db');
});

// Ruta para obtener datos de la base de datos
app.get('/usuarios', (req, res) => {
  connection.query('SELECT * FROM Usuarios', (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});

// Ruta para agregar datos a la base de datos
app.post('/usuarios', (req, res) => {
  const { nombre_usuario, password, email, tipo } = req.body;
  connection.query('INSERT INTO Usuarios (nombre_usuario, password, email, tipo) VALUES (?, ?, ?, ?)', [nombre_usuario, password, email, tipo], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Error al insertar los datos' });
    } else {
      res.status(200).json({ message: 'Datos insertados correctamente' });
    }
  });
});


//Ruta para eliminar datos de la base 
app.delete('/usuarios/:id', (req, res) => {
  const userId = req.params.id;

  connection.query('DELETE FROM Usuarios WHERE id = ?', userId, (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Error al insertar los datos' });
    } else {
      res.status(200).json({ message: 'Datos insertados correctamente' });
    }
  });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


