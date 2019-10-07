const express = require('express');

const app = express();
app.use(express.static('dist'));
app.listen(3099, () => console.log(`Example app listening on port ${3099}!`));
