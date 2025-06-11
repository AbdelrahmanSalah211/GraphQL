import Driver from './../models/Driver.js';
import Car from './../models/Car.js';

const resolvers = {
  Query: {
    drivers: async () => {
      try {
        const drivers = await Driver.find().populate("cars");
        return drivers.map(driver => ({
          ...driver.toObject(),
          id: driver._id.toString(),
          cars: driver.cars.map(car => ({
            ...car.toObject(),
            id: car._id.toString()
          }))
        }));
      } catch (error) {
        throw new Error("Failed to fetch driver: " + error.message);
      }
    },
    cars: async () => {
      try {
        const cars = await Car.find();
        return cars.map(car => ({
          ...car.toObject(),
          id: car._id.toString()
        }));
      } catch (error) {
        throw new Error("Failed to fetch cars: " + error.message);
      }
    },
  },

  Mutation: {
    createCar: async (_, { name, model }) => {
      try {
        const car = await Car.create({ name, model });
        return {
          ...car.toObject(),
          id: car._id.toString()
        };
      } catch (error) {
        throw new Error("Failed to create car: " + error.message);
      }
    },

    createDriver: async (_, { name, age, carIds }) => {
      try {
        const cars = await Car.find({ _id: { $in: carIds } });
        if (cars.length !== carIds.length) {
          throw new Error("One or more car IDs are invalid");
        }
        const driver = await Driver.create({ name, age, cars: carIds });
        const populatedDriver = await Driver.findById(driver._id).populate("cars");
        return {
          ...populatedDriver.toObject(),
          id: populatedDriver._id.toString(),
          cars: populatedDriver.cars.map(car => ({
            ...car.toObject(),
            id: car._id.toString()
          }))
        };
      } catch (error) {
        throw new Error("Failed to create driver: " + error.message);
      }
    },
  },
};

export default resolvers;
