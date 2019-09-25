/**
 * Add Log Entry
 *
 * NOTE All significant activities (that are NOT directly alerted to the user)
 *      are handled and recorded by this logging event.
 */
const addLog = function (_message) {
    /* Build new log entry. */
    const timestamp = `➤ Supeer ${moment().format('YYYY.MM.DD @ HH:mm:ss')}`
    const entry = `[ ${_message} ]`

    /* Add to log manager. */
    // App.logMgr.push(`${timestamp} ${entry}`)

    /* Write to console. */
    console.info('%c' + timestamp + '%c ' + entry, 'color:red', 'color:black')
}

module.exports = addLog
