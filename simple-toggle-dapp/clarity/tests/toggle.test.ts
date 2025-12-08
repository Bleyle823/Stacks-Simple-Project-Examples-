import {
  Clarinet,
  Tx,
  Chain,
  Account,
} from "vitest-environment-clarinet";
import { describe, it, expect } from "vitest";

describe("simple-toggle", () => {
  it("initial flag should be false", () => {
    Clarinet.test({
      name: "get-flag returns false by default",
      async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get("deployer")!;

        const block = chain.mineBlock([
          Tx.contractCall("toggle", "get-flag", [], deployer.address),
        ]);

        const [result] = block.receipts;
        result.result.expectBool(false);
      },
    });
  });

  it("set-true should set flag to true", () => {
    Clarinet.test({
      name: "set-true sets flag to true",
      async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get("deployer")!;

        let block = chain.mineBlock([
          Tx.contractCall("toggle", "set-true", [], deployer.address),
        ]);
        block.receipts[0].result.expectOk().expectBool(true);

        block = chain.mineBlock([
          Tx.contractCall("toggle", "get-flag", [], deployer.address),
        ]);
        block.receipts[0].result.expectBool(true);
      },
    });
  });

  it("set-false should set flag to false", () => {
    Clarinet.test({
      name: "set-false sets flag to false",
      async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get("deployer")!;

        let block = chain.mineBlock([
          Tx.contractCall("toggle", "set-true", [], deployer.address),
          Tx.contractCall("toggle", "set-false", [], deployer.address),
        ]);
        block.receipts[1].result.expectOk().expectBool(false);

        block = chain.mineBlock([
          Tx.contractCall("toggle", "get-flag", [], deployer.address),
        ]);
        block.receipts[0].result.expectBool(false);
      },
    });
  });

  it("toggle-flag should flip flag value", () => {
    Clarinet.test({
      name: "toggle-flag flips the flag",
      async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get("deployer")!;

        // Start from default false, toggle => true
        let block = chain.mineBlock([
          Tx.contractCall("toggle", "toggle-flag", [], deployer.address),
        ]);
        block.receipts[0].result.expectOk().expectBool(true);

        // Toggle again => false
        block = chain.mineBlock([
          Tx.contractCall("toggle", "toggle-flag", [], deployer.address),
        ]);
        block.receipts[0].result.expectOk().expectBool(false);
      },
    });
  });
});


