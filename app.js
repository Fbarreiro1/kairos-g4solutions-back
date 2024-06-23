const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT, PORT } = require('./config.js');

const app = express();

// Middleware CORS -- permite que el servidor reciba solicitudes de otras rutas
app.use(cors());


// Middleware body-parser para analizar el cuerpo de las solicitudes
app.use(bodyParser.json());


// MySQL Connection
const connection = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: DB_PORT
});

connection.connect((err) => {
  if (err) {
    console.error('Error al conectarse a la base de datos: ' + err.message);
    return;
  }
  console.log('conexion exitosa a base de datos tp_g4_db');
});


//////////USUARIOS//////////

// Ruta para obtener datos de USUARIOS
app.get('/usuarios', (req, res) => {
  connection.query('SELECT U.*, C.NOMBRE AS N_CAMPO FROM USUARIOS U LEFT JOIN CAMPOS C ON C.ID = U.CAMPO', (error, results) => {
    if (error) throw error.message;
    res.json(results);
    console.log(results);
  });
});

connection.end();

// Ruta para agregar datos a USUARIOS
app.post('/usuarios', (req, res) => {
  const { USERNAME,TIPO,TELEFONO,PASSWORD,NOMBRE,FK_CLINICAS,EMAIL,DNI,CAMPO,FK_PACIENTE } = req.body;
  connection.query('INSERT INTO USUARIOS (USERNAME,TIPO,TELEFONO,PASSWORD,NOMBRE,FK_CLINICAS,EMAIL,DNI,CAMPO,FK_PACIENTE) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [USERNAME,TIPO,TELEFONO,PASSWORD,NOMBRE,FK_CLINICAS,EMAIL,DNI,CAMPO,FK_PACIENTE], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Error al insertar los datos' });
      console.log(error);
    } else {
      res.status(200).json({ message: 'Datos insertados correctamente' });
    }
  });
});


//Ruta para eliminar datos de USUARIOS
app.delete('/usuarios/:id', (req, res) => {
  const userId = req.params.id;

  connection.query('DELETE FROM Usuarios WHERE USERNAME = ?', userId, (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Error al insertar los datos' });
    } else {
      res.status(200).json({ message: 'Datos insertados correctamente' });
    }
  });
});


//////////CLINICAS//////////

// Ruta para obtener datos de CLINICAS
app.get('/clinicas', (req, res) => {
  connection.query('SELECT * FROM CLINICAS', (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});

// Ruta para agregar datos a CLINICAS
app.post('/clinicas', (req, res) => {
  const { NOMBRE, DIRECCION, EMAIL, TELEFONO, CAMPOS } = req.body;
  connection.query('INSERT INTO CLINICAS (NOMBRE, DIRECCION, EMAIL, TELEFONO, CAMPOS) VALUES (?, ?, ?, ?, ?)', [NOMBRE, DIRECCION, EMAIL, TELEFONO, CAMPOS], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Error al insertar los datos' });
    } else {
      res.status(200).json({ message: 'Datos insertados correctamente' });
    }
  });
});


//Ruta para eliminar datos de CLINICAS
app.delete('/clinicas/:id', (req, res) => {
  const clinicaId = req.params.id;

  connection.query('DELETE FROM CLINICAS WHERE ID = ?', clinicaId, (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Error al insertar los datos' });
    } else {
      res.status(200).json({ message: 'Datos insertados correctamente' });
    }
  });
});


//////////PACIENTES//////////

// Ruta para obtener datos de PACIENTES
app.get('/pacientes', (req, res) => {
  connection.query('SELECT * FROM PACIENTES', (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});

// Ruta para agregar datos a PACIENTES
app.post('/pacientes', (req, res) => {
  const { DNI, NOMBRE, APELLIDO, PASSWORD, TELEFONO, EMAIL } = req.body;
  connection.query('INSERT INTO PACIENTES (DNI, NOMBRE, APELLIDO, PASSWORD, TELEFONO, EMAIL) VALUES (?, ?, ?, ?, ?, ?)', [DNI, NOMBRE, APELLIDO, PASSWORD, TELEFONO, EMAIL], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Error al insertar los datos' });
    } else {
      res.status(200).json({ message: 'Datos insertados correctamente' });
    }
  });
});


//Ruta para eliminar datos de PACIENTES
app.delete('/pacientes/:id', (req, res) => {
  const pacienteId = req.params.id;

  connection.query('DELETE FROM PACIENTES WHERE DNI = ?', pacienteId, (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Error al insertar los datos' });
    } else {
      res.status(200).json({ message: 'Datos insertados correctamente' });
    }
  });
});


//////////TURNOS//////////

