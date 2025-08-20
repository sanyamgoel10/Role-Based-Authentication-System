const { PORT } = require('./config/config.js');

const express = require('express');
const app = express();
app.use(express.json());



app.use((req, res) => {
    return res.status(404).json({
        status: 0,
        msg: 'Invalid URL'
    });
});

app.listen(PORT, async () => {
    console.log('Server is running on port: ', PORT);
});