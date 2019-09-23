/**
 * Send Message
 */
const send = function (_msg) {
    // console.log('READYSTATE', this.conn.socket.readyState);
    // console.log('MSG', _msg);

    /* Validate socket connection. */
    if (this.conn.socket && this.conn.socket.readyState === 1) {
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
        this.conn.socket.send(JSON.stringify(msg))
    } else {
        this.addLog(`Attempting to reconnect..`)

        // FIXME Set a maximum attempts to avoid infinite loop.

        /* Attempt to re-connect. */
        this.conn.connect()

        /* Wait a few secs, then attempt to re-connect. */
        setTimeout(() => {
            // /* Attempt to re-connect. */
            // this.conn.connect()
            /* Attempt to re-send. */
            this.message.send(_msg)
        }, 3000)
    }
}

module.exports = {
    send
}
