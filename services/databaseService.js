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
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            name TEXT NOT NULL,
            role TEXT NOT NULL CHECK(role IN ('Admin', 'Legal', 'PM', 'Sales', 'HR', 'Support', 'Operations')),
            status INTEGER DEFAULT 1,  -- Storing boolean as INTEGER (0 or 1)
            last_login DATETIME NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (role) REFERENCES user_roles(id)
        );

        -- Some sample users with some assigned roles
        -- Password for all sample users is same, i.e., password123. Stored as an bcrypt encrypted value with 12 rounds
        INSERT OR IGNORE INTO users (email, password, name, role) VALUES ('admin@gmail.com', '$2a$12$b0UagQCPVsfhjybDpYC2xuwJ3jBKkycmihVBNo4MX6thOpTMrirQu', 'Administrator', 'Admin');
        INSERT OR IGNORE INTO users (email, password, name, role) VALUES ('test@gmail.com', '$2a$12$b0UagQCPVsfhjybDpYC2xuwJ3jBKkycmihVBNo4MX6thOpTMrirQu', 'Test User', 'Admin');
        INSERT OR IGNORE INTO users (email, password, name, role) VALUES ('legal_user@gmail.com', '$2a$12$b0UagQCPVsfhjybDpYC2xuwJ3jBKkycmihVBNo4MX6thOpTMrirQu', 'Legal User', 'Legal');
        INSERT OR IGNORE INTO users (email, password, name, role) VALUES ('pm_user@gmail.com', '$2a$12$b0UagQCPVsfhjybDpYC2xuwJ3jBKkycmihVBNo4MX6thOpTMrirQu', 'Product Manager User', 'PM');
        INSERT OR IGNORE INTO users (email, password, name, role) VALUES ('sales_manager@gmail.com', '$2a$12$b0UagQCPVsfhjybDpYC2xuwJ3jBKkycmihVBNo4MX6thOpTMrirQu', 'Sales Manager', 'Sales');
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