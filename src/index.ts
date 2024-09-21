import express from "express";
import cookieParser from "cookie-parser";

const app = express();
const port = 5500;

app.use(cookieParser()); // Poblar req.cookies con objetos de cookies
app.use(express.json()); // Transformar req.body a JSON

// Arreglo de usuarios en memoria:
// El id será un string ya que usaremos 'crypto.randomUUID()' para generarlo
const users: { id: string; email: string; password: string }[] = [];

app.post("/signup", (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email);

  if (user) {
    res.status(400).send("El correo ya está registrado");
    return;
  }
  const newUser = {
    id: crypto.randomUUID(),
    email,
    password,
  };

  users.push(newUser);
  res.status(201).json(newUser);
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email && u.password === password);
  if (user) {
    res.cookie("userId", user.id, { httpOnly: true });
    res.send("Login exitoso");
  } else {
    res.status(401).send("Credenciales incorrectas");
  }
});

app.get("/user", (req, res) => {
  const userId = req.cookies.userId;
  const user = users.find((u) => u.id === userId);
  if (user) {
    res.json(user);
  } else {
    res.status(403).send("Acceso denegado");
  }
});

app.post("/logout", (_req, res) => {
  res.clearCookie("userId");
  res.send("Logout exitoso");
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
