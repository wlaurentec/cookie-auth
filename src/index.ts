import express from "express";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";

const app = express();
const port = 5500;

app.use(cookieParser()); // Poblar req.cookies con objetos de cookies
app.use(express.json()); // Transformar req.body a JSON

// Arreglo de usuarios en memoria:
// El id será un string ya que usaremos 'crypto.randomUUID()' para generarlo
const users: { id: string; email: string; password: string }[] = [];

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email);

  if (user) {
    res.status(400).send("El correo ya está registrado");
    return;
  }

  const costFactor = 10;
  const hashedPassword = await bcrypt.hash(password, costFactor);

  const newUser = {
    id: crypto.randomUUID(),
    email,
    password: hashedPassword,
  };

  users.push(newUser);
  res.status(201).json(newUser);
});

interface sessions {
  [key: string]: { userId: string }; // Index signature
}
const sessions: sessions = {}; 

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email);
  if (!user) {
    res.status(401).send("El email no existe");
    return;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    res.status(401).send("El password es incorrecto");
    return;
  }

  if (isPasswordValid) {
    // Generamos un id de sesión
    const sessionId = crypto.randomUUID();
    // Guardamos el id el usuario en la sesión
    sessions[sessionId] = { userId: user.id };
    console.log(sessions);
    // Guardamos el id de sesión en una cookie
    res.cookie("sessionId", sessionId, { httpOnly: true });
    res.send("Login exitoso");

    /* res.cookie("userId", user.id, { httpOnly: true });
    res.send("Login exitoso"); */
  } else {
    res.status(401).send("Credenciales incorrectas");
  }
});

app.get("/user", (req, res) => {
  const sessionId = req.cookies.sessionId;
  const userId = sessions[sessionId]?.userId;
  console.log(userId);
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
