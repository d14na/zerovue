/**
 * Toast (Modal)
 */
const toast = function (_title, _subtitle, _body = '', _success = false) {
    /* Return a promise (non-blocking). */
    return new Promise((resolve, reject) => {
        // console.log('TOAST', _title, _subtitle, _body, _success)

        if (_subtitle) _body = _subtitle + ' ' + _body
        Snotify.info(_body, _title, {
            backdrop: 0.7,
            pauseOnHover: false,
            titleMaxLength: 30
        })
        // Snotify.success(_body, _title)
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

        // NOTE Wait a lil' bit before displaying "intermittent" modal.
        setTimeout(() => {
            /* Resolve success. */
            resolve(_success)
        }, this.WAIT_DELAY)
    })
}

module.exports = toast
