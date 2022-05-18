import { provider } from "../config/init-pact";
import { Matchers } from "@pact-foundation/pact";
import { AnimalController } from "../../../controllers";

describe("Animal Service", () => {
  describe("When a request to delete an animal with name = Bigotes is made", () => {
    beforeAll(async () => {
      await provider.setup();
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
    afterAll(() => provider.finalize());
  });
});
