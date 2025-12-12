;; A simple fungible token contract.
;; Defines a fungible token with a basic faucet-style mint and transfer.

(define-fungible-token simple-ft)

;; Read-only: get the balance for a principal
(define-read-only (get-balance (owner principal))
  (ft-get-balance simple-ft owner)
)

;; Public: mint tokens to a recipient
;; NOTE: This is an open faucet-style mint for learning purposes.
(define-public (mint (recipient principal) (amount uint))
  (ft-mint? simple-ft amount recipient)
)

;; Public: transfer tokens from the caller to a recipient
(define-public (transfer (amount uint) (recipient principal))
  (ft-transfer? simple-ft amount tx-sender recipient)
)


