/* Initailize constants. */
const { app } = require('electron').remote
const fpath = require('path')
const ipc = require('electron').ipcRenderer
const store = require('./store')

/* Initialize ZeroVue application. */
const ZeroVue = new Vue({
    el: '#app',
    data: () => ({
        ZeroKit: null,
        navGreeting: 'Welcome! This is an early preview of the ZeroVue Rendering Engine.',
        mySource: '',
        preload: 'file:'
    }),
    computed: {
        //
    },
    methods: {
        initHost () {
            /* Initialize (webview) User Interface. */
            this.UI = document.querySelector('webview')

            /* Handle IPC Messages. */
            // NOTE: This is how we receive our `postMessage` requests from UI
            //       using the `ipcRenderer.sendToHost` method.
            this.UI.addEventListener('ipc-message', (event) => {
                /* Retrieve channel. */
                const channel = event.channel

                let message

                try {
                    message = JSON.parse(channel)
                } catch (e) {
                    // IGNORE ALL DECODING ERRORS
                    // return console.error(e)
                }

                console.log('IPC Message', message)
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
        },
        open (link) {
            this.$electron.shell.openExternal(link)
        },
        home () {
            console.log('go home')
        },
        openFile () {
            ipc.send('open-file-dialog')
        },
        firstTest () {
            const ZeroKit = require(__dirname + '/plugins/ZeroKit/host').module
            // console.log('ZeroKit', ZeroKit)

            /* Initialize new ZeroKit. */
            const zeroKit = new ZeroKit()

            zeroKit.classTest('This is a `firstTest` from classTest!')
        }
    },
    mounted: function () {
        /* Initialize ZeroKit (from HOST). */
        this.initHost()

        app.on('start_debugger', function (event) {
        // app.on('start_debugger', function (event) {
            console.log('HOME wants to start the debugger')
        })

        /* Handle OS path request. */
        ipc.on('got-os-app-path', (event, path) => {
            // console.log('PATH', path)

            /* Insert pre-loaded script. */
            this.preload = fpath.join(
                'file://',
                path,
                '/src/libs/ZeroKit/ui.js'
            )

            // console.log('this.preload', this.preload)

            // FOR DEVELOPMENT PURPOSES ONLY
            this.mySource = `data:text/html,
How much <strong>HTML</strong> can we fit in here??
<div id="testArea"><!-- test area --></div>
<br /><button class="uk-button uk-button-danger uk-button-small" onclick="zeroKit.testConnection()">Test Connection</button>
<br /><button class="uk-button uk-button-danger uk-button-small" onclick="zeroKit.testPostMessage()">Test PostMessage</button>
<style></style>
            `
        })

        /* Handle DOM ready. */
        const domReady = () => {
            // console.log('this.UI', this.UI)
            this.UI.send('ping')
        }

        /* Initialize DOM listener. */
        this.UI.addEventListener('dom-ready', domReady)

        /* Request OS application path. */
        ipc.send('get-os-app-path')
    }
})
