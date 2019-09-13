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
        initZeroKit () {
            this.ZeroKit = document.querySelector('webview')

            /* Capture ALL console messages from SANDBOX. */
            this.ZeroKit.addEventListener('console-message', function (e) {
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
            const ZeroKit = require(__dirname + '/plugins/ZeroKit').module
            // console.log('ZeroKit', ZeroKit)

            /* Initialize new ZeroKit. */
            const zeroKit = new ZeroKit()

            zeroKit.classTest('This is a `firstTest` from classTest!')
        }
    },
    mounted: function () {
        /* Initialize ZeroKit. */
        this.initZeroKit()

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
                '/src/plugins/ZeroKit.js'
            )

            // console.log('this.preload', this.preload)

            // FOR DEVELOPMENT PURPOSES ONLY
            this.mySource = `data:text/html,
How much <strong>HTML</strong> can we fit in here??
<div id="testArea"><!-- test area --></div>
<button class="uk-button uk-button-danger uk-button-small" onclick="document.getElementById('testArea').innerHTML='<b>hi-there</b>'">Start Test</button>
<button class="uk-button uk-button-danger uk-button-small" onclick="zeroKit.classTest('hi again!!')">Start ALERT Test</button>
<button class="uk-button uk-button-danger uk-button-small" onclick="zeroKit.testConnection()">Test Connection</button>
<style></style>
            `
        })

        // console.log('this.zerovue', this.zerovue)
        // const indicator = document.querySelector('.indicator')

        // const loadstart = () => {
        //     console.log('loadstart')
        //     // indicator.innerText = 'loading...'
        // }

        // const loadstop = () => {
        //     console.log('loadstop')
        //     // indicator.innerText = ''
        // }

        // this.zerovue.addEventListener('did-start-loading', loadstart)
        // this.zerovue.addEventListener('did-stop-loading', loadstop)

        ipc.send('get-os-app-path')
    }
})
