import {
  Clarinet,
  Tx,
  Chain,
  Account,
} from "vitest-environment-clarinet";
import { describe, it, expect } from "vitest";

describe("simple-owner", () => {
  it("initial owner should be the configured principal", () => {
    Clarinet.test({
      name: "get-owner returns default owner",
      async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get("deployer")!;

        const block = chain.mineBlock([
          Tx.contractCall("owner", "get-owner", [], deployer.address),
        ]);

        const [result] = block.receipts;
        result.result.expectPrincipal(
          "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
        );
      },
    });
  });

  it("owner can transfer ownership", () => {
    Clarinet.test({
      name: "transfer-ownership succeeds for current owner",
      async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get("deployer")!;
        const wallet1 = accounts.get("wallet_1")!;

        let block = chain.mineBlock([
          Tx.contractCall(
            "owner",
            "transfer-ownership",
            [`'${wallet1.address}`],
            "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
          ),
        ]);
        block.receipts[0].result.expectOk().expectPrincipal(wallet1.address);

        block = chain.mineBlock([
          Tx.contractCall("owner", "get-owner", [], deployer.address),
        ]);
        block.receipts[0].result.expectPrincipal(wallet1.address);
      },
    });
  });

  it("non-owner cannot transfer ownership", () => {
    Clarinet.test({
      name: "transfer-ownership fails for non-owner",
      async fn(chain: Chain, accounts: Map<string, Account>) {
        const wallet1 = accounts.get("wallet_1")!;
        const wallet2 = accounts.get("wallet_2")!;

        const block = chain.mineBlock([
          Tx.contractCall(
            "owner",
            "transfer-ownership",
            [`'${wallet2.address}`],
            wallet1.address,
          ),
        ]);

        // Should fail with (err u100)
        block.receipts[0].result.expectErr().expectUint(100);
      },
    });
  });
});


