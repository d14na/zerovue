/**
 * Signs a (data) proof provided by the server for account authentication.
 */
const signAuth = async function (_proof) {
    console.log('SIGNATURE PROOF', _proof)
    /* Initialize a new web3 object to our provider. */
    // const web3 = new Web3()

    // TEMP FOR DEVELOPMENT/TESTING PURPOSES ONLY
    // const privateKey = '0x9b2495bf3d9f3116a4ec7301cc2d8cd8c9d86b4f09b813a8455d8db18d6eb00' // 0xF51175cF846f88b9419228905d63dcDd43aeC9E8 (invalid)
    // const privateKey = '9b2495bf3d9f3116a4ec7301cc2d8cd8c9d86b4f09b813a8455d8db18d6eb00d' // 0xC3e7b7f10686263f13fF2fA2313Dc00c2592481d (invalid)
    const privateKey = '0x9b2495bf3d9f3116a4ec7301cc2d8cd8c9d86b4f09b813a8455d8db18d6eb00d' // 0x65C44EcAc56040a63da60bf5cA297951780eFEd1 (valid)
    // console.log('PRIVATE KEY', privateKey)

    // let privateKey = "0x3141592653589793238462643383279502884197169399375105820974944592"
    let wallet = new ethers.Wallet(privateKey)

    /* Create the signature by signing the proof with private key. */
    const signature = await wallet.signMessage(_proof)
    console.log('SIGNATURE', signature)
    // const signature = web3.eth.accounts.sign(_proof, privateKey)

    /* Return the signed proof. */
    return signature
}

module.exports = signAuth
