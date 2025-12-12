import {
  Clarinet,
  Tx,
  Chain,
  Account,
} from "vitest-environment-clarinet";
import { describe, it, expect } from "vitest";

describe("simple-defi", () => {
  it("initial total liquidity should be 0", () => {
    Clarinet.test({
      name: "get-total-liquidity returns 0 by default",
      async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get("deployer")!;

        const block = chain.mineBlock([
          Tx.contractCall("defi", "get-total-liquidity", [], deployer.address),
        ]);

        const [result] = block.receipts;
        result.result.expectUint(0);
      },
    });
  });

  it("deposit increases user balance and total-liquidity", () => {
    Clarinet.test({
      name: "deposit updates balance and total",
      async fn(chain: Chain, accounts: Map<string, Account>) {
        const wallet1 = accounts.get("wallet_1")!;

        // deposit 100
        let block = chain.mineBlock([
          Tx.contractCall(
            "defi",
            "deposit",
            ["u100"],
            wallet1.address,
          ),
        ]);
        block.receipts[0].result.expectOk().expectUint(100);

        // total-liquidity should now be 100
        block = chain.mineBlock([
          Tx.contractCall("defi", "get-total-liquidity", [], wallet1.address),
        ]);
        block.receipts[0].result.expectUint(100);
      },
    });
  });

  it("withdraw decreases user balance and total-liquidity", () => {
    Clarinet.test({
      name: "withdraw updates balance and total",
      async fn(chain: Chain, accounts: Map<string, Account>) {
        const wallet1 = accounts.get("wallet_1")!;

        // deposit 200 then withdraw 50
        let block = chain.mineBlock([
          Tx.contractCall("defi", "deposit", ["u200"], wallet1.address),
          Tx.contractCall("defi", "withdraw", ["u50"], wallet1.address),
        ]);
        block.receipts[0].result.expectOk().expectUint(200);
        block.receipts[1].result.expectOk().expectUint(150);

        // total-liquidity should now be 150
        block = chain.mineBlock([
          Tx.contractCall("defi", "get-total-liquidity", [], wallet1.address),
        ]);
        block.receipts[0].result.expectUint(150);
      },
    });
  });

  it("cannot withdraw more than balance", () => {
    Clarinet.test({
      name: "withdraw fails when amount exceeds balance",
      async fn(chain: Chain, accounts: Map<string, Account>) {
        const wallet1 = accounts.get("wallet_1")!;

        // deposit 50 then try to withdraw 100
        const block = chain.mineBlock([
          Tx.contractCall("defi", "deposit", ["u50"], wallet1.address),
          Tx.contractCall("defi", "withdraw", ["u100"], wallet1.address),
        ]);
        block.receipts[0].result.expectOk().expectUint(50);
        block.receipts[1].result.expectErr().expectUint(100);
      },
    });
  });
});


