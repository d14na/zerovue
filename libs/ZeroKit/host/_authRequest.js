/**
 * Authorization Request
 */
const authRequest = async function (_identity) {
    /* Set action. */
    const action = 'AUTH'

    /* Initialize network protocol. */
    const network = '0NET-TLR' // 0NET: TrustLess Republic

    /* Initialize nonce. */
    const nonce = moment().unix()

    /* Build proof (string). */
    const proof = `${network}:${_identity}:${nonce}`
    // console.log('Proof', proof)

    this.addLog(`Authentication Proof [ ${proof} ]`)

    /* Retrieve signed proof. */
    const sig = await this.signAuth(proof)

    /* Build package. */
    const pkg = { action, proof, sig }

    /* Send package. */
    this.sendMessage(pkg)
}

module.exports = authRequest
