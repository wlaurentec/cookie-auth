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

// Routes

app.get("/", (req, res) => {
  console.log(req.headers.cookie?.split("; "));

  const cookies: Record<string, string> = {};
  req.headers.cookie?.split("; ").forEach((cookie) => {
    const [key, value] = cookie.split("=");
    cookies[key] = value;
  });

  console.log(cookies);

  res.send(cookies);
});

app.get("/set-cookie", (_req, res) => {
  const cookiePreferences = {
    userId: 1,
    language: "ES",
  };
  res.cookie("preferences", cookiePreferences);
  res.cookie("theme", "dark");
  res.send("Cookie seteada");
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
