import {
  Clarinet,
  Tx,
  Chain,
  Account,
} from "vitest-environment-clarinet";
import { describe, it, expect } from "vitest";

describe("simple-vote", () => {
  it("initial votes should be 0 for yes and no", () => {
    Clarinet.test({
      name: "get-yes-votes and get-no-votes return 0 by default",
      async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get("deployer")!;

        const block = chain.mineBlock([
          Tx.contractCall("vote", "get-yes-votes", [], deployer.address),
          Tx.contractCall("vote", "get-no-votes", [], deployer.address),
        ]);

        block.receipts[0].result.expectUint(0);
        block.receipts[1].result.expectUint(0);
      },
    });
  });

  it("vote-yes increments yes-votes", () => {
    Clarinet.test({
      name: "vote-yes increases yes counter",
      async fn(chain: Chain, accounts: Map<string, Account>) {
        const wallet1 = accounts.get("wallet_1")!;

        const block = chain.mineBlock([
          Tx.contractCall("vote", "vote-yes", [], wallet1.address),
          Tx.contractCall("vote", "get-yes-votes", [], wallet1.address),
        ]);

        block.receipts[0].result.expectOk().expectUint(1);
        block.receipts[1].result.expectUint(1);
      },
    });
  });

  it("vote-no increments no-votes", () => {
    Clarinet.test({
      name: "vote-no increases no counter",
      async fn(chain: Chain, accounts: Map<string, Account>) {
        const wallet1 = accounts.get("wallet_1")!;

        const block = chain.mineBlock([
          Tx.contractCall("vote", "vote-no", [], wallet1.address),
          Tx.contractCall("vote", "get-no-votes", [], wallet1.address),
        ]);

        block.receipts[0].result.expectOk().expectUint(1);
        block.receipts[1].result.expectUint(1);
      },
    });
  });

  it("multiple votes accumulate correctly", () => {
    Clarinet.test({
      name: "multiple yes/no votes are counted",
      async fn(chain: Chain, accounts: Map<string, Account>) {
        const wallet1 = accounts.get("wallet_1")!;
        const wallet2 = accounts.get("wallet_2")!;

        const block = chain.mineBlock([
          Tx.contractCall("vote", "vote-yes", [], wallet1.address),
          Tx.contractCall("vote", "vote-yes", [], wallet2.address),
          Tx.contractCall("vote", "vote-no", [], wallet1.address),
        ]);

        block.receipts[0].result.expectOk().expectUint(1);
        block.receipts[1].result.expectOk().expectUint(2);
        block.receipts[2].result.expectOk().expectUint(1);

        const resultsBlock = chain.mineBlock([
          Tx.contractCall("vote", "get-yes-votes", [], wallet1.address),
          Tx.contractCall("vote", "get-no-votes", [], wallet1.address),
        ]);

        resultsBlock.receipts[0].result.expectUint(2);
        resultsBlock.receipts[1].result.expectUint(1);
      },
    });
  });
});


