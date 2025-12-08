;; A simple DeFi-style savings vault.
;; Tracks per-user balances and total liquidity inside the contract.
;; NOTE: This is for learning only and does not move real STX.

;; Total liquidity stored in the vault (sum of all user balances)
(define-data-var total-liquidity uint u0)

;; Map from user principal -> balance
(define-map balances
  { user: principal }
  { amount: uint }
)

;; Helper to read a user's current balance
(define-read-only (get-user-balance (user principal))
  (default-to
    u0
    (get amount (map-get? balances { user: user }))
  )
)

;; Read-only function to get the total vault liquidity
(define-read-only (get-total-liquidity)
  (var-get total-liquidity)
)

;; Public function to deposit into the vault.
;; Increases the caller's balance and total-liquidity by `amount`.
(define-public (deposit (amount uint))
  (let
    (
      (current (get-user-balance tx-sender))
      (new-balance (+ current amount))
      (new-total (+ (var-get total-liquidity) amount))
    )
    (begin
      (map-set balances { user: tx-sender } { amount: new-balance })
      (var-set total-liquidity new-total)
      (ok new-balance)
    )
  )
)

;; Public function to withdraw from the vault.
;; Fails with (err u100) if the caller tries to withdraw more than their balance.
(define-public (withdraw (amount uint))
  (let
    (
      (current (get-user-balance tx-sender))
    )
    (if (>= current amount)
      (let
        (
          (new-balance (- current amount))
          (new-total (- (var-get total-liquidity) amount))
        )
        (begin
          (map-set balances { user: tx-sender } { amount: new-balance })
          (var-set total-liquidity new-total)
          (ok new-balance)
        )
      )
      (err u100)
    )
  )
)


