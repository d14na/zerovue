/**
 * Sign Authorization (Package)
 *
 * A formatted proof is signed and sent to the Supeer host.
 *
 * NOTE: The epoch value MUST be within the time limit set by supeer host.
 *       Current default is [ 15 ] seconds.
 *
 * Proof Format
 * ------------
 *
 * [Network Id]:[Client Ip Address]:[Client Port Number]:[Epoch]
 *
 * Example: 0NET-TLR:108.162.241.65:47038:1555734000
 */
const signAuth = async function (_proof) {
    console.log('SIGNATURE PROOF', _proof)
    // TEMP FOR DEVELOPMENT/TESTING PURPOSES ONLY
    // 0x65C44EcAc56040a63da60bf5cA297951780eFEd1 (valid)
    const privateKey = '0x9b2495bf3d9f3116a4ec7301cc2d8cd8c9d86b4f09b813a8455d8db18d6eb00d'
    // console.log('PRIVATE KEY', privateKey)

    /* Initialize (Ethers) wallet. */
    const wallet = new ethers.Wallet(privateKey)

    /* Create the signature by signing the proof with wallet. */
    const signature = await wallet.signMessage(_proof)
    // console.log('SIGNATURE', signature)

    /* Return the signed proof. */
    return signature
}

module.exports = signAuth
