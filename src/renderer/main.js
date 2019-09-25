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

        /* Search Value */
        searchVal: '',

        /* Greeting */
        // TODO Add translations for this opening message.
        navGreeting: 'Welcome! This is an early preview of the ZeroVue Rendering Engine.',

        /* Webview Source */
        webSource: 'data:text/html,Loading. Please wait..',

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
        /**
         * HOST Initialization
         */
        initHost () {
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
        },

        /**
         * User-Interface (UI) Initialization
         */
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
                    case 'updateWebSource':
                        const body = pkg.body
                        console.log('received body', body)

                        this.updateWebSource(body)
                        break
                    case 'testD14naIndex':
                        this.updateWebSource(`Who said you could change this?`)
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

        /**
         * Open Clearnet (Web Link)
         */
        openClearnet (_link) {
            this.$electron.shell.openExternal(_link)
        },

        /**
         * Update Web (HTML) Source
         */
        updateWebSource (_source) {
            // NOTE: We MUST prefix the HTML with a data object.
            this.webSource = `data:text/html,${_source}`
        },

        /**
         * Load Homepage
         */
        home () {
            /* Go to homepage. */
            this.zeroKit.goHome()
        },

        /**
         * Open a File
         */
        openFile () {
            ipc.send('open-file-dialog')
        },

        /**
         * Search
         *
         * Uses the input field value.
         */
        search () {
            // this.zeroKit.search('i am looking for something SMPL')

            this.updateWebSource(`Who said you could change this?`)
            // this.zeroKit.testD14naIndex()

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
        /* Initialize ZeroKit (HOST). */
        this.initHost()

        /* Initialize ZeroKit (UI). */
        this.initUI()
    }
})
