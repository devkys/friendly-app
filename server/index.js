const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", userRoutes);

require('dotenv').config();

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser:  true,
    useUnifiedTopology: true
}).then(() => {
    console.log("DB connection success");
}).catch((err) => {
    console.log(err.message);
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on ${process.env.PORT}`);
})
