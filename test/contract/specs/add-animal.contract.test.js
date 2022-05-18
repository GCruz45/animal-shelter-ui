import { provider } from "../config/init-pact";
import { Matchers } from "@pact-foundation/pact";
import { AnimalController } from "../../../controllers";
let animalBody =
  "{name: 'addedAnimal', breed: 'addedAnimalBreed', gender: 'Female', vaccinated: false,}";
describe("Animal Service", () => {
  describe("When a request to add an animal is made", () => {
    beforeAll(async () => {
      await provider.setup();
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
    afterAll(() => provider.finalize());
  });
});
