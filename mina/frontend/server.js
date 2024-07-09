import express from 'express';

const app = express();

app.get('/', function (req, res, next) {
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  next();
});

express.static.mime.define({'application/javascript': ['js']});
app.use(express.static('.'));

app.listen(8081);
