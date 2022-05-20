import { provider } from "../config/init-pact";
import { Matchers } from "@pact-foundation/pact";
import { AnimalController } from "../../../controllers";

describe("Animal Service", () => {
  beforeAll(async () => {
    await provider.setup();
  });
  describe("When a request to list all animals is made", () => {
    beforeEach(async () => {
      await provider.addInteraction({
        uponReceiving: "a request to list all animals",
        state: "has animals",
        withRequest: {
          method: "GET",
          path: "/animals",
        },
        willRespondWith: {
          status: 200,
          body: Matchers.eachLike({
            name: Matchers.like("manchas"),
            breed: Matchers.like("Bengali"),
            gender: Matchers.like("Female"),
            vaccinated: Matchers.boolean(true),
          }),
        },
      });
    });
    test("should return the correct data", async () => {
      const response = await AnimalController.list();
      expect(response.data).toMatchSnapshot();
      await provider.verify();
    });
  });
  describe("When a request to add an animal is made", () => {
    let animalBody =
      "{name: 'addedAnimal', breed: 'addedAnimalBreed', gender: 'Female', vaccinated: false,}";
    beforeEach(async () => {
      await provider.addInteraction({
        uponReceiving: "a request to add an animal",
        state: "adds animal with name = addedAnimal",
        withRequest: {
          method: "POST",
          body: animalBody,
          path: "/animals",
        },
        willRespondWith: {
          status: 201,
          // headers: { Location: "/animals/addedAnimal" },
          body: animalBody,
        },
      });
    });
    test("should return the correct data", async () => {
      const response = await AnimalController.register(animalBody);
      expect(response.data).toMatchSnapshot();
      await provider.verify();
    });
  });
  describe("When a request to delete an animal with name = Bigotes is made", () => {
    beforeEach(async () => {
      await provider.addInteraction({
        uponReceiving: "a request to delete animal with name = Bigotes",
        state: "deletes animal with name = Bigotes",
        withRequest: {
          method: "DELETE",
          path: "/animals/bigotes",
        },
        willRespondWith: {
          status: 200,
        },
      });
    });
    test("should return the correct data", async () => {
      const response = await AnimalController.delete("bigotes");
      expect(response.data).toMatchSnapshot();
      await provider.verify();
    });
  });
  describe("When a request to list an animal with name = Bigotes is made", () => {
    beforeEach(async () => {
      await provider.addInteraction({
        uponReceiving: "a request to list animal with name = Bigotes",
        state: "has animal with name = Bigotes",
        withRequest: {
          method: "GET",
          path: "/animals/bigotes",
        },
        willRespondWith: {
          status: 200,
          body: Matchers.eachLike({
            name: "Bigotes",
            breed: Matchers.like("Bengali"),
            gender: Matchers.like("Female"),
            vaccinated: Matchers.boolean(true),
          }),
        },
      });
    });
    test("should return the correct data", async () => {
      const response = await AnimalController.getAnimal("bigotes");
      expect(response.data).toMatchSnapshot();
      await provider.verify();
    });
  });
  describe("'When a request to list all animals is made", () => {
    beforeEach(async () => {
      await provider.addInteraction({
        uponReceiving: "a request to update an animal",
        state: "updates the animal with name = animalToUpdate",
        withRequest: {
          method: "PUT",
          path: "/animals/manchas",
        },
        willRespondWith: {
          status: 200,
          body: {
            id: Matchers.like(10),
            name: Matchers.like("manchas"),
            breed: Matchers.like("Bengali"),
            gender: Matchers.like("Female"),
            vaccinated: Matchers.boolean(true),
            vaccines: ["lupus", "rabia"],
          },
        },
      });
    });

    test("should return the correct data", async () => {
      const response = await AnimalController.updateAnimal("manchas");

      expect(response.data).toMatchSnapshot();
      await provider.verify();
    });
  });

  afterAll(() => provider.finalize());
});
