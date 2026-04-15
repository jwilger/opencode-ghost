inductive Phase where
  | idle
  | busy
  | waiting
  deriving DecidableEq, Repr

inductive Permission where
  | clear
  | pending
  | approved
  | rejected
  deriving DecidableEq, Repr

inductive Event where
  | create
  | start
  | ask
  | approve
  | reject
  deriving DecidableEq, Repr

structure State where
  created : Bool
  phase : Phase
  permission : Permission
  deriving DecidableEq, Repr

def init : State :=
  {
    created := false
    phase := .idle
    permission := .clear
  }

def apply (s : State) (e : Event) : State :=
  match e with
  | .create =>
      if s.created then s else { s with created := true }
  | .start =>
      if s.created && s.phase == .idle && s.permission == .clear then
        { s with phase := .busy }
      else
        s
  | .ask =>
      if s.phase == .busy && s.permission == .clear then
        { s with phase := .waiting, permission := .pending }
      else
        s
  | .approve =>
      if s.phase == .waiting && s.permission == .pending then
        { s with phase := .idle, permission := .approved }
      else
        s
  | .reject =>
      if s.phase == .waiting && s.permission == .pending then
        { s with phase := .idle, permission := .rejected }
      else
        s

def replay (xs : List Event) : State :=
  xs.foldl apply init

def coherent (s : State) : Prop :=
  (s.permission = .pending ↔ s.phase = .waiting) ∧
  (s.permission = .approved → s.phase = .idle) ∧
  (s.permission = .rejected → s.phase = .idle)

theorem coherent_init : coherent init := by
  simp [coherent, init]

theorem coherent_step (s : State) (e : Event) : coherent s → coherent (apply s e) := by
  intro h
  cases s with
  | mk created phase permission =>
      cases created <;> cases phase <;> cases permission <;> cases e <;> simp [apply, coherent] at h ⊢

theorem coherent_replay_from (xs : List Event) (s : State) : coherent s → coherent (xs.foldl apply s) := by
  intro h
  induction xs generalizing s with
  | nil =>
      simpa using h
  | cons x xs ih =>
      simp [List.foldl_cons]
      exact ih (apply s x) (coherent_step s x h)

theorem coherent_replay (xs : List Event) : coherent (replay xs) := by
  simpa [replay] using coherent_replay_from xs init coherent_init

theorem witness_replay_final :
    replay [.create, .start, .ask, .approve] =
      { created := true, phase := .idle, permission := .approved } := by
  simp [replay, apply, init]

theorem witness_replay_rejected :
    replay [.create, .start, .ask, .reject] =
      { created := true, phase := .idle, permission := .rejected } := by
  simp [replay, apply, init]

theorem witness_pending_waiting :
    replay [.create, .start, .ask] =
      { created := true, phase := .waiting, permission := .pending } := by
  simp [replay, apply, init]
