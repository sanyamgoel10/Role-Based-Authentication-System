const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");

// Open database connection
const connectDB = async () => {
    return open({
        filename: "./database.db",
        driver: sqlite3.Database,
    });
};

// Creating the table structure
const initializeDB = async () => {
    const db = await connectDB();
    await db.exec(`
        CREATE TABLE IF NOT EXISTS user_roles (
            id INTEGER PRIMARY KEY,
            role TEXT NOT NULL UNIQUE,
            description TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            name TEXT NOT NULL,
            role INTEGER NOT NULL,
            status INTEGER DEFAULT 1,  -- Storing boolean as INTEGER (0 or 1)
            last_login DATETIME NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (role) REFERENCES user_roles(id)
        );

        -- Inserting default roles
        INSERT OR IGNORE INTO user_roles (role, description) VALUES ('Admin', 'Administrator with full access');
        INSERT OR IGNORE INTO user_roles (role, description) VALUES ('Legal', 'Legal team with limited access');
        INSERT OR IGNORE INTO user_roles (role, description) VALUES ('PM', 'Product Manager with limited access');
        INSERT OR IGNORE INTO user_roles (role, description) VALUES ('Sales', 'Sales team with limited access');
        INSERT OR IGNORE INTO user_roles (role, description) VALUES ('HR', 'Human Resources with limited access');
        INSERT OR IGNORE INTO user_roles (role, description) VALUES ('Support', 'Support team with limited access');
        INSERT OR IGNORE INTO user_roles (role, description) VALUES ('Operations', 'Operations team with limited access');

        -- Inserting default users with hashed passwords (Password is: 'test_password') encrypted using bcrypt with 12 rounds
        INSERT OR IGNORE INTO users (email, password, name, role) VALUES ('admin@gmail.com', '$2a$12$5kQ/FhhK7XBgVWBRVG40.OJ3/lSxS3VyAWOHLTaGREQDUZwqwSFUC', 'Administrator', (SELECT id FROM user_roles WHERE role = 'Admin'));
        INSERT OR IGNORE INTO users (email, password, name, role) VALUES ('test@gmail.com', '$2a$12$5kQ/FhhK7XBgVWBRVG40.OJ3/lSxS3VyAWOHLTaGREQDUZwqwSFUC', 'Test User', (SELECT id FROM user_roles WHERE role = 'Admin'));
        INSERT OR IGNORE INTO users (email, password, name, role) VALUES ('legal_user@gmail.com', '$2a$12$5kQ/FhhK7XBgVWBRVG40.OJ3/lSxS3VyAWOHLTaGREQDUZwqwSFUC', 'Legal User', (SELECT id FROM user_roles WHERE role = 'Legal'));
        INSERT OR IGNORE INTO users (email, password, name, role) VALUES ('pm_user@gmail.com', '$2a$12$5kQ/FhhK7XBgVWBRVG40.OJ3/lSxS3VyAWOHLTaGREQDUZwqwSFUC', 'Product Manager User', (SELECT id FROM user_roles WHERE role = 'PM'));
        INSERT OR IGNORE INTO users (email, password, name, role) VALUES ('sales_manager@gmail.com', '$2a$12$5kQ/FhhK7XBgVWBRVG40.OJ3/lSxS3VyAWOHLTaGREQDUZwqwSFUC', 'Sales Manager', (SELECT id FROM user_roles WHERE role = 'Sales'));
    `);
};

const getRowData = async (query, params) => {
    const db = await connectDB();
    return await db.get(query, params);
}

const getAllData = async (query, params) => {
    const db = await connectDB();
    return await db.all(query, params);
}

const setData = async (query, params) => {
    const db = await connectDB();
    const result = await db.run(query, params);
    return result.lastID;
}

module.exports = { initializeDB, getRowData, getAllData, setData };