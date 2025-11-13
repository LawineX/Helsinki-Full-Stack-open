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
const PORT = process.env.PORT || 3001;

app.get("/api/persons", (req, res, next) => {
  AddressBook.find({})
    .then((addresses) => {
      res.json(addresses);
    })
    .catch((error) => next(error));
});

app.get("/info", (req, res, next) => {
  AddressBook.countDocuments({})
    .then((entryCount) => {
      const currentTime = new Date();
      res.send(
        `<p>Phonebook has info for <strong>${entryCount}</strong> people</p><p>${currentTime}</p>`
      );
    })
    .catch((error) => next(error));
});

app.get("/api/persons/:id", (req, res, next) => {
  AddressBook.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
  AddressBook.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (req, res, next) => {
  if (!req.body.name || !req.body.number) {
    res.status(400).json({ error: "name or number is missing" });
    return;
  }
  AddressBook.findOne({ name: req.body.name })
    .then((person) => {
      console.log(person);
      if (person) {
        throw new Error("Name must be unique");
      }
      const { name, number } = req.body;
      const newPerson = new AddressBook({name, number });
      return newPerson.save(); //返回promise,能解析出来mongoose的对象
    })
    .then((savedPerson) => {
      console.log("Saved person:", savedPerson);
      res.status(201).json(savedPerson); //mongoose对象转换为JSON,会自动调用toJSON方法
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  const { name, number } = req.body;
  AddressBook.findByIdAndUpdate(
    id,
    { name, number },
    { new: true, runValidators: true, context: "query" }
  )
    .then((updatedPerson) => {
      if (!updatedPerson) {
        return res.status(404).end();
      }
      res.json(updatedPerson);
    })
    .catch((error) => next(error));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  if (error.name === "Error" && error.message === "Name must be unique") {
    return response.status(400).send({ error: "Name must be unique" });
  }
  response.status(500).send({ error: "Internal server error" });
  next(error);
};

app.use(errorHandler);
