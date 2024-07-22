module.exports = {
    DB_HOST : process.env.DB_HOST || 'localhost',
    DB_USER: process.env.DB_USER || 'root',
    DB_PASSWORD: process.env.DB_PASSWORD || '1234',
    DB_NAME: process.env.DB_NAME || 'clinica_db',
    DB_PORT: process.env.DB_PORT || 3306,
    PORT: process.env.PORT || 3000
  };