/* Initailize constants. */
const { app } = require('electron').remote
const fpath = require('path')
const ipc = require('electron').ipcRenderer
const store = require('./store')

/* Initialize ZeroVue application. */
const ZeroVue = new Vue({
    el: '#app',
    data: () => ({
        /* ZeroKit */
        zeroKit: null,

        /* Greeting */
        // TODO Add translations for this opening message.
        navGreeting: 'Welcome! This is an early preview of the ZeroVue Rendering Engine.',

        /* Webview Source */
        mySource: '',

        /* Webview Preload (Script) */
        preload: 'file:',

        /* System */
        // logMgr: [],

        /* Constants */
        // BLOCK_HASH_LENGTH: 20,
        // CHUNK_LENGTH: 16384,

        /* Device Status */
        // storageUsed: null,
        // storageQuota: null,

        /* Network Status */
        // networkIdentity: null,
        // networkStatus: null,
        // networkStatusClass: null,

        /* Search */
        // query: null,

        /* Profile */
        // profile: {},

        /* Zeronet Zite Manager */
        // ziteMgr: {},
        // destination: null,

        /* Torrent Manager */
        // torrentMgr: {}

    }),
    computed: {
        // msgIndicator: function () {
        //     if (this.msgList.length) {
        //         return true
        //     } else {
        //         return false
        //     }
        // }
    },
    methods: {
        initHost () {
            /* Require ZeroKit. */
            const ZeroKit = require(__dirname + '/../libs/ZeroKit/host').module

            /* Initialize ZeroKit. */
            this.zeroKit = new ZeroKit()

            this.zeroKit.postMessage = (_pkg) => {
                // console.log('send to UI', _pkg)
                this.UI.send('message', JSON.stringify(_pkg))
            }
        },

        initUI () {
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
            this.UI.addEventListener('dom-ready', _domReady)

            /* Handle IPC Messages. */
            // NOTE: This is how we receive our `postMessage` requests from UI
            //       using the `ipcRenderer.sendToHost` method.
            this.UI.addEventListener('ipc-message', (event) => {
                /* Retrieve channel. */
                const channel = event.channel

                let pkg

                try {
                    pkg = JSON.parse(channel)

                    console.log('IPC Package', pkg)

                    const action = pkg.action

                    switch(action) {
                    case 'testConnection':
                        this.zeroKit.testConnection()
                        break
                    case 'updateMySource':
                        const body = pkg.body
                        console.log('received body', body)

                        this.updateMySource(body)
                        break
                    case 'testD14naIndex':
                        this.updateMySource(`Who said you could change this?`)
                        // this.zeroKit.testD14naIndex()
                        break
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
        },

        open (link) {
            this.$electron.shell.openExternal(link)
        },

        updateMySource (_source) {
            this.mySource = `data:text/html,${_source}`
        },

        home () {
            console.log('go home')
        },

        openFile () {
            ipc.send('open-file-dialog')
        },

        search () {
            // const ZeroKit = require(__dirname + '/../libs/ZeroKit/host').module
            // console.log('ZeroKit', ZeroKit)

            /* Initialize new ZeroKit. */
            // const zeroKit = new ZeroKit()

            this.zeroKit.search('i am looking for something SMPL')
        },

        // _parseFlags: function (_flags) {
        //     if (_flags.indexOf('ADMIN') !== -1) {
        //         return `<strong class="text-danger">[ADMIN]</strong> `
        //     }
        // },

        _setConnStatus: function (_status, _class) {
            this.networkStatus = _status
            this.networkStatusClass = _class
        },

        // _setIdentity: function (_identity) {
        //     // 173.239.230.54 [ Toronto, Canada ]
        //     this.networkIdentity = _identity
        // },

        // _resetSearch: function () {
        //     /* Clear search input. */
        //     this.query = ''
        //
        //     /* Set focus to window. */
        //     window.focus()
        // },

        // loadMsg: function (_msgId) {
        //     alert(`loading message [ ${_msgId} ]`)
        // },

        // msgMarkAllRead: function () {
        //     this.msgList = []
        // },

        // msgNew: function () {
        //     alert('new message')
        // },

        // msgShowAll: function () {
        //     alert('load all messages')
        // },

        // networkStatusLogs: function () {
        //     /* Initialize body. */
        //     let body = ''
        //
        //     body += '<pre>'
        //
        //     for (let entry of this.logMgr.reverse()) {
        //         body += `${entry}\n`
        //     }
        //
        //     body += '</pre>'
        //
        //     /* Build zerovue package. */
        //     const pkg = { body }
        //
        //     /* Send package to zerovue. */
        //     _zerovueMsg(pkg)
        // },

        // networkStatusShowAll: function () {
        //     alert('_networkStatusShowAll')
        // },

        // search: function () {
        //     if (!this.query) {
        //         return this.alert('Search Error', 'Please enter the REQUEST you desdire.')
        //     }
        //
        //     /* Call search library. */
        //     _search(this.query)
        // }

    },
    mounted: function () {
        /* Initialize ZeroKit (from HOST). */
        this.initHost()

        /* Initialize ZeroKit (from UI). */
        this.initUI()

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
                '/libs/ZeroKit/ui.js'
            )

            // console.log('this.preload', this.preload)

            // FOR DEVELOPMENT PURPOSES ONLY
            this.mySource = `data:text/html,
How much <strong>HTML</strong> can we fit in here??
<div id="testArea"><!-- test area --></div>
<br /><button class="uk-button uk-button-danger uk-button-small" onclick="_0.testD14naIndex()">Test D14na Index</button>
<br /><button class="uk-button uk-button-danger uk-button-small" onclick="_0.testConnection()">Test Connection</button>
<br /><button class="uk-button uk-button-danger uk-button-small" onclick="_0.testPostMessage()">Test PostMessage</button>
<style></style>
            `
        })

        /* Request OS application path. */
        ipc.send('get-os-app-path')
    }
})
