import { provider } from "../config/init-pact";
import { Matchers } from "@pact-foundation/pact";
import { AnimalController } from "../../../controllers";

describe("Animal Service", () => {
  describe("When a request to list an animal with name = Bigotes is made", () => {
    beforeAll(async () => {
      await provider.setup();
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
    afterAll(() => provider.finalize());
  });
});
