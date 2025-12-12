import {
  Clarinet,
  Tx,
  Chain,
  Account,
} from "vitest-environment-clarinet";
import { describe, it, expect } from "vitest";

describe("simple-nft", () => {
  it("initial last-token-id should be 0", () => {
    Clarinet.test({
      name: "get-last-token-id returns 0 by default",
      async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get("deployer")!;

        const block = chain.mineBlock([
          Tx.contractCall("nft", "get-last-token-id", [], deployer.address),
        ]);

        const [result] = block.receipts;
        result.result.expectUint(0);
      },
    });
  });

  it("mint-next mints sequential token IDs", () => {
    Clarinet.test({
      name: "mint-next increments last-token-id",
      async fn(chain: Chain, accounts: Map<string, Account>) {
        const wallet1 = accounts.get("wallet_1")!;

        let block = chain.mineBlock([
          Tx.contractCall("nft", "mint-next", [`'${wallet1.address}`], wallet1.address),
        ]);
        block.receipts[0].result.expectOk().expectUint(1);

        block = chain.mineBlock([
          Tx.contractCall("nft", "get-last-token-id", [], wallet1.address),
        ]);
        block.receipts[0].result.expectUint(1);

        block = chain.mineBlock([
          Tx.contractCall("nft", "mint-next", [`'${wallet1.address}`], wallet1.address),
        ]);
        block.receipts[0].result.expectOk().expectUint(2);

        block = chain.mineBlock([
          Tx.contractCall("nft", "get-last-token-id", [], wallet1.address),
        ]);
        block.receipts[0].result.expectUint(2);
      },
    });
  });

  it("transfer moves ownership", () => {
    Clarinet.test({
      name: "transfer changes token owner",
      async fn(chain: Chain, accounts: Map<string, Account>) {
        const wallet1 = accounts.get("wallet_1")!;
        const wallet2 = accounts.get("wallet_2")!;

        // Mint token 1 to wallet1
        let block = chain.mineBlock([
          Tx.contractCall("nft", "mint-next", [`'${wallet1.address}`], wallet1.address),
        ]);
        block.receipts[0].result.expectOk().expectUint(1);

        // Transfer token 1 from wallet1 to wallet2
        block = chain.mineBlock([
          Tx.contractCall("nft", "transfer", ["u1", `'${wallet2.address}`], wallet1.address),
        ]);
        block.receipts[0].result.expectOk().expectBool(true);
      },
    });
  });
});


