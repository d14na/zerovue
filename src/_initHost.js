/* Initailize constants. */
const fpath = require('path')

/**
 * HOST Initialization
 */
const initHost = function () {
    /* Require ZeroKit. */
    const ZeroKit = require(__dirname + '/../libs/ZeroKit/host')

    /* Initialize ZeroKit. */
    this.zeroKit = new ZeroKit()

    /* Post Message. */
    this.zeroKit.postMessage = (_pkg) => {
        // console.log('send to UI', _pkg)
        this.UI.send('message', JSON.stringify(_pkg))
    }

    /* Handle debugger. */
    // NOTE: Called from the 'View' menu.
    app.on('start_debugger', function (_event) {
        console.log('HOME wants to start the debugger')
    })

    /* Handle OS application path response. */
    ipc.on('got-os-app-path', (_event, _path) => {
        // console.log('PATH', _path)

        /* Insert pre-loaded script. */
        this.preload = fpath.join(
            'file://',
            _path,
            '/libs/ZeroKit/ui.js'
        )
        // console.log('this.preload', this.preload)
    })

    /* Request OS application path. */
    ipc.send('get-os-app-path')
}

module.exports = initHost
