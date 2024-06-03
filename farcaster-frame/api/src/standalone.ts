import express from "express";
import registerApiRoutes from "./index.js";

const app = express();
registerApiRoutes(app);
const port = 3333;
const server = app.listen(port);
console.log(`http://localhost:${port}`);
