const express = require("express");

const server = express();

server.use(express.json());

const users = ["Matheus", "Apollo", "Davi"];

server.use((req, res, next) => {
  console.log(`Method: ${req.method}; URL: ${req.url}`);

  return next();
});

function checkNameExists(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: "Field name is required" });
  }

  return next();
}

function checkUserInArray(req, res, next) {
  if (!users[req.params.index]) {
    return res.status(400).json({ error: "User does not exists" });
  }

  return next();
}

server.get("/users", (req, res) => {
  return res.json(users);
});

server.get("/users/:index", checkUserInArray, (req, res) => {
  const { index } = req.params;

  return res.json({ user: users[index] });
});

server.post("/users", checkNameExists, (req, res) => {
  const { name } = req.body;

  users.unshift(name);

  return res.json(users);
});

server.put("/users/:index", checkUserInArray, checkNameExists, (req, res) => {
  const { name } = req.body;
  const { index } = req.params;

  users[index] = name;

  return res.json(users);
});

server.delete("/users/:index", checkUserInArray, (req, res) => {
  const { index } = req.params;

  users.splice(index, 1);

  return res.send();
});

server.listen(3000);

console.log("Server started at http://localhost:3000");
