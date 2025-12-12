;; A simple owner contract that stores a single owner principal on-chain.
;; Only the current owner can transfer ownership to a new principal.

;; Default owner is a fixed principal (can be updated to your own address when deploying).
(define-data-var owner principal 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM)

;; Read-only function to get the current owner principal
(define-read-only (get-owner)
  (var-get owner)
)

;; Public function to transfer ownership to a new principal
;; Fails with (err u100) if tx-sender is not the current owner
(define-public (transfer-ownership (new-owner principal))
  (begin
    (asserts! (is-eq tx-sender (var-get owner)) (err u100))
    (var-set owner new-owner)
    (ok (var-get owner))
  )
)


