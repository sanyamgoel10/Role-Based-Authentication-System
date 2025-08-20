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

        INSERT IGNORE INTO user_roles (role, description) VALUES ('Admin', 'Administrator with full access');
        INSERT IGNORE INTO user_roles (role, description) VALUES ('Legal', 'Legal team with limited access');
        INSERT IGNORE INTO user_roles (role, description) VALUES ('PM', 'Product Manager with limited access');
        INSERT IGNORE INTO user_roles (role, description) VALUES ('Sales', 'Sales team with limited access');
        INSERT IGNORE INTO user_roles (role, description) VALUES ('HR', 'Human Resources with limited access');
        INSERT IGNORE INTO user_roles (role, description) VALUES ('Support', 'Support team with limited access');
        INSERT IGNORE INTO user_roles (role, description) VALUES ('Operations', 'Operations team with limited access');

        INSERT IGNORE INTO users (email, password, name, role) VALUES ('admin@gmail.com, '', 'Administrator', (SELECT id FROM user_roles WHERE role = 'Admin'));
        INSERT IGNORE INTO users (email, password, name, role) VALUES ('test@gmail.com', '', 'Test User', (SELECT id FROM user_roles WHERE role = 'Admin'));
        INSERT IGNORE INTO users (email, password, name, role) VALUES ('legal_user@gmail.com', '', 'Legal User', (SELECT id FROM user_roles WHERE role = 'Legal'));
        INSERT IGNORE INTO users (email, password, name, role) VALUES ('pm_user@gmail.com', '', 'Product Manager User', (SELECT id FROM user_roles WHERE role = 'PM'));
        INSERT IGNORE INTO users (email, password, name, role) VALUES ('sales_manager@gmail.com', '', 'Sales Manager', (SELECT id FROM user_roles WHERE role = 'Sales'));
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