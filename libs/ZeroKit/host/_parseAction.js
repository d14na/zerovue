/**
 * Parse Action (from Request Manager)
 */
const parseAction = function (_data) {
    /* Initialize action. */
    let action = null

    /* Set request id. */
    const requestId = _data.requestId

    /* Validate request id. */
    if (requestId && this.requestMgr[requestId]) {
        /* Retrieve action. */
        action = this.requestMgr[requestId].action

        // TODO Completed requests should be CANCELLED by messaging the network.

        /* Remove request from manager. */
        // FIXME Verify that we do not need to persist this request
        //       other than to retrieve the ACTION
        // delete this.requestMgr[requestId]
    }

    /* Return the action. */
    return action
}

module.exports = parseAction
