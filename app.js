const { PORT } = require('./config/config.js');

const express = require('express');
const app = express();
app.use(express.json());

const DatabaseService = require('./services/databaseService.js');

const userRoutes = require('./routes/userRoutes.js');
app.use('/api', userRoutes);

app.use((req, res) => {
    return res.status(404).json({
        status: 0,
        msg: 'Invalid URL'
    });
});

app.listen(PORT, async () => {
    await DatabaseService.initializeDB();
    console.log('Server is running on port: ', PORT);
});