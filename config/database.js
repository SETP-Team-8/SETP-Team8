const mysql = require('mysql2');


const dbConfig = process.env.JAWSDB_MARIA_URL ? process.env.JAWSDB_MARIA_URL : {
    host: 'localhost',
    user: 'root',
    password: 'passwordisPassw0rd',
    database: 'restaurantDB',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

module.exports = pool.promise();