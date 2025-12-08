import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";
import { initSimnet } from "@hirosystems/clarinet-sdk";

const simnet = await initSimnet();

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;

describe("counter contract", () => {
  it("starts at 0", () => {
    const response = simnet.callReadOnlyFn("counter", "get-counter", [], deployer);
    expect(response.result).toBeOk(Cl.uint(0));
  });

  it("can increment counter", () => {
    const response = simnet.callPublicFn("counter", "increment", [], deployer);
    expect(response.result).toBeOk(Cl.uint(1));

    const readResponse = simnet.callReadOnlyFn("counter", "get-counter", [], deployer);
    expect(readResponse.result).toBeOk(Cl.uint(1));
  });

  it("can decrement counter", () => {
    // Increment twice first
    simnet.callPublicFn("counter", "increment", [], deployer);
    simnet.callPublicFn("counter", "increment", [], deployer);

    // Then decrement
    const response = simnet.callPublicFn("counter", "decrement", [], deployer);
    expect(response.result).toBeOk(Cl.uint(1));

    const readResponse = simnet.callReadOnlyFn("counter", "get-counter", [], deployer);
    expect(readResponse.result).toBeOk(Cl.uint(1));
  });

  it("can reset counter", () => {
    // Increment a few times
    simnet.callPublicFn("counter", "increment", [], deployer);
    simnet.callPublicFn("counter", "increment", [], deployer);

    // Reset
    const response = simnet.callPublicFn("counter", "reset", [], deployer);
    expect(response.result).toBeOk(Cl.uint(0));

    const readResponse = simnet.callReadOnlyFn("counter", "get-counter", [], deployer);
    expect(readResponse.result).toBeOk(Cl.uint(0));
  });
});

