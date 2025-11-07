import { useEffect, useState } from "react";
import { PersonForm, Filter, Numbers } from "./components/Address";
import axios from "axios";
import addressService from "./services/address";
import Notification from "./components/Notification";

const App = () => {
  const [countryName, setCountryName] = useState("");
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [allCountries, setAllCountries] = useState(null);
  useEffect(() => {
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then((response) => {
        setAllCountries(response.data);
      });
  }, []);

  useEffect(() => {
    if (countryName !== "" && allCountries !== null) {
      setFilteredCountries(
        allCountries
          .map((country) =>
            country.name.common
              .toLocaleLowerCase()
              .includes(countryName.toLocaleLowerCase())
              ? country
              : null
          )
          .filter((country) => country !== null)
      );
    } else {
      setFilteredCountries(null);
    }
  }, [countryName]);

  return (
    <div>
      <p>
        find countries
        <input
          value={countryName}
          onChange={(e) => setCountryName(e.target.value)}
        />
      </p>
      <Countries
        filteredCountries={filteredCountries}
        setfilteredCountries={setFilteredCountries}
        setCountryName={setCountryName}
      />
    </div>
  );
};

const Countries = ({
  filteredCountries,
  setfilteredCountries,
  setCountryName,
}) => {
  if (filteredCountries === null) {
    return <></>;
  } else if (filteredCountries.length > 10) {
    return <p>Too many matches, specify another filter</p>;
  } else if (filteredCountries.length === 1) {
    return (
      <div>
        <h1>{filteredCountries[0].name.common}</h1>
        <p>
          Capital:{" "}
          {filteredCountries[0].capital &&
          filteredCountries[0].capital.length > 0
            ? filteredCountries[0].capital[0]
            : "无首都"}
        </p>
        <p>Area: {filteredCountries[0].area}</p>
        <h2>Languages:</h2>
        <ul>
          {Object.values(filteredCountries[0].languages).map((language) => (
            <li key={language}>{language}</li>
          ))}
        </ul>
        <img
          src={filteredCountries[0].flags.png}
          alt={`Flag of ${filteredCountries[0].name.common}`}
          width="200"
        />
        <h1>Weather in {filteredCountries[0].capital[0]}</h1>
        <Weather country={filteredCountries[0].capital[0]} />
      </div>
    );
  } else if (filteredCountries.length !== 0) {
    return (
      <div>
        <ul>
          {filteredCountries.map((country) => (
            <li key={country.cca2}>
              {country.name.common}
              <button
                onClick={() => {
                  setfilteredCountries([country]);
                  setCountryName(country.name.common);
                }}
              >
                show
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
};

const Weather = ({ country }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${country}&appid=b920564d6fecd0de18bcef3f4dca3c03`
      )
      .then((response) => setData(response.data))
      .catch((error) => setData(null));
  }, [country]);
  if (data === null) {
    return <></>;
  } else {
    return (
      <>
        <div>Temperature: {data.main.temp - 273.15 + " °C"}</div>
        <img
          src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
          alt="Weather icon not implemented"
        />
        <p>Wind: {data.wind.speed + " m/s"}</p>
      </>
    );
  }
};

export default App;
