/**
 * Handle (Supeer) Message
 */
const handleMessage = async function (_data) {
    /* Initialize handler. */
    let handler = null

    try {
        /* Parse incoming message. */
        let data = JSON.parse(_data)

        console.log('Received Supeer data:', data)

        /* Validate message. */
        if (!data) {
            return this.addLog(`Error processing [ ${JSON.stringify(data)} ]`)
        }

        /* Validate response. */
        if (data.error) {
            /* Show alert. */
            return this.toast(
                'Supeer Network Error',
                data.error,
                'Please try your request again..',
                false
            )
        }

        /* Initialize action. */
        let action = null

        /* Retrieve the action from requests manager. */
        if (data.search) {
            action = 'SEARCH'
        } else if (data.action) {
            /* Set action. */
            action = data.action
        } else {
            /* Retrieve action from saved request. */
            action = this.parseAction(data)
        }

        console.log(`Retrieved ACTION [ ${action} ] from message.`)

        /* Validate action. */
        if (!action) {
            return this.errors(`No ACTION was found for [ ${JSON.stringify(data)} ]`, false)
        }

        /* Initialize (data) managers. */
        let body = null
        let dest = null
        let pkg = null

        switch (action.toUpperCase()) {
        case 'AUTH':
            /* Initialize handler. */
            handler = require('./_auth.js')

            /* Bind context to handler. */
            handler = handler.bind(this)

            /* Handle response. */
            return handler(data)
        case 'GET':
            if (data.dest && data.innerPath) { // Zeronet
                /* Retrieve destination. */
                dest = data.dest

                /* Validate dest. */
                if (!dest || dest.slice(0, 1) !== '1' || (dest.length !== 33 && dest.length !== 34)) {
                    return this.addLog(`${dest} is an invalid public key.`)
                }

                /* Verify config file. */
                if (data.innerPath === 'content.json') {
                    return _handleConfig(data)
                } else {
                    return _handleZeroFile(data)
                }
            } else if (data.infoHash && data.metadata) { // Torrent
                /* Verify info file. */
                if (data.dataId.split(':')[1] === 'torrent') {
                    return _handleInfo(data)
                }
            } else if (data.dataId && data.requestMgr) { // Torrent
                // TODO Handle an "immediate" response to our request.
                //      Already in 0NET cache and no need to wait for seeders.
                console.log('BLOCK REQUEST MANAGER', data.requestMgr)
            } else if (data.dataId && data.blockBuffer) { // Torrent
                /* Handle response. */
                return _handleBlock(data)
            } else {
                return this.addLog(`ERROR processing GET request for [ ${JSON.stringify(data)} ]`)
            }

            break
        case 'SEARCH':
            /* Handle response. */
            return _handleSearch(data)
        case 'WHOAMI':
            /* Initialize handler. */
            handler = require('./_whoAmI.js')

            /* Bind context to handler. */
            handler = handler.bind(this)

            /* Handle response. */
            return handler(data)
        default:
            // nothing to do here
        }
    } catch (_err) {
        this.errors(_err, false)
    }
}

module.exports = handleMessage
