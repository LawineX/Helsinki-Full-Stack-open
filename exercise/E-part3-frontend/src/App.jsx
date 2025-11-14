import { useEffect, useState } from "react";
import { PersonForm, Filter, Numbers } from "./components/Address";
import axios from "axios";
import addressService from "./services/address";
import Notification from "./components/Notification";
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
  const [Message, setMessage] = useState({ message: null, isProblem: false });
  const handleFormSubmit = (event) => {
    event.preventDefault();
    const personToUpdate = persons.find((p) => p.name === newName);

    if (personToUpdate) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        addressService
          .updatePerson(personToUpdate.id, {
            name: newName,
            number: phoneNumber,
          })
          .then((updatedPerson) => {
            setPersons(
              persons.map((person) =>
                person.id !== personToUpdate.id ? person : updatedPerson
              )
            );
            setMessage({
              message: `Updated ${newName}'s number successfully`,
              isProblem: false,
            });
          })
          .catch((error) => {
            setMessage({
              message: `Information of ${newName} has already been removed from server
              ${error.message}`,
              isProblem: true,
            });
            setPersons(persons.filter((p) => p.id !== personToUpdate.id));
          });
        setTimeout(() => {
          setMessage({ message: null, isProblem: false });
        }, 5000);
      }
      setNewName("");
      setPhoneNumber("");
      return;
    }
    addressService
      .addPerson({ name: newName, number: phoneNumber })
      .then((data) => {
        console.log("Added person:", data);
        setPersons([...persons, data]);
        setMessage({
          message: `Added ${newName} successfully`,
          isProblem: false,
        });
        setTimeout(() => {
          setMessage({ message: null, isProblem: false });
        }, 5000);
        setNewName("");
        setPhoneNumber("");
      })
      .catch((error) => {
        setMessage({
          message: `Person validation failed: ${error.response.data.error}`,
          isProblem: true,
        });
        setTimeout(() => {
          setMessage({ message: null, isProblem: false });
        }, 5000);
      });
  };

  const handleFilterChange = (event) => setFilter(event.target.value);
  const handleDelete = (id) => {
    if (
      window.confirm(`Are you sure you want to delete this person?
    ${persons.find((p) => p.id === id).name}
    number: ${persons.find((p) => p.id === id).number}`)
    ) {
      addressService.deletePerson(id).then(() => {
        setPersons(persons.filter((person) => person.id !== id));
      });
      setMessage({
        message: `Deleted person successfully`,
        isProblem: false,
      });
      setTimeout(() => {
        setMessage({ message: null, isProblem: false });
      }, 5000);
    } else {
      return;
    }
  };
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification {...Message} />
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
