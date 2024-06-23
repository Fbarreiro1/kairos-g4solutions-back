module.exports = {
    DB_HOST : process.env.DB_HOST || 'localhost',
    DB_USER: process.env.DB_USER || 'tp_g4',
    DB_PASSWORD: process.env.DB_PASSWORD || '123456789',
    DB_NAME: process.env.DB_NAME || 'tp_g4_db',
    DB_PORT: process.env.DB_PORT,
    PORT: process.env.PORT || 3000
  };