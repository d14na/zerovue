/**
 * Modal Alert Handler
 */
const alert = function (_title, _subtitle, _body, _success) {
    /* Clear open modals. */
    this.clearModals()

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
module.exports = alert
