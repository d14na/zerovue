/**
 * Send Message
 */
const sendMessage = function (_msg) {
    /* Validate socket connection. */
    if (this.conn && this.conn.readyState === 1) {
        /* Increment request id. */
        // NOTE An Id of (0) will return FALSE on validation
        this.requestId++

        /* Add new request id to message. */
        const msg = {
            requestId: this.requestId,
            ..._msg
        }

        /* Add new request to requests manager. */
        this.requestMgr[this.requestId] = msg

        /* Send serialized message. */
        this.conn.send(JSON.stringify(msg))
    } else {
        this.addLog(`Oops! We lost our connection. Attempting to reconnect..`)

        // FIXME Set a maximum attempts to avoid infinite loop.

        /* Attempt to re-connect. */
        this.connect()
        // this.conn.connect()

        /* Wait a few secs, then attempt to re-connect. */
        setTimeout(() => {
            /* Attempt to re-send (make recursive call). */
            sendMessage(_msg)
            // this.sendMessage(_msg)
        }, this.RECONNECT_DELAY)
    }
}

module.exports = sendMessage
