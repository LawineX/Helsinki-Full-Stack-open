const Filter = ({ value, onChange }) => (
  <div>
    filter shown with: <input value={value} onChange={onChange} />
  </div>
);

const PersonForm = ({
  onSubmit,
  newName,
  setNewName,
  phoneNumber,
  setPhoneNumber,
}) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
        <div>
          name:{" "}
          <input value={newName} onChange={(e) => setNewName(e.target.value)} />
        </div>
        <div>
          number:{" "}
          <input
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const Numbers = ({ addressBook, filter, onDelete }) => (
  <div>
    {addressBook.map((entry) => {
      if (entry.name.toLowerCase().startsWith(filter.toLowerCase())) {
        return (
          <li key={entry.name}>
            {entry.name}: {entry.number}
            <button onClick={() => onDelete(entry.id)}>delete</button>
          </li>
        );
      }
      return null;
    })}
  </div>
);

export { PersonForm, Filter, Numbers };
