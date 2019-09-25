/*******************************************************************************
 *
 * ZeroKit (Host)
 * --------------
 *
 * UI Rendering Engine for Zeronet
 *
 * We are using SockJS to manage all socket communications.
 * https://github.com/sockjs/sockjs-client
 *
 */
class ZeroKit {
    constructor (_host = 'https://supeer.host') {
        /* Initialize constants. */
        this.INFURA_API_KEY = '61a2428e6a4e41a695d876dfac323f0f' // Infura API key
        this.RECONNECT_DELAY = 3000
        this.WAIT_DELAY = 500

        /* Initialize connection manager. */
        this.conn = null

        /* Initialize request manager. */
        this.requestMgr = {}

        /* Initialize log manager. */
        this.logMgr = []

        /* Initialize Gatekeeper's Ready flag. */
        this.gateReady = false

        /* Initialize Request Id. */
        this.requestId = 0

        /* Initialize global client details. */
        this.peerId = null
        this.account = null
        this.identity = null

        /* Initialize network status. */
        this.networkStatus = 'Disconnected'
        this.networkStatusClass = 'text-danger'

        /* Initialize profile. */
        this.profile = {
            icon: './img/dark-hood-icon.jpg',
            nametag: 'Guest User'
        }

        /* Initialize connection (holder). */
        this.conn = null

        /* Initialize functions / methods. */
        this.addLog = require('./host/_addLog')
        this.authRequest = require('./host/_authRequest')
        this.connect = require('./host/_conn')
        this.errors = require('./host/_errors')
        this.formatFileData = require('./host/_formatFileData')
        this.homepage = require('./host/_homepage')
        this.imgConverter = require('./host/_imgConverter')
        this.parseAction = require('./host/_parseAction')
        this.parseDbSchema = require('./host/_parseDbSchema')
        this.parseMetadata = require('./host/_parseMetadata')
        this.requireFile = require('./host/_requireFile')
        this.search = require('./host/_search')
        this.sendMessage = require('./host/_sendMessage')
        this.signAuth = require('./host/_signAuth')
        this.toast = require('./host/_toast')
        this.validateConfig = require('./host/_validateConfig')
        this.validateFileData = require('./host/_validateFileData')

        /* Initialize message handler. */
        this.handleMessage = require('./host/handlers/_message.js')

        /* Request connection to supeer. */
        this.connect(_host)
    }

    /**
     * Test Connection
     */
    testConnection () {
        console.log('HOST wants to test the connection from UI')

        // this.authGatekeeper()
    }

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

    // networkStatusShowAll: function () {
    //     alert('_networkStatusShowAll')
    // },

}

/**
 * ZeroKit Module
 *
 * This supports NodeJs and module implementations.
 *
 * NOTE: Used by the Browser (Parent) Window.
 */
module.exports = ZeroKit
