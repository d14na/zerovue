/* Initailize constants. */
const fpath = require('path')

/**
 * HOST Initialization
 */
const initHost = function () {
    /* Require ZeroKit. */
    const ZeroKit = require(__dirname + '/../libs/ZeroKit/host').module

    /* Initialize ZeroKit. */
    this.zeroKit = new ZeroKit()

    this.zeroKit.postMessage = (_pkg) => {
        // console.log('send to UI', _pkg)
        this.UI.send('message', JSON.stringify(_pkg))
    }

    /* Handle debugger. */
    // NOTE: Called from the 'View' menu.
    app.on('start_debugger', function (event) {
        console.log('HOME wants to start the debugger')
    })

    /* Handle OS application path response. */
    ipc.on('got-os-app-path', (event, path) => {
        // console.log('PATH', path)

        /* Insert pre-loaded script. */
        this.preload = fpath.join(
            'file://',
            path,
            '/libs/ZeroKit/ui.js'
        )
        // console.log('this.preload', this.preload)
    })

    /* Request OS application path. */
    ipc.send('get-os-app-path')
}

module.exports = initHost
