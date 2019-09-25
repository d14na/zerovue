/*******************************************************************************
 *
 * ZeroKit (Host)
 * --------------
 *
 * UI Rendering Engine for Zeronet
 *
 */
class ZeroKit {
    constructor (_host = 'https://supeer.host') {
        /* Send an empty message to the zerovue to initialize. */
        // this.authGatekeeper()

        /*******************************************************************************

          SockJS
          https://github.com/sockjs/sockjs-client

          We are using SockJS to manage all socket communications.

        *******************************************************************************/

        /* Initialize constants. */
        // const WS_ENDPOINT = 'https://supeer.host' // WebSockets endpoint
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

        // this.UI = '0'

        this.conn = require('./host/_conn.js')
        this.conn.connect = this.conn.connect.bind(this)

        this.message = require('./host/_message.js')
        this.message.send = this.message.send.bind(this)

        const utils = require('./host/_utils.js')
        this.calcIdentity = utils.calcIdentity.bind(this)

        /* Initialize handlers. */
        this.goHome = require('./host/handlers/_goHome.js')
        // this.goHome = this.goHome.bind(this)

        /* Request connection to supeer. */
        this.conn.connect(_host)
    }

    /**
     * Add Log Entry
     *
     * NOTE All significant activities (that are NOT directly alerted to the user)
     *      are handled and recorded by this logging event.
     */
    addLog (_message) {
        /* Build new log entry. */
        const timestamp = `➤ Supeer ${moment().format('YYYY.MM.DD @ HH:mm:ss')}`
        const entry = `[ ${_message} ]`

        /* Add to log manager. */
        // App.logMgr.push(`${timestamp} ${entry}`)

        /* Write to console. */
        console.info('%c' + timestamp + '%c ' + entry, 'color:red', 'color:black')
    }

    /**
     * Error Handler
     *
     * TODO How should we handle CRITICAL errors??
     */
    errorHandler (_err, _critical = false) {
        /* Handle critical errors with a throw (terminate application). */
        if (_critical) {
            throw new Error(_err)
        } else {
            console.error(_err)
        }
    }

    /**
     * Retrieve Action from Requests Manager
     */
    getAction (_data) {
        /* Initialize action. */
        let action = null

        /* Retrieve request id. */
        const requestId = _data.requestId

        if (requestId && this.requestMgr[requestId]) {
            /* Retrieve action. */
            action = this.requestMgr[requestId].action

            // TODO Completed requests should be CANCELLED by messaging the network.

            /* Remove request from manager. */
            // FIXME Verify that we do not need to persist this request
            //       other than to retrieve the ACTION
            // delete this.requestMgr[requestId]
        }

        /* Return the action. */
        return action
    }

    /**
     * Authorization Request
     */
    async authRequest (_identity) {
        /* Set action. */
        const action = 'AUTH'

        /* Initialize network protocol. */
        const network = '0NET-TLR' // 0NET: TrustLess Republic

        /* Initialize nonce. */
        const nonce = moment().unix()

        /* Build proof (string). */
        const proof = `${network}:${_identity}:${nonce}`
        // console.log('Proof', proof)

        /* Retrieve signed proof. */
        const sig = await this.signAuth(proof)
        this.addLog(`Authentication proof: [ ${proof} ]`)

        /* Build package. */
        const pkg = { action, proof, sig }

        /* Send package. */
        this.message.send(pkg)
    }

    search (_val) {
        console.log('Start searching for', _val)
    }

    /**
     * Clear ALL (Escapable) Modals
     */
    clearModals () {
        // $('#modalAlert').modal('hide')
        // $('#modalDebug').modal('hide')
        // $('#modalWait').modal('hide')
    }

    /**
     * Modal Alert Handler
     */
    alert (_title, _subtitle, _body, _success) {
        /* Clear open modals. */
        this.clearModals()

        /* Show ALERT permission modal. */
        $('#modalAlert').modal({
            backdrop: true,
            keyboard: true
        })

        /* Set modal details. */
        $('.modalAlertTitle').html(_title)
        $('.modalAlertSubtitle').html(_subtitle)
        $('.modalAlertBody').html(_body)

        /* Return success. */
        return _success
    }

