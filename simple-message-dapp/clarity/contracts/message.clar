;; A simple message contract that stores a string on-chain
;; This is a basic example demonstrating Clarity smart contract functionality

;; Store a UTF-8 message, defaulting to "Hello, Stacks!"
(define-data-var message (string-utf8 256) "Hello, Stacks!")

;; Store the block timestamp of the last update (requires Clarity 4: `stacks-block-time`)
(define-data-var last-updated uint u0)

;; Read-only function to get the current message
(define-read-only (get-message)
  (var-get message)
)

;; Read-only function to get the timestamp of the last update
(define-read-only (get-last-updated)
  (var-get last-updated)
)

;; Public function to set/update the message
(define-public (set-message (new-message (string-utf8 256)))
  (begin
    (var-set message new-message)
    (var-set last-updated stacks-block-time)
    (ok (var-get message))
  )
)

;; Public function to clear the message (set to empty string)
(define-public (clear-message)
  (begin
    (var-set message "")
    (var-set last-updated stacks-block-time)
    (ok (var-get message))
  )
)


