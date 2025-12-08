import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";
import { initSimnet } from "@hirosystems/clarinet-sdk";

const simnet = await initSimnet();

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;

describe("message-board contract", () => {
  it("has a default message", () => {
    const response = simnet.callReadOnlyFn("message-board", "get-message", [], deployer);
    expect(response.result).toBeOk(Cl.stringAscii("Hello from Clarity!"));
  });

  it("initializes owner on first set-message call and allows update", () => {
    const newMessage = "First owner message";
    const tx = simnet.callPublicFn("message-board", "set-message", [Cl.stringAscii(newMessage)], deployer);
    expect(tx.result).toBeOk(Cl.stringAscii(newMessage));

    const read = simnet.callReadOnlyFn("message-board", "get-message", [], deployer);
    expect(read.result).toBeOk(Cl.stringAscii(newMessage));

    const owner = simnet.callReadOnlyFn("message-board", "get-owner", [], deployer);
    expect(owner.result).toBeOk(Cl.some(Cl.principal(deployer)));
  });

  it("prevents non-owner from updating the message", () => {
    // Initialize owner as deployer
    simnet.callPublicFn("message-board", "set-message", [Cl.stringAscii("Owner only")], deployer);

    const tx = simnet.callPublicFn(
      "message-board",
      "set-message",
      [Cl.stringAscii("Hacker message")],
      wallet1
    );

    expect(tx.result).toBeErr(Cl.uint(100)); // not-authorized error

    const read = simnet.callReadOnlyFn("message-board", "get-message", [], deployer);
    expect(read.result).toBeOk(Cl.stringAscii("Owner only"));
  });
});