    /**
     * Signs a (data) proof provided by the server for account authentication.
     */
    async signAuth (_proof) {
        console.log('SIGNATURE PROOF', _proof)
        /* Initialize a new web3 object to our provider. */
        // const web3 = new Web3()

        // TEMP FOR DEVELOPMENT/TESTING PURPOSES ONLY
        // const privateKey = '0x9b2495bf3d9f3116a4ec7301cc2d8cd8c9d86b4f09b813a8455d8db18d6eb00' // 0xF51175cF846f88b9419228905d63dcDd43aeC9E8 (invalid)
        // const privateKey = '9b2495bf3d9f3116a4ec7301cc2d8cd8c9d86b4f09b813a8455d8db18d6eb00d' // 0xC3e7b7f10686263f13fF2fA2313Dc00c2592481d (invalid)
        const privateKey = '0x9b2495bf3d9f3116a4ec7301cc2d8cd8c9d86b4f09b813a8455d8db18d6eb00d' // 0x65C44EcAc56040a63da60bf5cA297951780eFEd1 (valid)
        // console.log('PRIVATE KEY', privateKey)

        // let privateKey = "0x3141592653589793238462643383279502884197169399375105820974944592"
        let wallet = new ethers.Wallet(privateKey)

        /* Create the signature by signing the proof with private key. */
        const signature = await wallet.signMessage(_proof)
        console.log('SIGNATURE', signature)
        // const signature = web3.eth.accounts.sign(_proof, privateKey)

        /* Return the signed proof. */
        return signature
    }