// Ruta para obtener datos de TURNOS
app.get('/turnos', (req, res) => {
  connection.query('SELECT T.*, P.NOMBRE AS N_PACIENTE, P.APELLIDO AS AP_PACIENTE, '+
    'PR.NOMBRE AS PROFESIONAL, CL.NOMBRE AS CLINICA, CA.NOMBRE AS CAMPO_DESC  FROM TURNOS T '+
    'LEFT JOIN PACIENTES P ON P.DNI = T.FK_PACIENTES '+
    'LEFT JOIN CLINICAS CL ON CL.ID = T.FK_CLINICAS '+
    'LEFT JOIN USUARIOS PR ON PR.USERNAME = T.FK_PROFESIONAL '+
    'LEFT JOIN CAMPOS CA ON CA.ID = T.CAMPO ', (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});

// Ruta para agregar datos a TURNOS
app.post('/turnos', (req, res) => {
  const { FECHA, HORA, CAMPO, FK_CLINICAS, FK_PROFESIONAL, FK_PACIENTES } = req.body;
  connection.query('INSERT INTO TURNOS (FECHA, HORA, CAMPO, FK_CLINICAS, FK_PROFESIONAL, FK_PACIENTES) VALUES (?, ?, ?, ?, ?, ?)', [FECHA, HORA, CAMPO, FK_CLINICAS, FK_PROFESIONAL, FK_PACIENTES], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Error al insertar los datos' });
    } else {
      res.status(200).json({ message: 'Datos insertados correctamente' });
    }
  });
});


//Ruta para eliminar datos de TURNOS
app.delete('/turnos/:id', (req, res) => {
  const turnoId = req.params.id;

  connection.query('DELETE FROM TURNOS WHERE ID = ?', turnoId, (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Error al insertar los datos' });
    } else {
      res.status(200).json({ message: 'Datos insertados correctamente' });
    }
  });
});

//////////CAMPOS//////////

// Ruta para obtener datos de TURNOS
app.get('/campos', (req, res) => {
  connection.query('SELECT * FROM CAMPOS', (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});

// Ruta para agregar datos a CAMPOS
app.post('/campos', (req, res) => {
  const { NOMBRE } = req.body;
  connection.query('INSERT INTO CAMPOS (NOMBRE) VALUES (?)', [NOMBRE], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Error al insertar los datos' });
    } else {
      res.status(200).json({ message: 'Datos insertados correctamente' });
    }
  });
});


//Ruta para eliminar datos de CAMPOS
app.delete('/campos/:id', (req, res) => {
  const campoId = req.params.id;

  connection.query('DELETE FROM CAMPOS WHERE ID = ?', campoId, (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Error al insertar los datos' });
    } else {
      res.status(200).json({ message: 'Datos insertados correctamente' });
    }
  });
});


//////////TIPOS//////////

// Ruta para obtener datos de TIPOS
app.get('/tipos', (req, res) => {
  connection.query('SELECT * FROM TIPOS', (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});

// Ruta para agregar datos a TIPOS
app.post('/tipos', (req, res) => {
  const { ID, DESCRIPCION } = req.body;
  connection.query('INSERT INTO TIPOS (ID, DESCRIPCION) VALUES (?, ?)', [ID, DESCRIPCION], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Error al insertar los datos' });
    } else {
      res.status(200).json({ message: 'Datos insertados correctamente' });
    }
  });
});


//Ruta para eliminar datos de TIPOS
app.delete('/tipos/:id', (req, res) => {
  const tipoId = req.params.id;

  connection.query('DELETE FROM TIPOS WHERE ID = ?', tipoId, (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Error al insertar los datos' });
    } else {
      res.status(200).json({ message: 'Datos insertados correctamente' });
    }
  });
});




///////////////////////EN ESTA PARTE COMIENZAN LAS PETICIONES CON FILTROS///////////////////////////////////////////////

