import { useEffect, useState } from "react";
import { PersonForm, Filter, Numbers } from "./components/Address";
import axios from "axios";
import addressService from "./services/address";
const App = () => {
  const [persons, setPersons] = useState([]);
  useEffect(() => {
    addressService.getAll().then((data) => {
      setPersons(data);
    });
  }, []);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [newName, setNewName] = useState("");
  const [filter, setFilter] = useState("");

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (persons.some((person) => person.name === newName)) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const personToUpdate = persons.find((p) => p.name === newName);
        addressService
          .updateEntry(personToUpdate.id, { name: newName, number: phoneNumber })
          .then((updatedPerson) => {
            setPersons(
              persons.map((person) =>
                person.id !== personToUpdate.id ? person : updatedPerson
              )
            );
          });
      }
      setNewName("");
      setPhoneNumber("");
      return;
    }
    addressService
      .addNew({ name: newName, number: phoneNumber })
      .then((data) => {
        setPersons([...persons, data]);
      });
    setNewName("");
    setPhoneNumber("");
  };

  const handleFilterChange = (event) => setFilter(event.target.value);
  const handleDelete = (id) => {
    if (
      window.confirm(`Are you sure you want to delete this entry?
    ${persons.find((p) => p.id === id).name}
    number: ${persons.find((p) => p.id === id).number}`)
    ) {
      addressService.deleteEntry(id).then(() => {
        setPersons(persons.filter((person) => person.id !== id));
      });
    } else {
      return;
    }
  };
  return (
    <div>
      <h2>Phonebook</h2>
      <Filter value={filter} onChange={handleFilterChange} />
      <h2>Add a new</h2>
      <PersonForm
        onSubmit={handleFormSubmit}
        newName={newName}
        setNewName={setNewName}
        phoneNumber={phoneNumber}
        setPhoneNumber={setPhoneNumber}
      />
      <h2>Numbers</h2>
      <Numbers addressBook={persons} filter={filter} onDelete={handleDelete} />
    </div>
  );
};

export default App;
