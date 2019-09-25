/**
 * Request Handler
 */
const handler = async function (_data) {
    /* Show "connecting.." notification. */
    await this.wait('Starting New Session', 'This will only take a moment.', 'Please wait..')

    /* Validate application initialization. */
    if (!this.gateReady) {
        setTimeout(() => {
            /* Send empty message to the zerovue for initialization. */
            this.uiMsg()
        }, 1000)
    }
}

module.exports = handler
