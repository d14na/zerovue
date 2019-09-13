/*******************************************************************************

  SockJS
  https://github.com/sockjs/sockjs-client

  We are using SockJS to manage all socket communications.

*******************************************************************************/


/**
 * Websocket Connect
 *
 * Open a new connection to the Zero Private Enterprise Network (Supeer).
 * via a websocket (or applicable fallback) connection.
 *
 * NOTE The closest (available) server can be reached by querying the DNS list:
 *      https://supeer.network
 */
const _connect = async function () {
    /* Verify that we are NOT already connected. */
    if (!conn || conn.readyState !== 1) {
        /* Show "connecting.." notification. */
        await _wait('Connecting to Supeer', 'This will only take a moment.', 'Please wait..')

        /* Create a new Socket JS connection . */
        conn = new SockJS(WS_ENDPOINT)

        /* Initialize event handlers. */
        conn.onopen = _connOpen
        conn.onmessage = _connMessage
        conn.onclose = _connClose
    }
}

/**
 * Send Supeer Message
 */
const _sendSupeerMessage = function (_msg) {
    if (conn && conn.readyState === 1) {
        /* Increment request id. */
        // NOTE An Id of (0) will return FALSE on validation
        requestId++

        /* Add new request id to message. */
        const msg = {
            requestId,
            ..._msg
        }

        /* Add new request to requests manager. */
        requestMgr[requestId] = msg

        /* Send serialized message. */
        conn.send(JSON.stringify(msg))

        return true
    } else {
        _addLog(`Attempting to reconnect..`)

        // FIXME Set a maximum attempts to avoid infinite loop.

        /* Attempt to re-connect. */
        _connect()

        /* Wait a few secs, then attempt to re-connect. */
        setTimeout(() => {
            // /* Attempt to re-connect. */
            // _connect()
            /* Attempt to re-send. */
            _sendSupeerMessage(_msg)
        }, 3000)
    }
}

/**
 * Websocket - Connection Opened
 */
const _connOpen = async function () {
    _addLog('Supeer connected successfully.')

    /* Update connection status (display). */
    App._setConnStatus('Supeer Connected', 'text-success')

    /* Set action. */
    const action = 'WHOAMI'

    /* Build package. */
    const pkg = { action }

    /* Send package. */
    _sendSupeerMessage(pkg)
}

/**
 * Websocket - Message Received
 */
const _connMessage = function (_event) {
    // console.info('Incoming Supeer message', _event.data)

    /* Handle incoming Supeer message. */
    _handleSupeerMessage(_event.data)
}

/**
 * Websocket - Connection Closed
 */
const _connClose = function () {
    console.info('Supeer connection closed.')

    /* Update connection status (display). */
    App._setConnStatus('Supeer Disconnected', 'text-danger')
}
