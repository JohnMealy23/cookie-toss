const express = require('express');

export const port = 3099;

const app = express();
// app.use(express.static('dist'));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
