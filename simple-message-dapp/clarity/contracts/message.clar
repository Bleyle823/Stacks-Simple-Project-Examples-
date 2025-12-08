;; A simple message contract that stores a string on-chain
;; This is a basic example demonstrating Clarity smart contract functionality

;; Store a UTF-8 message, defaulting to "Hello, Stacks!"
(define-data-var message (string-utf8 256) "Hello, Stacks!")

;; Read-only function to get the current message
(define-read-only (get-message)
  (var-get message)
)

;; Public function to set/update the message
(define-public (set-message (new-message (string-utf8 256)))
  (begin
    (var-set message new-message)
    (ok (var-get message))
  )
)

;; Public function to clear the message (set to empty string)
(define-public (clear-message)
  (begin
    (var-set message "")
    (ok (var-get message))
  )
)