// Ruta para obtener turnos de un profesional en especifico
app.get('/turnos-prof/:id', (req, res) => {
  const profId = req.params.id;

  connection.query('SELECT A.*, C.NOMBRE, C.DIRECCION, C.TELEFONO, P.NOMBRE AS N_PACIENTE, P.APELLIDO AS AP_PACIENTE,P.TELEFONO AS P_TELEFONO, P.DNI AS P_DNI, U.NOMBRE AS PROFESIONAL'+
    ' FROM TURNOS A '+
    'JOIN CLINICAS C ON C.ID = A.FK_CLINICAS '+
    'JOIN PACIENTES P ON P.DNI = A.FK_PACIENTES '+
    'JOIN USUARIOS U ON U.USERNAME = A.FK_PROFESIONAL '+
    'WHERE FK_PROFESIONAL = ?', profId, (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});

// Ruta para actualizar el profesional de un turno
app.post('/turnos-disp/:id', (req, res) => {
  const { profId, turnoId } = req.body;

  // Validar que se hayan enviado los datos necesarios
  if (!turnoId || !profId) {
    return res.status(400).json({ error: 'Los campos turnoId y profId son requeridos' });
  }

  const query = 'UPDATE TURNOS SET FK_PROFESIONAL = ? WHERE ID = ?';

  connection.query(query, [profId, turnoId], (error, results) => {
    if (error) {
      console.error('Error al actualizar los datos:', error);
      return res.status(500).json({ error: 'Error al actualizar los datos' });
    }
    res.status(200).json({ message: 'Datos actualizados correctamente' });
  });
});


// Ruta para borrar el profesional de un turno
app.post('/turnos-prof/:id', (req, res) => {
  const turnoId = req.params.id;

  connection.query('UPDATE TURNOS SET FK_PROFESIONAL = NULL WHERE ID = ?', turnoId, (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Error al insertar los datos' });
    } else {
      res.status(200).json({ message: 'Datos insertados correctamente' });
    }
  });
});


// Ruta para obtener turnos disponibles por campo
app.get('/turnos-disp/:id', (req, res) => {
  const campoId = req.params.id;

  connection.query('SELECT A.*, C.NOMBRE, C.DIRECCION, C.TELEFONO, P.NOMBRE AS N_PACIENTE, P.APELLIDO AS AP_PACIENTE,P.TELEFONO AS P_TELEFONO, P.DNI AS P_DNI'+
    ' FROM TURNOS A '+
    'JOIN CLINICAS C ON C.ID = A.FK_CLINICAS '+
    'JOIN PACIENTES P ON P.DNI = A.FK_PACIENTES '+
    'WHERE FK_PROFESIONAL IS NULL and FK_CLINICAS IS NOT NULL and CAMPO = ?', campoId, (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});




// Ruta para obtener turnos de UNA CLINICA en especifico
app.get('/turnos-clin/:id', (req, res) => {
  const clinId = req.params.id;

  connection.query('SELECT A.*, C.NOMBRE, C.DIRECCION, C.TELEFONO, P.NOMBRE AS N_PACIENTE, P.APELLIDO AS AP_PACIENTE,P.TELEFONO AS P_TELEFONO, P.DNI AS P_DNI, U.NOMBRE AS PROFESIONAL'+
    ' FROM TURNOS A '+
    'LEFT JOIN CLINICAS C ON C.ID = A.FK_CLINICAS '+
    'LEFT JOIN PACIENTES P ON P.DNI = A.FK_PACIENTES '+
    'LEFT JOIN USUARIOS U ON U.USERNAME = A.FK_PROFESIONAL '+
    'WHERE A.FK_CLINICAS = ?', clinId, (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});

// Ruta para actualizar LA CLINICA de un turno
app.post('/turnos-disp-clin/:id', (req, res) => {
  const { clinId, turnoId } = req.body;

  // Validar que se hayan enviado los datos necesarios
  if (!turnoId || !clinId) {
    return res.status(400).json({ error: 'Los campos turnoId y clinId son requeridos' });
  }

  const query = 'UPDATE TURNOS SET FK_CLINICAS = ? WHERE ID = ?';

  connection.query(query, [clinId, turnoId], (error, results) => {
    if (error) {
      console.error('Error al actualizar los datos:', error);
      return res.status(500).json({ error: 'Error al actualizar los datos' });
    }
    res.status(200).json({ message: 'Datos actualizados correctamente' });
  });
});


// Ruta para borrar LA CLINICA de un turno
app.post('/turnos-clin/:id', (req, res) => {
  const turnoId = req.params.id;

  connection.query('UPDATE TURNOS SET FK_CLINICAS = NULL WHERE ID = ?', turnoId, (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Error al insertar los datos' });
    } else {
      res.status(200).json({ message: 'Datos insertados correctamente' });
    }
  });
});


// Ruta para obtener turnos disponibles por campo
app.get('/turnos-disp-clin/:id', (req, res) => {
  const campoId = req.params.id;

  connection.query('SELECT A.*, C.NOMBRE, C.DIRECCION, C.TELEFONO, P.NOMBRE AS N_PACIENTE, P.APELLIDO AS AP_PACIENTE,P.TELEFONO AS P_TELEFONO, P.DNI AS P_DNI, CA.NOMBRE AS CAMPO_DESC'+
    ' FROM TURNOS A '+
    'LEFT JOIN CLINICAS C ON C.ID = A.FK_CLINICAS '+
    'LEFT JOIN PACIENTES P ON P.DNI = A.FK_PACIENTES '+
    'LEFT JOIN CAMPOS CA ON CA.ID = A.CAMPO '+
    'WHERE A.FK_CLINICAS IS NULL and A.CAMPO = ?', campoId, (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});


// Ruta para obtener turnos de UN PACIENTE en especifico
app.get('/turnos-pac/:id', (req, res) => {
  const pacId = req.params.id;

  connection.query('SELECT A.*, C.NOMBRE, C.DIRECCION, C.TELEFONO, P.NOMBRE AS N_PACIENTE, P.APELLIDO AS AP_PACIENTE,P.TELEFONO AS P_TELEFONO, P.DNI AS P_DNI, U.NOMBRE AS PROFESIONAL'+
    ' FROM TURNOS A '+
    'LEFT JOIN CLINICAS C ON C.ID = A.FK_CLINICAS '+
    'LEFT JOIN PACIENTES P ON P.DNI = A.FK_PACIENTES '+
    'LEFT JOIN USUARIOS U ON U.USERNAME = A.FK_PROFESIONAL '+
    'WHERE A.FK_PROFESIONAL IS NOT NULL AND A.FK_CLINICAS IS NOT NULL AND A.FK_PACIENTES = ?', pacId, (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});




app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


