const express = require('express');
const app = express();
const PORT = process.env.PORT || 3060;
const morgan = require('morgan');
const cors = require('cors');

app.use(morgan('tiny'));
app.use(cors());

const netflix = require('./routes/netflix.js');
app.use(netflix);

app.listen(PORT, (req, res) => {
    console.log(`Listening on port ${PORT}`);
});