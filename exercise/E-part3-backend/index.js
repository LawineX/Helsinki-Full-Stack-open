const express = require("express");
const app = express();
app.use(express.static("dist"));
app.use(express.json());
const morgan = require("morgan");
morgan.token("body", (req, res) => JSON.stringify(req.body));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);
app.use(morgan("body"));
require("dotenv").config();
const AddressBook = require("./models/address");

const addressBook = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (req, res) => {
  AddressBook.find({}).then((addresses) => {
    res.json(addresses);
  });
});

app.get("/info", (req, res) => {
  const entryCount = addressBook.length;
  const currentTime = new Date();
  res.send(
    `<p>Phonebook has info for <strong>${entryCount}</strong> people</p><p>${currentTime}</p>`
  );
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  AddressBook.findById(id).then((person) => {
    if (person) {
      res.json(person);
    } else {
      res.status(404).end();
    }
  });
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const index = addressBook.findIndex((p) => p.id === id);
  if (index !== -1) {
    addressBook.splice(index, 1);
    // addressBook = addressBook.filter((p) => p.id !== id);
    res.send("Person deleted");
    res.status(204).end();
  } else {
    res.status(404).end();
  }
});

app.post("/api/persons", (req, res) => {
  const checkNameExists = () =>
    AddressBook.find({ name: req.body.name }).then(
      (person) => person !== null
    );
  const checkBodyExists = () => !req.body.name || !req.body.number;

  if (checkBodyExists()) {
    return res.status(400).json({ error: "name or number is missing" });
  }
  if (checkNameExists()) {
    return res.status(400).json({ error: "name must be unique" });
  }
  const generateId = () => {
    return Math.floor(Math.random() * 10000).toString();
  };
  const { name, number } = req.body;
  const newPerson = { id: generateId(), name, number };
  addressBook.push(newPerson);
  res.status(201).json(newPerson);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
