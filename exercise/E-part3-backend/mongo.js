const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://lawine:${password}@cluster0.dp9yvlh.mongodb.net/AddressBook?appName=Cluster0`;

mongoose.set("strictQuery", false);

mongoose.connect(url);

const addressSchema = new mongoose.Schema({
  id: Number,
  name: String,
  number: String,
});

const Address = mongoose.model("Address", addressSchema);

if (process.argv.length > 5) {
  console.log(
    "Too many arguments provided. Please provide only name and number."
  );
  mongoose.connection.close();
  return;
} else if (process.argv.length === 5) {
  const name = process.argv[3];
  const number = process.argv[4];

  const address = new Address({
    id: Math.floor(Math.random() * 1000000),
    name: name,
    number: number,
  });

  address.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
} else if (process.argv.length === 3) {
  console.log("Phonebook:");
  Address.find({}).then((result) => {
    result.forEach((address) => {
      console.log(`${address.name} ${address.number}`);
    });
    mongoose.connection.close();
  });
}
