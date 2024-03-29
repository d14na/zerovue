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
 * Escape unicode characters.
 * Converts to a string representation of the unicode.
 */
const escapeUnicode = function (_str) {
    return _str.replace(/[^\0-~]/g, function (ch) {
        return '\\u' + ('000' + ch.charCodeAt().toString(16)).slice(-4)
    })
}

/**
 * Retrieve Querystring Parameter (by name)
 */
const getParameterByName = function (name, url) {
    if (!url) url = window.location.href

    name = name.replace(/[\[\]]/g, '\\$&')

    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)')

    const results = regex.exec(url)

    if (!results) return null

    if (!results[2]) return ''

    return decodeURIComponent(results[2].replace(/\+/g, ' '))
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
    escapeUnicode,
    getParameterByName,
    isJson
}
