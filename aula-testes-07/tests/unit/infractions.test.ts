import { Infraction, User } from "@prisma/client";
import * as userRepository from "../../src/users-repository";
import * as infractionsRepository from "../../src/infractions-repository";
import { faker } from "@faker-js/faker";
import { getInfractionsFrom } from "infractions-service";

describe("Infractions Service Tests", () => {
  it("should get infractions from user", async () => {
    const userInput: User = {
      id: 1,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      licenseId: faker.lorem.word(),
    };

    const infractionInput: Infraction = {
      id: 1,
      date: new Date(),
      description: faker.lorem.sentence(),
      cost: Number(faker.commerce.price()),
      level: "MEDIUM",
      userId: userInput.id,
    };

    jest
      .spyOn(userRepository, "getUserByDocument")
      .mockImplementationOnce((): any => {
        return {
          id: userInput.id,
          firstName: userInput.firstName,
          lastName: userInput.lastName,
          licenseId: userInput.licenseId,
        };
      });

    jest
      .spyOn(infractionsRepository, "getInfractionsFrom")
      .mockImplementationOnce((): any => {
        return [
          {
            id: infractionInput.id,
            date: infractionInput.date,
            description: infractionInput.description,
            cost: infractionInput.cost,
            level: infractionInput.level,
            userId: infractionInput.userId,
          },
        ];
      });

    const userInfractions = await getInfractionsFrom(userInput.licenseId);
    expect(userInfractions).toEqual(
      expect.objectContaining({
        id: userInput.id,
        firstName: userInput.firstName,
        lastName: userInput.lastName,
        licenseId: userInput.licenseId,
        infractions: expect.arrayContaining([
          expect.objectContaining({
            id: infractionInput.id,
            date: infractionInput.date,
            description: infractionInput.description,
            cost: infractionInput.cost,
            level: infractionInput.level,
            userId: infractionInput.userId,
          }),
        ]),
      })
    );
  });

  it("should throw an error when driver license does not exists", () => {
    jest
      .spyOn(userRepository, "getUserByDocument")
      .mockImplementation((): any => {
        return undefined;
      });

    const userInfractions = getInfractionsFrom("invalid license");
    expect(userInfractions).rejects.toEqual({
      type: "NOT_FOUND",
      message: "Driver not found.",
    });
  });
});
