import express from 'express';

const app = express();

app.use(express.static('static'));

app.get('/', async (req, res) => {
    const image = '/tarochi.jpg';
    const absolute = `http://${req.headers.host}${image}`;
    res.send(`
        <!DOCTYPE html>
        <html>
            <head>
                <meta property="fc:frame" content="vNext">
                <meta property="fc:frame:image" content="${absolute}">
                <meta property="og:image" content="${absolute}">
            </head>
            <body>
                <img src="${image}">
            </body>
        </html>
    `);
});

const server = app.listen(3000);
console.log('http://localhost:3000');
