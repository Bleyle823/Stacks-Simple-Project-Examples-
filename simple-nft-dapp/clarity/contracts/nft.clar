;; A simple NFT contract.
;; Defines a non-fungible token with uint IDs, supports minting and transferring.

(define-non-fungible-token simple-nft uint)

;; Track the last minted token ID
(define-data-var last-token-id uint u0)

;; Read-only: get the last minted token ID
(define-read-only (get-last-token-id)
  (var-get last-token-id)
)

;; Public: mint the next token ID to a recipient
(define-public (mint-next (recipient principal))
  (let
    (
      (next-id (+ (var-get last-token-id) u1))
    )
    (begin
      (try! (nft-mint? simple-nft next-id recipient))
      (var-set last-token-id next-id)
      (ok next-id)
    )
  )
)

;; Public: transfer a token from the caller to a new owner
(define-public (transfer (token-id uint) (recipient principal))
  (nft-transfer? simple-nft token-id tx-sender recipient)
)


