import { faker } from "@faker-js/faker";

import { createOrder, getOrderByProtocol } from "../../src/order-service";
import * as orderRepository from "../../src/order-repository";
import { OrderInput } from "../../src/validator";

describe("Order Service Tests", () => {
  it("should create an order", async () => {
    const orderInput: OrderInput = {
      client: faker.person.fullName(),
      description: faker.commerce.productDescription(),
    };
    const protocol = new Date().getTime().toString();
    const status = "IN_PREPARATION";

    jest.spyOn(orderRepository, "create").mockImplementation((): any => {
      return {
        protocol,
        status,
      };
    });
    const result = await orderRepository.create(orderInput);
    expect(result.protocol).toBe(protocol);
    expect(result.status).toBe(status);
  });

  it("should return an order based on the protocol", async () => {
    const protocol = new Date().getTime().toString();
    const status = "IN_PREPARATION";

    jest.spyOn(orderRepository, "getByProtocol").mockImplementation((): any => {
      return {
        protocol,
        status,
      };
    });
    const result = await orderRepository.getByProtocol(protocol);
    expect(result.protocol).toBe(protocol);
    expect(result.status).toBe(status);
  });

  it("should return status INVALID when protocol doesn't exists", async () => {
    const protocol = new Date().getTime().toString();
    const status = "INVALID";

    jest.spyOn(orderRepository, "getByProtocol").mockImplementation((): any => {
      return {
        protocol,
        status,
      };
    });
    const result = await orderRepository.getByProtocol(protocol);
    expect(result.protocol).toBe(protocol);
    expect(result.status).toBe(status);
  });
});
