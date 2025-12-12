import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";
import { initSimnet } from "@hirosystems/clarinet-sdk";

const simnet = await initSimnet();

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;

describe("message contract", () => {
  it("starts with default message", () => {
    const response = simnet.callReadOnlyFn("message", "get-message", [], deployer);
    expect(response.result).toBeOk(Cl.stringUtf8("Hello, Stacks!"));
  });

  it("can set a new message", () => {
    const response = simnet.callPublicFn("message", "set-message", [Cl.stringUtf8("New message")], deployer);
    expect(response.result).toBeOk(Cl.stringUtf8("New message"));

    const readResponse = simnet.callReadOnlyFn("message", "get-message", [], deployer);
    expect(readResponse.result).toBeOk(Cl.stringUtf8("New message"));
  });

  it("can clear the message", () => {
    simnet.callPublicFn("message", "set-message", [Cl.stringUtf8("To be cleared")], deployer);

    const response = simnet.callPublicFn("message", "clear-message", [], deployer);
    expect(response.result).toBeOk(Cl.stringUtf8(""));

    const readResponse = simnet.callReadOnlyFn("message", "get-message", [], deployer);
    expect(readResponse.result).toBeOk(Cl.stringUtf8(""));
  });
});


