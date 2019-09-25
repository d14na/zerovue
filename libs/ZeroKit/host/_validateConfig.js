/**
 * Verify Configuration (content.json)
 */
const validateConfig = function (_config) {
    /* Return a promise (non-blocking). */
    return new Promise((resolve, reject) => {
        /* Retrieve address. */
        const address = _config.address

        /* Retrieve the signature. */
        const signature = _config.signs[address]

        /* Delete signs (as we can't verify ourselves in the signature). */
        delete _config.signs

        /* Convert the JSON to a string. */
        // NOTE: This matches the functionality of Python's `json.dumps` spacing.
        _config = JSON.stringify(_config).replace(/":/g, '": ').replace(/,"/g, ', "')

        /* Escape all unicode characters. */
        // NOTE: This matches the functionality of Python's `unicode` handling.
        _config = ZeroUtils.escapeUnicode(_config)

        /* Verify the Bitcoin signature. */
        const isValid = BitcoinMessage.verify(_config, address, signature)

        /* Resolve the result. */
        resolve(isValid)
    })
}

module.exports = validateConfig
