console.info('ZeroKit UI is initializing..')

const { ipcRenderer } = require('electron')

/**
 * Override PostMessage
 *
 * This is how we communicate back to the Main BrowserWindow process.
 * `ZeroFrame.js` will call this function using ZeroNet Core.
 */
window.postMessage = function (_message) {
    console.log(`UI POSTMESSAGE: [ ${_message} ]`)
}

/* Handle PING from host. */
ipcRenderer.on('ping', () => {
    console.log('Received a PING')

    /* Send pong to host. */
    ipcRenderer.sendToHost('pong')
})

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

        const pkg = {
            action: 'postMessage',
            message: 'this is our FIRST postMessage!!'
        }

        /* Send pong to host. */
        ipcRenderer.sendToHost(JSON.stringify(pkg))
    }

}

// window.postMessage('CAN ANYONE HEAR ME?!? I REALLY, REALLY NEED HELP!!')

/**
 * ZeroKit Global
 *
 * This supports pure JS implementations.
 *
 * NOTE: Used by the webview/iframe.
 */
window.zeroKit = new ZeroKit()
