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
        this.hi = 'there'

        /* Initialize Gatekeeper's Ready flag. */
        this.gateReady = false

        /* Send an empty message to the zerovue to initialize. */
        this.authGatekeeper()

        // setTimeout(() => {
        //     document.getElementById('testArea').innerHTML = document.getElementById('testArea').innerHTML + '<br />hi, i waited 3 seconds, now am here to preload'
        // }, 3000)
    }

    classTest (_val) {
        console.log('starting CLASS test..', _val)
        alert('starting CLASS test.. ' + _val)
        // document.getElementById('testArea').innerHTML = document.getElementById('testArea').innerHTML + '<br />starting a brand new CLASS now!'
    }

    /**
     * Test Connection
     */
    testConnection () {
        console.log('Let\'s test the connection from SANDBOX')

        this.authGatekeeper()
    }

    /**
     * Send Gateway Message
     *
     * WARNING We're sending the message to "*", rather than some specific
     * origin. Sandboxed iframes which lack the 'allow-same-origin' header
     * don't have an origin which we can target.
     * (this might allow some "zero-day-style" esoteric attacks)
     */
    zerovueMsg (_message = {}) {
        contentWindow.postMessage(_message, '*')
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
                this.zerovueMsg()
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


// console.log('ZeroKit', ZeroKit)

// zeroKit.classTest()
// console.log('zeroKit', zeroKit)

// window.alertTest = function (_val) {
//     alert(_val)
//     // document.getElementById('testArea').innerHTML = document.getElementById('testArea').innerHTML + '<br />' + _val
// }

// setTimeout(() => {
//     document.getElementById('testArea').innerHTML = document.getElementById('testArea').innerHTML + '<br />hi, i waited 3 seconds, now am here to preload'
// }, 3000)

// window.addEventListener('DOMContentLoaded', () => {
//     setTimeout(() => {
//         document.getElementById('testArea').innerHTML = document.getElementById('testArea').innerHTML + '<br />hi, i waited 3 seconds, now am here to preload'
//     }, 3000)
//
//     window.startTest = () => {
//         console.log('starting test..')
//         alert('starting test..')
//         document.getElementById('testArea').innerHTML = document.getElementById('testArea').innerHTML + '<br />hi, you started it, so i am here to preload'
//     }
//
//     window.finalTest = (_val) => {
//         document.getElementById('testArea').innerHTML = document.getElementById('testArea').innerHTML + '<br />' + _val
//     }
//
// })

/**
 * ZeroKit Module
 *
 * This supports NodeJs and module implementations.
 *
 * NOTE: Used by the Browser (Parent) Window.
 */
exports.module = ZeroKit
