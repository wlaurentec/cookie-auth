import express from "express";
const morgan = require("morgan");

const app = express();
const port = 3000;
// Middleware JSON
app.use(express.json());
//Middleware libreria externa
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);
console.log("Test");
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
