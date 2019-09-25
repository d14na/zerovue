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
        const INFURA_API_KEY = '61a2428e6a4e41a695d876dfac323f0f' // Infura API key

        /* Initialize connection manager. */
        this.conn = null

        /* Initialize request manager. */
        this.requestMgr = {}

        /* Initialize Gatekeeper's Ready flag. */
        this.gateReady = false

        /* Initialize Request Id. */
        this.requestId = 0

        /* Initialize global client details. */
        this.peerId = null
        this.account = null
        this.identity = null

        /* Messaging */
        this.msgList = []

        /* Initialize connection (holder). */
        this.conn = null

        /* Initialize utilities. */
        // NOTE: We MUST bind methods that use `this`.
        const utils = require('./host/_utils.js')
        this.calcIdentity = utils.calcIdentity.bind(this)

        /* Initialize functions / methods. */
        this.addLog = require('./host/_addLog.js')
        this.alert = require('./host/_alert.js')
        this.authRequest = require('./host/_authRequest.js')
        this.clearModals = require('./host/_clearModals.js')
        this.connect = require('./host/_conn.js')
        this.errors = require('./host/_errors.js')
        this.formatFileData = require('./host/_formatFileData.js')
        this.getAction = require('./host/_getAction.js')
        this.goHome = require('./host/_goHome.js')
        this.imgConverter = require('./host/_imgConverter.js')
        this.parseDbSchema = require('./host/_parseDbSchema.js')
        this.requireFile = require('./host/_requireFile.js')
        this.search = require('./host/_search.js')
        this.sendMessage = require('./host/_sendMessage.js')
        this.signAuth = require('./host/_signAuth.js')
        this.validateFileData = require('./host/_validateFileData.js')
        this.verifyConfig = require('./host/_verifyConfig.js')
        this.verifyMetadata = require('./host/_verifyMetadata.js')
        this.wait = require('./host/_wait.js')

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
}

/**
 * ZeroKit Module
 *
 * This supports NodeJs and module implementations.
 *
 * NOTE: Used by the Browser (Parent) Window.
 */
exports.module = ZeroKit
