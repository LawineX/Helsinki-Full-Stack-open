import { useEffect, useState } from "react";
import { PersonForm, Filter, Numbers } from "./components/Address";
import axios from "axios";
const App = () => {
  const [persons, setPersons] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:3001/persons").then((response) => {
      setPersons(response.data);
    });
  }, []);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [newName, setNewName] = useState("");
  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (persons.some((person) => person.name === newName)) {
      alert(`${newName} is already added to phonebook`);
      setNewName("");
      setPhoneNumber("");
      return;
    }
    setPersons([...persons, { name: newName, number: phoneNumber }]);
    setNewName("");
    setPhoneNumber("");
  };

  const [filter, setFilter] = useState("");
  const handleFilterChange = (event) => setFilter(event.target.value);

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
      <Numbers addressBook={persons} filter={filter} />
    </div>
  );
};

export default App;
