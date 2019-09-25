/* Initailize constants. */
const { app } = require('electron').remote
// const fpath = require('path')
const ipc = require('electron').ipcRenderer
// const store = require('./store')

/* Initialize ZeroVue application. */
const ZeroVue = new Vue({
    el: '#app',
    data: () => ({
        /* ZeroKit */
        zeroKit: null,

        /* (Search) Query Value */
        query: '',

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
            /* Perform search (on user query). */
            this.zeroKit.search(this.query)
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
        /* Require host initialization. */
        // NOTE: Bind context to `this`.
        const initHost = require('./_initHost.js').bind(this)

        /* Initialize ZeroKit (HOST). */
        initHost()

        /* Require host initialization. */
        // NOTE: Bind context to `this`.
        const initUI = require('./_initUI.js').bind(this)

        /* Initialize ZeroKit (UI). */
        initUI()
    }
})
