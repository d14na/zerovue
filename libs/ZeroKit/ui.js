console.info('ZeroKit UI is initializing..')

const { ipcRenderer } = require('electron')

/**
 * Overloading the Post Message (Global Method)
 *
 * This is how the `ZeroFrame.js` API communicates with the UIServer;
 * as defined by the ZeroNet Core reference implementation.
 */
window.postMessage = function (_postMessage) {
    // console.log(`UI postMessage Overload: [ ${_postMessage} ]`)

    /* Relay `postMessage` to host. */
    ipcRenderer.sendToHost(_postMessage)
}

/* Handle PING from host. */
// FIXME Do we need this for anything??
ipcRenderer.on('ping', () => {
    console.log('Received a PING')

    /* Send pong to host. */
    ipcRenderer.sendToHost('pong')
})

/* Handle incoming HOST Post Message. */
ipcRenderer.on('message', (event, message) => {
    console.log(`ipcRenderer: Incoming Post Message [ ${JSON.stringify(message)} ]`)

    // TODO Handle incoming message
    // console.log(message);

    let body = null
    let append = false
    let prepend = false

    try {
        message = JSON.parse(message)

        body = message.body

        const append = message.append
        console.log(apend)
        const prepend = message.prepend
        console.log(prepend)
    } catch (e) {
        // FIXME How should we handle parsing errors??
        // console.error(e)
    }

    // console.log('BODY')
    // console.log(body)
    if (body) {
        console.log('BODY')
        console.log(body)

        let action = 'updateWebSource'

        let pkg = { action, body }

        /* Send pong to host. */
        ipcRenderer.sendToHost(JSON.stringify(pkg))
    }
})

/*******************************************************************************
 *
 * ZeroKit (Guest)
 * ---------------
 *
 * UI Rendering Engine for Zeronet
 *
 */
class ZeroKit {
    constructor () {
        // this.hi = 'there'
    }

    /**
     * Test PostMessage
     */
    testPostMessage () {
        // console.log('Let\'s test POSTMESSAGE from SANDBOX')

        const pkg = {
            action: 'postMessage',
            message: 'this is our FIRST postMessage!!'
        }

        postMessage(JSON.stringify(pkg))
    }

    testConnection () {
        /* Set action. */
        const action = 'testConnection'

        /* Build package. */
        const pkg = { action }

        /* Send message to host. */
        ipcRenderer.sendToHost(JSON.stringify(pkg))
    }

    /**
     * DOM Handler
     */
    domReady () {
        console.info('ZeroKit DOM is ready!')
    }

}

/**
 * ZeroKit Global (aliased as `_0`)
 *
 * This supports pure JS implementations.
 *
 * NOTE: Used by the webview/iframe.
 */
window._0 = new ZeroKit()
