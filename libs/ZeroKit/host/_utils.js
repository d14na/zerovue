/* Initialize crypto library. */
const crypto = require('crypto')

/**
 * Calculate File Hash
 *
 * NOTE Only the first half of the SHA-512 is used in verification.
 */
const calcFileHash = function (_data) {
    /* Calculate the sha512 hash. */
    const hash = crypto.createHash('sha512').update(_data).digest()

    /* Truncate to 256-bit and return hex. */
    return hash.toString('hex').slice(0, 64)
}

/**
 * Calculate Peer Identity
 *
 * NOTE Returned by WHOAMI request.
 */
const calcIdentity = function (_data) {
    return calcInfoHash(_data)
}

/**
 * Calculate Info Hash
 */
const calcInfoHash = function (_data) {
    /* Compute the SHA-1 hash of the data provided. */
    return crypto.createHash('sha1').update(_data).digest('hex')
}

/**
 * JSON Detection
 */
const isJson = function (_str, _stringified = false) {
    if (!_stringified) {
        _str = JSON.stringify(_str)
    }

    try {
        JSON.parse(_str)
    } catch (e) {
        return false
    }

    return true
}

module.exports = {
    calcFileHash,
    calcIdentity,
    calcInfoHash,
    isJson,
}
