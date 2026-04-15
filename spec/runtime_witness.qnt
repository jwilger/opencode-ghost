module runtime_witness {
  type Phase =
    | Idle
    | Busy
    | WaitingPermission

  type Permission =
    | Clear
    | Pending
    | Approved
    | Rejected

  var created: bool
  var phase: Phase
  var permission: Permission
  var events: int

  action init = all {
    created' = false,
    phase' = Idle,
    permission' = Clear,
    events' = 0,
  }

  action create_session = all {
    not(created),
    created' = true,
    phase' = phase,
    permission' = permission,
    events' = events + 1,
  }

  action start_run = all {
    created,
    phase == Idle,
    permission == Clear,
    created' = created,
    phase' = Busy,
    permission' = permission,
    events' = events + 1,
  }

  action request_permission = all {
    created,
    phase == Busy,
    permission == Clear,
    created' = created,
    phase' = WaitingPermission,
    permission' = Pending,
    events' = events + 1,
  }

  action approve_permission = all {
    created,
    phase == WaitingPermission,
    permission == Pending,
    created' = created,
    phase' = Idle,
    permission' = Approved,
    events' = events + 1,
  }

  action reject_permission = all {
    created,
    phase == WaitingPermission,
    permission == Pending,
    created' = created,
    phase' = Idle,
    permission' = Rejected,
    events' = events + 1,
  }

  action step = any {
    create_session,
    start_run,
    request_permission,
    approve_permission,
    reject_permission,
  }

  val pending_means_waiting =
    permission == Pending implies phase == WaitingPermission

  val waiting_means_pending =
    phase == WaitingPermission implies permission == Pending

  val approved_means_idle =
    permission == Approved implies phase == Idle

  val rejected_means_idle =
    permission == Rejected implies phase == Idle

  val inv = and {
    pending_means_waiting,
    waiting_means_pending,
    approved_means_idle,
    rejected_means_idle,
  }

  run permission_cycle = {
    init
      .then(create_session)
      .then(start_run)
      .then(request_permission)
      .then(all {
        assert(permission == Pending),
        assert(phase == WaitingPermission),
        approve_permission
      })
      .then(all {
        assert(permission == Approved),
        assert(phase == Idle),
        init
      })
  }

  run permission_reject_cycle = {
    init
      .then(create_session)
      .then(start_run)
      .then(request_permission)
      .then(all {
        assert(permission == Pending),
        assert(phase == WaitingPermission),
        reject_permission
      })
      .then(all {
        assert(permission == Rejected),
        assert(phase == Idle),
        init
      })
  }
}
