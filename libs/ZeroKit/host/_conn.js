/**
 * Websocket Connect
 *
 * Open a new connection to Supeer via a websocket
 * (or applicable fallback) connection.
 *
 * NOTE: The closest (available) server can be reached by querying the DNS list:
 *       https://supeer.network
 */
const connect = async function (_endpoint) {
    /* Show "connecting.." notification. */
    await this.toast('Connecting to Supeer.Host', 'This will only take a moment.', 'Please wait..')

    /* Create a new Socket JS connection . */
    this.conn = new SockJS(_endpoint)

    /* Initialize event handlers. */
    this.conn.onopen = _connOpen.bind(this)
    this.conn.onmessage = _connMessage.bind(this)
    this.conn.onclose = _connClose.bind(this)
}

/**
 * Websocket - Connection Opened
 */
const _connOpen = async function () {
    this.addLog('Supeer connected successfully.')

    /* Update connection status (display). */
    // App._setConnStatus('Supeer Connected', 'text-success')

    /* Set action. */
    const action = 'WHOAMI'

    /* Build package. */
    const pkg = { action }

    /* Send package. */
    this.sendMessage(pkg)
}

/**
 * Websocket - Message Received
 */
const _connMessage = function (_event) {
    // console.info('Incoming Supeer message', _event.data)

    /* Handle incoming (Supeer) message. */
    this.handleMessage(_event.data)
}

/**
 * Websocket - Connection Closed
 */
const _connClose = function () {
    console.info('Supeer connection closed.')

    /* Update connection status (display). */
    // App._setConnStatus('Supeer Disconnected', 'text-danger')
}

module.exports = connect
