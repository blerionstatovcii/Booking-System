const mysql = require('mysql2/promise');

const database = process.env.DB_NAME || 'bookingSystem';
if (!/^[a-zA-Z0-9_]+$/.test(database)) {
    throw new Error('DB_NAME may contain only letters, numbers, and underscores');
}

const connectionOptions = {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    charset: 'utf8mb4',
    timezone: 'Z',
    ...(process.env.DB_SSL === 'true' ? { ssl: { minVersion: 'TLSv1.2' } } : {})
};

const pool = mysql.createPool({
    ...connectionOptions,
    database,
    decimalNumbers: true,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const schema = [
    `CREATE TABLE IF NOT EXISTS users (
        _id CHAR(24) CHARACTER SET ascii COLLATE ascii_bin PRIMARY KEY,
        fullName VARCHAR(255) NOT NULL,
        age INT NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        location TEXT NULL,
        Image TEXT NULL,
        createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
    `CREATE TABLE IF NOT EXISTS appointments (
        _id CHAR(24) CHARACTER SET ascii COLLATE ascii_bin PRIMARY KEY,
        userId CHAR(24) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
        paymentId CHAR(24) CHARACTER SET ascii COLLATE ascii_bin NULL UNIQUE,
        Trajtimi VARCHAR(255) NOT NULL,
        \`date\` DATETIME(3) NOT NULL,
        \`time\` VARCHAR(32) NOT NULL,
        status VARCHAR(32) NOT NULL DEFAULT 'Scheduled',
        createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
        INDEX idx_appointments_userId (userId)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
    `CREATE TABLE IF NOT EXISTS payments (
        _id CHAR(24) CHARACTER SET ascii COLLATE ascii_bin PRIMARY KEY,
        appointmentId CHAR(24) CHARACTER SET ascii COLLATE ascii_bin NOT NULL UNIQUE,
        amount DECIMAL(12,2) NOT NULL,
        status VARCHAR(32) NOT NULL DEFAULT 'Pending',
        \`date\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
    `CREATE TABLE IF NOT EXISTS feedbacks (
        _id CHAR(24) CHARACTER SET ascii COLLATE ascii_bin PRIMARY KEY,
        appointmentId CHAR(24) CHARACTER SET ascii COLLATE ascii_bin NOT NULL UNIQUE,
        userId CHAR(24) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
        comment TEXT NOT NULL,
        rating TINYINT UNSIGNED NOT NULL,
        language VARCHAR(32) NOT NULL,
        needToImprove TEXT NOT NULL DEFAULT 'Everything is good',
        createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
        INDEX idx_feedbacks_userId (userId)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`
];

const initializeDatabase = async () => {
    if (process.env.DB_AUTO_CREATE !== 'false') {
        const connection = await mysql.createConnection(connectionOptions);
        try {
            await connection.query(
                `CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
            );
        } finally {
            await connection.end();
        }
    }

    for (const statement of schema) {
        await pool.query(statement);
    }
};

module.exports = { pool, initializeDatabase };
