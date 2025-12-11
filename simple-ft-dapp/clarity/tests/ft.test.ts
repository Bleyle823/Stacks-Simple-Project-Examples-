import {
  Clarinet,
  Tx,
  Chain,
  Account,
} from "vitest-environment-clarinet";
import { describe, it, expect } from "vitest";

describe("simple-ft", () => {
  it("initial balance should be 0", () => {
    Clarinet.test({
      name: "get-balance returns 0 by default",
      async fn(chain: Chain, accounts: Map<string, Account>) {
        const wallet1 = accounts.get("wallet_1")!;

        const block = chain.mineBlock([
          Tx.contractCall("ft", "get-balance", [`'${wallet1.address}`], wallet1.address),
        ]);

        const [result] = block.receipts;
        result.result.expectUint(0);
      },
    });
  });

  it("mint increases recipient balance", () => {
    Clarinet.test({
      name: "mint adds to balance",
      async fn(chain: Chain, accounts: Map<string, Account>) {
        const wallet1 = accounts.get("wallet_1")!;

        let block = chain.mineBlock([
          Tx.contractCall("ft", "mint", [`'${wallet1.address}`, "u100"], wallet1.address),
        ]);
        block.receipts[0].result.expectOk().expectBool(true);

        block = chain.mineBlock([
          Tx.contractCall("ft", "get-balance", [`'${wallet1.address}`], wallet1.address),
        ]);
        block.receipts[0].result.expectUint(100);
      },
    });
  });

  it("transfer moves tokens between accounts", () => {
    Clarinet.test({
      name: "transfer updates balances",
      async fn(chain: Chain, accounts: Map<string, Account>) {
        const wallet1 = accounts.get("wallet_1")!;
        const wallet2 = accounts.get("wallet_2")!;

        let block = chain.mineBlock([
          Tx.contractCall("ft", "mint", [`'${wallet1.address}`, "u200"], wallet1.address),
        ]);
        block.receipts[0].result.expectOk().expectBool(true);

        block = chain.mineBlock([
          Tx.contractCall("ft", "transfer", ["u50", `'${wallet2.address}`], wallet1.address),
        ]);
        block.receipts[0].result.expectOk().expectBool(true);

        const balancesBlock = chain.mineBlock([
          Tx.contractCall("ft", "get-balance", [`'${wallet1.address}`], wallet1.address),
          Tx.contractCall("ft", "get-balance", [`'${wallet2.address}`], wallet1.address),
        ]);

        balancesBlock.receipts[0].result.expectUint(150);
        balancesBlock.receipts[1].result.expectUint(50);
      },
    });
  });
});


