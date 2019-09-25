/* Initailize constants. */
const { app } = require('electron').remote
const ipc = require('electron').ipcRenderer
// const store = require('./store')

/* Initialize ZeroVue application. */
const ZeroVue = new Vue({
    el: '#app',
    data: () => ({
        /* Constants */
        BLOCK_HASH_LENGTH: 20,
        CHUNK_LENGTH: 16384,

        /* ZeroKit */
        zeroKit: null,

        /* Greeting */
        // TODO Add translations for this opening message.
        navGreeting: 'Welcome! This is an early preview of the ZeroVue Rendering Engine.',

        /* Webview Source */
        webSource: 'data:text/html,Loading. Please wait..',

        /* Webview Preload (Script) */
        preload: 'file:',

        /* System */
        // logMgr: [],

        /* Device Status */
        // storageUsed: null,
        // storageQuota: null,

        /* Network Status */
        // networkIdentity: null,
        // networkStatus: null,
        // networkStatusClass: null,

        /* Search */
        query: '',

        /* Profile */
        // profile: {},

        /* Zeronet Zite Manager */
        ziteMgr: {},
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
            this.zeroKit.homepage()
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
            /* Perform search (on user query). */
            this.zeroKit.search(this.query)
        },

        resetSearch () {
            /* Clear search input. */
            this.query = ''

            /* Set focus to window. */
            window.focus()
        },

        // _parseFlags: function (_flags) {
        //     if (_flags.indexOf('ADMIN') !== -1) {
        //         return `<strong class="text-danger">[ADMIN]</strong> `
        //     }
        // },

        // _setConnStatus: function (_status, _class) {
        //     this.networkStatus = _status
        //     this.networkStatusClass = _class
        // },

        // _setIdentity: function (_identity) {
        //     // 173.239.230.54 [ Toronto, Canada ]
        //     this.networkIdentity = _identity
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

        LEGACY_INIT_MIGRATE_THEN_DELETE: function () {
            /* Initialize network status. */
            this.networkStatus = 'Disconnected'
            this.networkStatusClass = 'text-danger'

            /* Initialize profile. */
            this.profile = {
                icon: './img/dark-hood-icon.jpg',
                nametag: 'Guest User'
            }

            /* Send an empty message to the zerovue to initialize. */
            _authGatekeeper()

            /* Add keyboard (esc) detection. */
            $(document).keyup(function (e) {
                /* Hide ALL modal windows. */
                if (e.keyCode === 27) {
                    /* Clear modals. */
                    this.clearModals(0)
                }
            })

            /* Calculate the storage capacity of the device. */
            // NOTE Different limits depending on browser type:
            //      - 7,335,365,041 (7GB) using Regular-mode
            //      - 8,615,745 (8MB) using Incognito-mode
            navigator.webkitTemporaryStorage
                .queryUsageAndQuota((storageUsed, storageQuota) => {
                    /* Set storage used. */
                    this.storageUsed = storageUsed

                    /* Set storage quota. */
                    this.storageQuota = storageQuota

                    console.info(`
    Temporary Storage [ Usage | Quota ]
    -----------------------------------
      [ ${numeral(this.storageUsed).format('0.00 b')} | ${numeral(this.storageQuota).format('0.00 b')} ]
                    `)

                    if (this.storageUsed === this.storageQuota) {
                        navigator.webkitTemporaryStorage.requestQuota (
                            this.storageUsed + 10000,
                            (_results) => {
                                console.log('Temporary quota increase results', _results)

                                navigator.webkitTemporaryStorage.queryUsageAndQuota((storageUsed, storageQuota) => {
                                    console.log('NEW [Temporary] QUOTAS', storageUsed, storageQuota)
                                })
                            },
                            (_error) => {
                                console.error('ERROR: Requesting increased storage', _error)
                            })
                    }
                })

            // navigator.webkitPersistentStorage.queryUsageAndQuota((storageUsed, storageQuota) => {
            //     return
            //     /* Set storage used. */
            //     this.storageUsed = storageUsed
            //
            //     /* Set storage quota. */
            //     this.storageQuota = storageQuota
            //
            //     console.info(`Persistent storage usage [ ${numeral(this.storageUsed).format('0.00 b')} ]`)
            //     console.info(`Persistent storage quota [ ${numeral(this.storageQuota).format('0.00 b')} ]`)
            //
            //     if (true) {
            //     // if (this.storageUsed === this.storageQuota) {
            //         navigator.webkitPersistentStorage.requestQuota (
            //             this.storageQuota * 2,
            //             (_results) => {
            //                 console.log('Persistent quota increase results', _results)
            //
            //                 navigator.webkitPersistentStorage.queryUsageAndQuota((storageUsed, storageQuota) => {
            //                     console.log('NEW [Persistent] QUOTAS', storageUsed, storageQuota)
            //                 })
            //             },
            //             (_error) => {
            //                 console.error('ERROR: Requesting increased storage', _error)
            //             })
            //     }
            // })

            /* Verify NO parent window! */
            // if (window.self === window.top) {
            //     console.log('NOTIFICATION', Notification)
            //
            //     if (Notification) {
            //         console.log('Notification.permission', Notification.permission)
            //
            //         if (Notification.permission === 'denied') {
            //             console.log('Requesting have been denied!')
            //             alert('Oh! Looks like you DO NOT want to be IN THE KNOW!')
            //         } else if (Notification.permission !== 'granted') {
            //             console.log('Requesting permission now!')
            //             Notification.requestPermission()
            //         } else {
            //             var notification = new Notification('Notification title', {
            //                icon: 'http://cdn.sstatic.net/stackexchange/img/logos/so/so-icon.png',
            //                body: "Hey there! You've been notified!",
            //              })
            //
            //              notification.onclick = function () {
            //                window.open("http://stackoverflow.com/a/13328397/1269037");
            //              }
            //         }
            //     } else {
            //         alert('Desktop notifications not available in your browser. Try Chromium.');
            //     }
            // } else {
            //     console.info('0net is contained within another window. Escaping now!')
            //
            //     window.open(window.location.toString(), '_top')
            // 	document.write('Please wait, now escaping from iframe..')
            // 	window.stop()
            // 	document.execCommand('Stop', false)
            // }
        },

    },
    mounted: function () {
        /* Initialize Zeronet Utilities (as a global object). */
        window.ZeroUtils = require('./_utils')

        /* Require host initialization. */
        // NOTE: Bind context to `this`.
        const initHost = require('./_initHost').bind(this)

        /* Initialize ZeroKit (HOST). */
        initHost()

        /* Require host initialization. */
        // NOTE: Bind context to `this`.
        const initUI = require('./_initUI').bind(this)

        /* Initialize ZeroKit (UI). */
        initUI()
    }
})
