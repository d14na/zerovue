/**
 * Modal Wait Handler
 */
const wait = function (_title, _subtitle, _body = '', _success = false) {
    console.log('TODO: WAIT MODAL', _title, _subtitle, _body, _success)
    /* Clear open modals. */
    // this.clearModals()

    /* Show WAIT permission modal. */
    // $('#modalWait').modal({
    //     backdrop: true,
    //     keyboard: true
    // })

    /* Set modal details. */
    // $('.modalWaitTitle').html(_title)
    // $('.modalWaitSubtitle').html(_subtitle)
    // $('.modalWaitBody').html(_body)

    // return new Promise((_resolve, _reject) => {
    //     // NOTE Wait a lil' bit before displaying "intermittent" modal.
    //     setTimeout(() => {
    //         /* Resolve success. */
    //         _resolve(_success)
    //     }, 500)
    // })
}

module.exports = wait
