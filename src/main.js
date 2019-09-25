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
        //
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
