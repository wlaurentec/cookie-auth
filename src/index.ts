import express from "express";
const morgan = require("morgan");
import cookieParser from "cookie-parser";

const app = express();
const port = 3000;
// Middleware JSON
app.use(express.json());
//Middleware libreria externa
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);
app.use(cookieParser());

// Routes

app.get("/", (req, res) => {
   console.log(req.cookies);
  res.send(req.cookies);
});

app.get("/set-cookie", (_req, res) => {
  const cookiePreferences = {
    userId: 1,
    language: "ES",
  };
  res.cookie("preferences", cookiePreferences, { maxAge: 20000, httpOnly: true });
  res.cookie("theme", "dark");
  res.send("Cookie seteada");
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
