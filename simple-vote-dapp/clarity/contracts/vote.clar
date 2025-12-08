;; A simple yes/no voting contract.
;; Stores two counters: yes-votes and no-votes.
;; This example does not prevent multiple votes per address – it's purely for learning the pattern.

(define-data-var yes-votes uint u0)
(define-data-var no-votes uint u0)

;; Read-only: get current yes vote count
(define-read-only (get-yes-votes)
  (var-get yes-votes)
)

;; Read-only: get current no vote count
(define-read-only (get-no-votes)
  (var-get no-votes)
)

;; Public: cast a yes vote (increments yes-votes)
(define-public (vote-yes)
  (begin
    (var-set yes-votes (+ (var-get yes-votes) u1))
    (ok (var-get yes-votes))
  )
)

;; Public: cast a no vote (increments no-votes)
(define-public (vote-no)
  (begin
    (var-set no-votes (+ (var-get no-votes) u1))
    (ok (var-get no-votes))
  )
)


