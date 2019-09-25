/**
 * User-Interface (UI) Initialization
 */
const initUI = function () {
    /* Initialize (webview) User Interface. */
    this.UI = document.querySelector('webview')

    /* Handle DOM ready. */
    const _domReady = () => {
        /* Send (via ipcRenderer listener). */
        // this.UI.send('ping')
        this.UI.send('message', 'btw, the DOM is ready to go!!')

        /* Send (via native Js). */
        this.UI.executeJavaScript('_0.domReady()')
    }

    /* Initialize DOM listener. */
    // NOTE: This lets us know as soon as the UI DOM is ready.
    // this.UI.addEventListener('dom-ready', _domReady)

    /* Handle IPC Messages. */
    // NOTE: This is how we receive our `postMessage` requests from UI
    //       using the `ipcRenderer.sendToHost` method.
    this.UI.addEventListener('ipc-message', (event) => {
        /* Retrieve channel. */
        const channel = event.channel

        let pkg

        try {
            pkg = JSON.parse(channel)

            // console.log('IPC Package', pkg)

            /* Set action. */
            const action = pkg.action

            switch(action) {
            case 'testConnection':
                /* Test connection. */
                return this.zeroKit.testConnection()
            case 'updateWebSource':
                /* Set body. */
                const body = pkg.body

                // console.log('received body', body)

                /* Update web source. */
                return this.updateWebSource(body)
            }
        } catch (e) {
            // IGNORE ALL DECODING ERRORS
            // return console.error(e)
        }
    })

    /* Capture ALL console messages from SANDBOX. */
    this.UI.addEventListener('console-message', function (e) {
        /* Parse source file. */
        const srcFile = e.sourceId.replace(/^.*[\\\/]/, '')

        /* Build new log entry. */
        const timestamp = `➤ ZeroKit Console ${moment().format('YYYY.MM.DD @ HH:mm:ss')}`
        const entry = `[ ${srcFile} ](Line ${e.line}): ${e.message}`

        /* Add to log manager. */
        // App.logMgr.push(`${timestamp} ${entry}`)

        /* Write to console. */
        console.info('%c' + timestamp + '%c ' + entry, 'color:red', 'color:black')
    })
}

module.exports = initUI
