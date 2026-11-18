const express = require('express');
require('dotenv').config()
const PORT = process.env.PORT || 2200;
const sequelize = require('./database/database');
const documentsRouter = require('./routes/documentsRouter');

const app = express();
app.use(express.json());
app.use(documentsRouter);

const DBConnect = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection established successfully')
    } catch (error) {
        console.log("Error connecting to Database: ", error.message)
    }
}

DBConnect();

app.listen(PORT, ()=> {
    console.log(`Server is running on PORT: ${PORT}`)
})
