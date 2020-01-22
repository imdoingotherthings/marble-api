const express = require('express');
const app = express();
const PORT = process.env.PORT || 3060;
const morgan = require('morgan');
const cors = require('cors');

app.use(morgan('tiny'));
app.use(cors());

const netflix = require('./routes/netflix.js');
const amazon = require('./routes/amazon.js');
const youtube = require('./routes/youtube.js');

app.get('/', (req, res) => {
    res.json('Use Routes: /netflix, /youtube, /amazon');
});

app.use(netflix);
app.use(amazon);
app.use(youtube);

app.listen(PORT, (req, res) => {
    console.log(`Listening on port ${PORT}`);
});