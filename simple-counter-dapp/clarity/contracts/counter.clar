;; A simple counter contract that allows anyone to increment or decrement a counter
;; This is a basic example demonstrating Clarity smart contract functionality

;; Define a data variable to store the counter value
(define-data-var counter uint u0)

;; Read-only function to get the current counter value
(define-read-only (get-counter)
  (var-get counter)
)

;; Public function to increment the counter by 1
(define-public (increment)
  (begin
    (var-set counter (+ (var-get counter) u1))
    (ok (var-get counter))
  )
)

;; Public function to decrement the counter by 1
(define-public (decrement)
  (begin
    (var-set counter (- (var-get counter) u1))
    (ok (var-get counter))
  )
)

;; Public function to reset the counter to 0
(define-public (reset)
  (begin
    (var-set counter u0)
    (ok u0)
  )
)

