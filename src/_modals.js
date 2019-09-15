/**
 * Clear ALL (Escapable) Modals
 */
const _clearModals = function () {
    $('#modalAlert').modal('hide')
    $('#modalDebug').modal('hide')
    $('#modalWait').modal('hide')
}

/**
 * Modal Alert Handler
 */
const _alert = function (_title, _subtitle, _body, _success) {
    /* Clear open modals. */
    _clearModals()

    /* Show ALERT permission modal. */
    $('#modalAlert').modal({
        backdrop: true,
        keyboard: true
    })

    /* Set modal details. */
    $('.modalAlertTitle').html(_title)
    $('.modalAlertSubtitle').html(_subtitle)
    $('.modalAlertBody').html(_body)

    /* Return success. */
    return _success
}
