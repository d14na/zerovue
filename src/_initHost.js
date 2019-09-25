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
    app.on('start_debugger', (_event) => {
        console.log('MENU: Start Debugger')

        let counter = 0
        let report = ''

        for (let entry of this.zeroKit.logMgr) {
            // console.log(entry)
            report += `${++counter}: ${entry}\n\n`
        }

        console.log(report)
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

    /* Add keyboard (esc) detection. */
    document.onkeydown = (_evt) => {
        /* Set event. */
        _evt = _evt || window.event

        /* Initialize escape flag. */
        let isEscape = false

        /* Validate key support. */
        if ('key' in _evt) {
            isEscape = (_evt.key === 'Escape' || _evt.key === 'Esc')
        } else {
            isEscape = (_evt.keyCode === 27)
        }

        /* Handle escape. */
        if (isEscape) {
            /* Clear modals. */
            // this.clearModals(0)
            console.log('Escape was pressed!');
        }
    }
}

module.exports = initHost
