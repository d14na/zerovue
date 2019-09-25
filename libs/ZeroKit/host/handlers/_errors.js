/**
 * Errors
 *
 * TODO How should we handle CRITICAL errors??
 */
const errors = function (_err, _critical = false) {
    /* Handle critical errors with a throw (terminate application). */
    if (_critical) {
        throw new Error(_err)
    } else {
        console.error(_err)
    }
}

module.exports = errors
