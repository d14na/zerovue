/**
 * Who Am I
 */
const whoAmI = function (_data) {
    /* Retrieve the identity. */
    const identity = _data.identity

    /* Retrieve the ip address. */
    const ip = _data.ip

    /* Retrieve the port number. */
    const port = _data.port

    /* Retrieve the city. */
    const city = _data.city

    /* Retrieve the country. */
    const country = _data.country

    /* Set address. */
    const address = `${ip}:${port}`

    /* Authorize connection. */
    this.authRequest(address)

    /* Initialize verification. */
    let verification = null

    if (identity === ZeroUtils.calcIdentity(address)) {
    // if (identity === this.calcIdentity(address)) {
        verification = 'VERIFIED'

        /* Set network identity. */
        const networkIdentity = `${ip} &bullet; ${city}, ${country}`

        /* Set identity (display). */
        // App._setIdentity(networkIdentity)
    } else {
        return this.alert('Peer Id verificatino FAILED!')
    }

    /* Clear modals. */
    // this.clearModals()
}

module.exports = whoAmI
