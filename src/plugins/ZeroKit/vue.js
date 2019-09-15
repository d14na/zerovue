console.log('ZEROGUEST IS IN THE HOUSE!')

/*******************************************************************************
 *
 * ZeroKit (Guest)
 * -------
 *
 * UI Rendering Engine for Zeronet
 *
 */
class ZeroKit {
    constructor () {
        this.hi = 'there'
    }

    /**
     * Test PostMessage
     */
    testPostMessage () {
        console.log('Let\'s test POSTMESSAGE from SANDBOX')

        window.postMessage('this is our FIRST postMessage!!')
        // testPostMessage
    }

    initSandbox () {
        console.log('FINALLY, WE CAN INIT THE SANDBOX!')

        window.postMessage('CAN ANYONE HEAR ME?!? I NEED HELP!!')
        // ipcRenderer.on('postMessage', (event, ...args) => {
        //     console.log('HEY, WE JUST SAW A POSTMESSAGE')
        //     // We received an event on the postMessage channel from
        //     // the main process. Do a window.postMessage to forward it
        //     // window.postMessage([], '*')
        // })
    }

}

window.postMessage('CAN ANYONE HEAR ME?!? I REALLY, REALLY NEED HELP!!')

/**
 * ZeroKit Global
 *
 * This supports pure JS implementations.
 *
 * NOTE: Used by the webview/iframe.
 */
window.zeroKit = new ZeroKit()