    /**
     * Verify Configuration (content.json)
     */
    verifyConfig (_config) {
        /**
         * Escape unicode characters.
         * Converts to a string representation of the unicode.
         */
        const escapeUnicode = function (_str) {
            return _str.replace(/[^\0-~]/g, function (ch) {
                return '\\u' + ('000' + ch.charCodeAt().toString(16)).slice(-4)
            })
        }

        /* Retrieve address. */
        const address = _config.address

        /* Retrieve the signature. */
        const signature = _config.signs[address]

        /* Delete signs (as we can't verify ourselves in the signature). */
        delete _config.signs

        /* Convert the JSON to a string. */
        // NOTE: This matches the functionality of Python's `json.dumps` spacing.
        _config = JSON.stringify(_config).replace(/":/g, '": ').replace(/,"/g, ', "')

        /* Escape all unicode characters. */
        // NOTE: This matches the functionality of Python's `unicode` handling.
        _config = escapeUnicode(_config)

        // NOTE This is a time extensive process, so let's NOT block the event loop.
        return new Promise((_resolve, _reject) => {
            /* Verify the Bitcoin signature. */
            const isValid = BitcoinMessage.verify(_config, address, signature)

            /* Resolve the result. */
            _resolve(isValid)
        })
    }

    /**
     * Image Converter
     */
    imgConverter (_input) {
        /* Initialize input (typed array). */
        const uInt8Array = new Uint8Array(_input)

        /* Initialize length counter. */
        let i = uInt8Array.length

        /* Initialize binary string holder. */
        let biStr = [] //new Array(i);

        /* Perform byte(s) conversion. */
        while (i--) {
            biStr[i] = String.fromCharCode(uInt8Array[i])
        }

        /* Convert to base64. */
        const base64 = window.btoa(biStr.join(''))

        /* Return base64. */
        return base64
    }

    /**
     * Verify Torrent Metadata
     *
     * NOTE A torrent's info hash is derived from its metadata.
     */
    verifyMetadata (_infoHash, _metadata) {
        /* Convert the metadata to a buffer. */
        const metadata = Buffer.from(_metadata, 'hex')

        /* Decode the metadata buffer using bencode. */
        const decoded = Bencode.decode(metadata)
        // console.log('DECODED (RAW)', typeof decoded, decoded)

        /* Retrieve the torrent info. */
        const torrentInfo = decoded['info']
        // console.log('Torrent INFO', torrentInfo)

        /* Encode torrent info. */
        const encoded = Bencode.encode(torrentInfo)
        // console.log('Encoded torrent info', encoded)

        /* Calculate verification hash (from encoded metadata). */
        const verificationHash = _calcInfoHash(encoded)
        console.info(`Calculated the verification hash [ ${verificationHash} ]`)

        /* Validate verficiation hash. */
        if (verificationHash === _infoHash) {
            return torrentInfo
        } else {
            return null
        }
    }

    /**
     * Require File (from Zeronet)
     */
    async requireFile  (_dest, _config, _innerPath) {
        /* Initialize action. */
        let action = null

        /* Initialize package. */
        let pkg = null

        /* Initailize database name. */
        let dbName = null

        /* Validate inner path. */
        if (_config['files'][_innerPath]) {
            dbName = 'files'
        } else if (_config['files_optional'][_innerPath]) {
            dbName = 'optional'
        }

        /* Validate database name. */
        if (!dbName) {
            return console.error(`[ ${_innerPath} ] NOT FOUND in config.`, _config)
        }

        /* Set data id. */
        const dataId = `${_dest}:${_innerPath}`

        this.addLog(`Requesting [ ${dataId} ] from [ ${dbName} ]`)

        /* Request file data. */
        const fileData = await _dbRead(dbName, dataId)

        /* Validate file data. */
        if (fileData) {
            /* Validate file data. */
            const isValid = _validateFileData(_config, fileData['data'], _innerPath)

            if (isValid) {
                this.addLog(`Validated [ ${dataId} ] [ ${numeral(fileData['data'].length).format('0,0') || 0} bytes ] from [ ${dbName} ].`)

                /* Parse and handle the data type (required or optional). */
                // FIXME Better way to handle dynamic zerovue file data??
                if (dbName === 'optional') {
                    let pkg = {
                        action: 'update',
                        elem: _innerPath,
                        body: fileData['data']
                    }

                    /* Send update to ZeroVue. */
                    _zerovueMsg(pkg)
                } else {
                    /* Add file data to zite manager. */
                    // NOTE We store required file data (locally) in memory.
                    App.ziteMgr[_dest]['data'][_innerPath] = fileData['data']
                }
            } else {
                this.addLog(`[ ${dataId} ] FAILED VALIDATION, now requesting from [ Supeer ]`)

                /* Set action. */
                action = 'GET'

                /* Build package. */
                pkg = { action, dataId }

                /* Send message request. */
                this.message.send(pkg)

                // console.error(`[ ${dataId} ] [ ${numeral(fileData['data'].length).format('0,0') || 0} bytes ] FAILED VALIDATION from [ ${dbName} ]`)

                // break
            }
        } else {
            this.addLog(`[ ${dataId} ] NOT IN DB, now requesting from [ Supeer ]`)

            /* Set action. */
            action = 'GET'

            /* Build package. */
            pkg = { action, dataId }

            /* Send message request. */
            this.message.send(pkg)
        }
    }

    /**
     * Parse File Data
     *
     * NOTE Decoding file data (primarily for UI display).
     */
    formatFileData (_data, _fileExt) {
        if (typeof _data === 'undefined') {
            return null
        }

        switch (_fileExt.toUpperCase()) {
        // TODO Add support for ALL raw string formats.
        case '': // NOTE Support for extension-less files (eg LICENSE).
        //               Are there ANY binary files in this category??
        case 'CSS':
        case 'HTM':
        case 'HTML':
        case 'JS':
        case 'MD':
        case 'TXT':
        case 'XML':
            _data = Buffer.from(_data).toString()
            break
        case 'GIF':
            _data = `data:image/gif;base64,${_imgConverter(_data)}`
            break
        case 'JPG':
        case 'JPEG':
            _data = `data:image/jpeg;base64,${_imgConverter(_data)}`
            break
        case 'PNG':
            _data = `data:image/png;base64,${_imgConverter(_data)}`
            break
        default:
            // NOTE Leave as buffer (for binary files).

            // TODO Decide if we want to default to BINARY or STRING
            //      for any UNKNOWN file types.
        }

        return _data
    }

    /**
     * Validate File Data
     */
    validateFileData (_config, _fileData, _innerPath) {
        /* Initialize files. */
        let files = null

        /* Validate inner path. */
        if (_config['files'][_innerPath]) {
            files = _config['files']
        } else if (_config['files_optional'][_innerPath]) {
            files = _config['files_optional']
        }

        /* Validate files. */
        if (!files) {
            this.addLog(`${_innerPath} NOT FOUND in [ files OR files_optional ]`)

            return false
        }

        /* Set (configuraton) file size. */
        const configSize = files[_innerPath].size

        /* Set (configuration) hash. */
        const configHash = files[_innerPath].sha512

        // console.log(`${_innerPath} size/hash`, configSize, configHash)

        /* Calculate file size. */
        const fileSize = parseInt(_fileData.length)
        // console.log(`File size/length [ ${fileSize} ]`)

        /* Calculate file verifcation hash. */
        const fileHash = _calcFileHash(_fileData)
        // console.log(`File verification hash [ ${fileHash} ]`)

        /* Initialize valid flag. */
        let isValid = false

        /* Verify the signature of the file. */
        if (configSize === fileSize && configHash === fileHash) {
            isValid = true
        }

        this.addLog(`${_innerPath} validation is [ ${isValid} ]`)

        return isValid
    }

    /**
     * Parse Database Schema (used by ZeroNet Core)
     */
    parseDbSchema (_dbSchema) {
        try {
            /* Parse the JSON data. */
            const dbSchema = JSON.parse(Buffer.from(_dbSchema))

            /* Set name. */
            const name = dbSchema['db_name']

            /* Set filename. */
            const filename = dbSchema['db_file']

            /* Set version. */
            const version = dbSchema['version']

            /* Set maps. */
            const maps = dbSchema['maps']

            /* Build package. */
            const pkg = {
                name, filename, version, maps
            }

            /* Return package. */
            return pkg
        } catch (_err) {
            console.error('ERROR: Parsing JSON [dbschema.json]', _err, _dbSchema)

            return null
        }
    }

    /**
     * Retrieve Querystring Parameter (by name)
     */
    getParameterByName (name, url) {
        if (!url) url = window.location.href

        name = name.replace(/[\[\]]/g, '\\$&')

        const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)')

        const results = regex.exec(url)

        if (!results) return null

        if (!results[2]) return ''

        return decodeURIComponent(results[2].replace(/\+/g, ' '))
    }

