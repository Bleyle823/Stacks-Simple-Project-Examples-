;; A simple message-board contract that stores a single on-chain message
;; Only the contract deployer (owner) can update the message

;; Store the contract owner (set to tx-sender on first use)
(define-data-var owner (optional principal) none)

;; Store the message as an ASCII string (max 256 chars)
(define-data-var message (string-ascii 256) "Hello from Clarity!")

;; Internal helper to ensure the owner is initialized and enforce owner-only access
(define-private (ensure-owner)
  (let (
        (current-owner (var-get owner))
       )
    (if (is-none current-owner)
        ;; First call initializes the owner as the current sender
        (begin
          (var-set owner (some tx-sender))
          (ok tx-sender)
        )
        ;; Subsequent calls must come from the existing owner
        (if (is-eq (unwrap-panic current-owner) tx-sender)
            (ok tx-sender)
            (err u100) ;; not-authorized
        )
    )
  )
)

;; Read-only: get the current message
(define-read-only (get-message)
  (var-get message)
)

;; Read-only: get the current owner (if any)
(define-read-only (get-owner)
  (var-get owner)
)

;; Public: set a new message (owner-only)
(define-public (set-message (new-message (string-ascii 256)))
  (match (ensure-owner)
    owner-ok
      (begin
        (var-set message new-message)
        (ok (var-get message))
      )
    owner-err owner-err
  )
)


