import { gql, useQuery } from "@apollo/client";
import { useState } from "react";
import "./App.css";

const getAllDrivers = gql`
  query GetAllDrivers {
    drivers {
      id
      name
      age
      cars {
        id
        name
        model
      }
    }
  }
`;

function App() {
  const { loading, error, data } = useQuery(getAllDrivers);
  console.log(data);
  const [driver, setDriver] = useState({
    name: "",
    age: 0,
    cars: []
  });

  const [car, setCar] = useState({
    name: "",
    model: ""
  });

  const addCar = async (e) => {
    e.preventDefault();
    if (!car.name || !car.model) {
      alert("Please fill in all fields");
      return;
    }
    try {
      const response = await fetch("http://localhost:3001/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            mutation Mutation($name: String!, $model: String!) {
              createCar(name: $name, model: $model) {
                id,
                name,
                model
              }
            }
          `,
          variables: {
            name: car.name,
            model: car.model,
          },
        }),
      });
      console.log(response);
      if (response.status !== 200) {
        console.log("abdelrahman");
        throw new Error(error.message);
      }
      const resData = await response.json();
      console.log("Car added:", resData.data.createCar);
    } catch (error) {
      console.error("Error adding car:", error);
    }
    setCar({
      name: "",
      model: "",
    });
  }

  const addDriver = async (e) => {
    e.preventDefault();
    if (!driver.name || driver.age <= 0 || driver.cars.length === 0) {
      alert("Please fill in all fields");
      return;
    }
    try {
      
      const response = await fetch("http://localhost:3001/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            mutation Mutation($name: String!, $age: Int!, $carIds: [ID!]!) {
            createDriver(name: $name, age: $age, carIds: $carIds) {
              id,
              name,
              age,
              cars {
                id,
                name,
                model
              }
            }
        }
          `,
          variables: {
            name: driver.name,
            age: driver.age,
            carIds: driver.cars,
          },
        }),
      })
      if (response.status !== 200) {
        throw new Error(error.message);
      }
      const resData = await response.json();
      console.log("Driver added:", resData.data.createDriver);
    } catch (error) {
      console.error("Error adding driver:", error);
    }
    setDriver({
      name: "",
      age: 0,
      cars: [],
    });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error {error.message}</p>;
  return (
    <>
      <div>
        <h1>Drivers</h1>
        <ul>
          {data.drivers.map((driver) => (
            <li key={driver.id}>
              {driver.name} ({driver.age} years old)
              <ul>
                {driver.cars.map((car) => (
                  <li key={car.id}>
                    {car.id}
                    <br />
                    {car.name}
                    <br />
                    {car.model}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <form onSubmit={addDriver}>
          <h2>Add Driver</h2>
          <input
            type="text"
            placeholder="Name"
            value={driver.name}
            onChange={(e) => setDriver({ ...driver, name: e.target.value })}
          />
          <input
            type="number"
            placeholder="Age"
            value={driver.age}
            onChange={(e) =>
              setDriver({ ...driver, age: parseInt(e.target.value, 10) })
            }
          />
          <input
            type="text"
            placeholder="Cars (comma separated IDs)"
            value={driver.cars.join(",")}
            onChange={(e) =>
              setDriver({ ...driver, cars: e.target.value.split(",") })
            }
          />
          <button type="submit">Add Driver</button>
        </form>

        <form onSubmit={addCar}>
          <h2>Add Car</h2>
          <input
            type="text"
            placeholder="Name"
            value={car.name}
            onChange={(e) => setCar({ ...car, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Model"
            value={car.model}
            onChange={(e) => setCar({ ...car, model: e.target.value })}
          />

          <button type="submit">Add Car</button>
        </form>
      </div>
    </>
  );
}

export default App;