    /**
     * Test Connection
     */
    testConnection () {
        console.log('HOST wants to test the connection from UI')

        this.authGatekeeper()
    }

    /**
     * Test D14na Index
     */
    testD14naIndex () {
        console.log('Testing D14na Index')


    }

    /**
     * Send UI Message
     */
    uiMsg (message = {}) {
        console.log('SENDING MESSAGE TO UI', message)
        ZeroVue.UI.send('message', message)
        // this.UI.send('message', 'btw, the DOM is ready to go!!')

    }

    /**
     * Handle (Supeer) Message
     */
    async handleMessage (_data) {
        /* Initialize handler. */
        let handler = null

        try {
            /* Parse incoming message. */
            let data = JSON.parse(_data)

            console.log('Received Supeer data:', data)

            /* Validate message. */
            if (!data) {
                return this.addLog(`Error processing [ ${JSON.stringify(data)} ]`)
            }

            /* Validate response. */
            if (data.error) {
                /* Show alert. */
                return this.alert(
                    'Supeer Network Error',
                    data.error,
                    'Please try your request again..',
                    false
                )
            }

            /* Initialize action. */
            let action = null

            /* Retrieve the action from requests manager. */
            if (data.search) {
                action = 'SEARCH'
            } else if (data.action) {
                /* Set action. */
                action = data.action
            } else {
                /* Retrieve action from saved request. */
                action = this.getAction(data)
            }

            console.log(`Retrieved ACTION [ ${action} ] from message.`)

            /* Validate action. */
            if (!action) {
                return this.errorHandler(`No ACTION was found for [ ${JSON.stringify(data)} ]`, false)
            }

            /* Initialize (data) managers. */
            let body = null
            let dest = null
            let pkg = null

            switch (action.toUpperCase()) {
            case 'AUTH':
                /* Initialize handler. */
                let handler1 = require('./host/handlers/_auth.js')

                /* Bind context to handler. */
                handler1 = handler1.bind(this)

                /* Handle response. */
                return handler1(data)
            case 'GET':
                if (data.dest && data.innerPath) { // Zeronet
                    /* Retrieve destination. */
                    dest = data.dest

                    /* Validate dest. */
                    if (!dest || dest.slice(0, 1) !== '1' || (dest.length !== 33 && dest.length !== 34)) {
                        return this.addLog(`${dest} is an invalid public key.`)
                    }

                    /* Verify config file. */
                    if (data.innerPath === 'content.json') {
                        return _handleConfig(data)
                    } else {
                        return _handleZeroFile(data)
                    }
                } else if (data.infoHash && data.metadata) { // Torrent
                    /* Verify info file. */
                    if (data.dataId.split(':')[1] === 'torrent') {
                        return _handleInfo(data)
                    }
                } else if (data.dataId && data.requestMgr) { // Torrent
                    // TODO Handle an "immediate" response to our request.
                    //      Already in 0NET cache and no need to wait for seeders.
                    console.log('BLOCK REQUEST MANAGER', data.requestMgr)
                } else if (data.dataId && data.blockBuffer) { // Torrent
                    /* Handle response. */
                    return _handleBlock(data)
                } else {
                    return this.addLog(`ERROR processing GET request for [ ${JSON.stringify(data)} ]`)
                }

                break
            case 'NOTIF':
                /* Handle response. */
                return this.msgList.push(data)
            case 'SEARCH':
                /* Handle response. */
                return _handleSearch(data)
            case 'WHOAMI':
                /* Initialize handler. */
                handler = require('./host/handlers/_whoAmI.js')

                /* Bind context to handler. */
                handler = handler.bind(this)

                /* Handle response. */
                return handler(data)
            default:
                // nothing to do here
            }
        } catch (_err) {
            this.errorHandler(_err, false)
        }
    }

    /**
     * Authorize Gatekeeper
     */
    async authGatekeeper () {
        /* Show "connecting.." notification. */
        await this.wait('Starting New Session', 'This will only take a moment.', 'Please wait..')

        /* Validate application initialization. */
        if (!this.gateReady) {
            setTimeout(() => {
                /* Send empty message to the zerovue for initialization. */
                this.uiMsg()
            }, 1000)
        }
    }

    /**
     * Modal Wait Handler
     */
    wait (_title, _subtitle, _body = '', _success = false) {
        console.log('TODO: WAIT MODAL', _title, _subtitle, _body, _success)
        /* Clear open modals. */
        // this.clearModals()

        /* Show WAIT permission modal. */
        // $('#modalWait').modal({
        //     backdrop: true,
        //     keyboard: true
        // })

        /* Set modal details. */
        // $('.modalWaitTitle').html(_title)
        // $('.modalWaitSubtitle').html(_subtitle)
        // $('.modalWaitBody').html(_body)

        // return new Promise((_resolve, _reject) => {
        //     // NOTE Wait a lil' bit before displaying "intermittent" modal.
        //     setTimeout(() => {
        //         /* Resolve success. */
        //         _resolve(_success)
        //     }, 500)
        // })
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
