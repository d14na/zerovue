// FIXME Work on localizing ALL of the global variables
//       initialized below INTO the vue app manager.

/* Initialize constants. */
const WS_ENDPOINT = 'https://supeer.host' // WebSockets endpoint
const INFURA_API_KEY = '61a2428e6a4e41a695d876dfac323f0f' // Infura API key

/* Initialize connection manager. */
let conn = null

/* Initialize requests manager. */
const requestMgr = {}

/* Initialize a manager to ZeroVue's (iframe). */
const zerovue = $('#zerovue')

/* Initialize the ZeroVue content window. */
// FIXME: Add error checking.
const contentWindow = zerovue[0].contentWindow

/* Initialize Gatekeeper's Ready flag. */
let gateReady = false

/* Initialize Request Id. */
let requestId = 0

/* Initialize global client details. */
let peerId = null
let account = null
let identity = null

/**
 * Vue Application Manager
 */
const vueAppManager = {
    el: '#app',
    data: () => ({
        /* System */
        logMgr: [],

        /* Constants */
        BLOCK_HASH_LENGTH: 20,
        CHUNK_LENGTH: 16384,

        /* Device Status */
        storageUsed: null,
        storageQuota: null,

        /* Network Status */
        networkIdentity: null,
        networkStatus: null,
        networkStatusClass: null,

        /* Search */
        query: null,

        /* Messaging */
        msgList: [],

        /* Profile */
        profile: {},

        /* Zeronet Zite Manager */
        ziteMgr: {},
        destination: null,

        /* Torrent Manager */
        torrentMgr: {}
    }),
    mounted: function () {
        /* Initialize application. */
        this._init()
    },
    computed: {
        msgIndicator: function () {
            if (this.msgList.length) {
                return true
            } else {
                return false
            }
        }
    },
    methods: {
        _init: function () {
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
                    _clearModals(0)
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
        _parseFlags: function (_flags) {
            if (_flags.indexOf('ADMIN') !== -1) {
                return `<strong class="text-danger">[ADMIN]</strong> `
            }
        },
        _setConnStatus: function (_status, _class) {
            this.networkStatus = _status
            this.networkStatusClass = _class
        },
        _setIdentity: function (_identity) {
            // 173.239.230.54 [ Toronto, Canada ]
            this.networkIdentity = _identity
        },
        _resetSearch: function () {
            /* Clear search input. */
            this.query = ''

            /* Set focus to window. */
            window.focus()
        },
        loadMsg: function (_msgId) {
            alert(`loading message [ ${_msgId} ]`)
        },
        msgMarkAllRead: function () {
            this.msgList = []
        },
        msgNew: function () {
            alert('new message')
        },
        msgShowAll: function () {
            alert('load all messages')
        },
        networkStatusLogs: function () {
            /* Initialize body. */
            let body = ''

            body += '<pre>'

            for (let entry of this.logMgr.reverse()) {
                body += `${entry}\n`
            }

            body += '</pre>'

            /* Build zerovue package. */
            const pkg = { body }

            /* Send package to zerovue. */
            _zerovueMsg(pkg)
        },
        networkStatusShowAll: function () {
            alert('_networkStatusShowAll')
        },
        search: function () {
            if (!this.query) {
                return _alert('Search Error', 'Please enter the REQUEST you desdire.')
            }

            /* Call search library. */
            _search(this.query)
        }
    }
}

/* Initialize the application. */
window.App = new Vue(vueAppManager)
