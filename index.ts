import * as express from 'express'

export const startServer = (port: number) => {
    const app = express();
    app.use(express.static('./dist'))
    // app.use(express.static('dist'));
    app.listen(port, () => console.log(`Example app listening on port ${port}!`));
}
