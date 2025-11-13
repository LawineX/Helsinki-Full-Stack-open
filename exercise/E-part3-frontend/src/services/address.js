import axios from "axios";
const baseUrl = "/api/persons";

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => {
    const data = response.data;
    if (Array.isArray(data)) {
      return data;
    } else if (typeof data === "string") {
      try {
        return JSON.parse(data);
      } catch (error) {
        console.error("Error parsing response data:", error);
        throw error;
      }
    }
  });
};

const addPerson = (newPerson) => {
  const request = axios.post(baseUrl, newPerson);
  return request.then((response) => response.data);
};

const deletePerson = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`);
  return request.then((response) => response.data);
};

const updatePerson = (id, updatedPerson) => {
  const request = axios.put(`${baseUrl}/${id}`, updatedPerson);
  return request.then((response) => response.data);
};

export default { getAll, addPerson, deletePerson, updatePerson };
