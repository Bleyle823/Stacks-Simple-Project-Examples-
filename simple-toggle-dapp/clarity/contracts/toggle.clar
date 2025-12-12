;; A simple toggle contract that stores a boolean flag on-chain
;; Anyone can set the flag to true/false or toggle it.

;; Store an on-chain boolean flag, defaulting to false
(define-data-var flag bool false)

;; Read-only function to get the current flag value
(define-read-only (get-flag)
  (var-get flag)
)

;; Public function to set the flag to true
(define-public (set-true)
  (begin
    (var-set flag true)
    (ok (var-get flag))
  )
)

;; Public function to set the flag to false
(define-public (set-false)
  (begin
    (var-set flag false)
    (ok (var-get flag))
  )
)

;; Public function to toggle the flag
(define-public (toggle-flag)
  (begin
    (var-set flag (not (var-get flag)))
    (ok (var-get flag))
  )
)


