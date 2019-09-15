/*******************************************************************************
 *
 * ZeroKit
 * -------
 *
 * UI Rendering Engine for Zeronet
 *
 */
class ZeroKit {
    constructor () {
        /* Initialize Gatekeeper's Ready flag. */
        this.gateReady = false

        /* Send an empty message to the zerovue to initialize. */
        this.authGatekeeper()
    }

    search (_val) {
        console.log('Start searching for', _val)
    }

    /**
     * Test Connection
     */
    testConnection () {
        console.log('HOST wants to test the connection from UI')

        // this.authGatekeeper()
    }

    /**
     * Send UI Message
     */
    uiMsg (message = {}) {
        console.log('SENDING MESSAGE TO UI', message)
        ZeroVue.UI.send('postMessage', message)
    }

    /**
     * Authorize Gatekeeper
     */
    async authGatekeeper () {
        /* Show "connecting.." notification. */
        await this._wait('Starting New Session', 'This will only take a moment.', 'Please wait..')

        /* Validate application initialization. */
        if (!this.gateReady) {
            setTimeout(() => {
                /* Send empty message to the zerovue for initialization. */
                this.uiMsg()
            }, 1000)
        }
    }

    /**
     * Modal Wait Handler
     */
    _wait (_title, _subtitle, _body = '', _success = false) {
        console.log('WAIT MODAL', _title, _subtitle, _body, _success)
        /* Clear open modals. */
        // _clearModals()

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

}

/**
 * ZeroKit Module
 *
 * This supports NodeJs and module implementations.
 *
 * NOTE: Used by the Browser (Parent) Window.
 */
exports.module = ZeroKit
