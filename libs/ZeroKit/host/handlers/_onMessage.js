/**
 * Event Listener: MESSAGE
 *
 * Receives and handles ALL incoming messages from our embedded iframe.
 *
 * WARNING Sandboxed iframes which lack the 'allow-same-origin'
 * header have "null" rather than a valid origin. This means we still
 * have to be careful about accepting data via the messaging API we've
 * created. We verify the source, and validate ALL inputs.
 */
const handler = async function (_event) {
    // console.log('INCOMING MESSAGE EVENT', _event)

    /* Retrieve origin. */
    const origin = _event.origin

    /* Retrieve source. */
    const source = _event.source

    /* Validate the message contents. */
    if (origin === 'null' && source === contentWindow) {
        /* Retrieve data. */
        const data = _event.data

        console.log('INCOMING EVENT DATA', data)

        /* Validate data. */
        if (data) {
            /* Handle any errors. */
            if (data.error) {
                return this.addLog(`Oops! We have a problem.\n\n${data.msg}`)
            }

            /* Handle any Api commands. */
            if (data.cmd && data.params) {
                /* Log all successful messages to console. */
                // this.addLog(`${data.cmd} : ${data.params}`)

                /* Initialize command. */
                let cmd = null

                /* Initialize to (request id). */
                let to = null

                /* Initialize result. */
                let result = null

                switch(data.cmd.toUpperCase()) {
                case 'FILEGET':
                    this.addLog('Received [ fileGet ]. Sending [ fileData ]')

                    /* Initialize file data holder. */
                    let fileData = null

                    /* Retrieve file data from zite manager. */
                    fileData = App.ziteMgr[App.destination]['data'][data.params]

                    console.log('RAW FILE DATA', fileData, App.ziteMgr)

                    /* Validate file data. */
                    if (!fileData) {
                        /* Set config. */
                        let config = App.ziteMgr[App.destination]['config']

                        /* Require the missing file. */
                        // FIXME Prevent against infinite looping.
                        return _requireFile(App.destination, config, data.params)
                    }

                    /* Format for display. */
                    // FIXME Support ALL file types.
                    fileData = _formatFileData(fileData, 'html')

                    // console.log('FILE DATA', fileData)

                    /* Set command. */
                    cmd = 'response'

                    /* Set to. */
                    to = data.id || data.params

                    /* Set result. */
                    result = fileData

                    return _zerovueMsg({ cmd, to, result })

                /**
                 * Database Get
                 *
                 * NOTE Allows for advanced data management of ANY JSON
                 *      file, including:
                 *          1. Queries
                 *          2. Filtering
                 *          3. Pagination
                 *
                 *      When possible the `sqlToMango` ORM library will be used
                 *      for backwards-compatibility.
                 */
                case 'DBGET':
                    console.log('DB GET', data.params)

                    this.addLog('Received [ dbGet ]. Sending [ sample movies ]')

                    break

                /**
                 * Database Query
                 *
                 * NOTE This is DEPRECATED in Zeronet (TLS), but is included
                 *      for compatibility with Zeronet (Core).
                 */
                case 'DBQUERY':
                    /* Set query. */
                    const query = data.params

                    /* Validate query. */
                    if (!query) {
                        console.error(`ERROR: No SQL found in [ ${JSON.stringify(data)} ]`)
                    }

                    console.log('DB QUERY', query)

                    sqliteParser(query[0], (_err, _ast) => {
                        if (_err) {
                            return console.error(_err)
                        }

                        console.log('DB QUERY [AST]', _ast)

                        // let body = `<pre>${JSON.stringify(_ast, null, 4)}</pre>`
                        // _zerovueMsg({ body })
                    })

                    this.addLog('Received [ dbQuery ]. Sending [ map/reduce data ]')

                    const stdMapping = {
                        map: (_doc) => {
                            // console.log('DOC', _doc)

                            if (_doc['_id'].match(/:data\/movies_.*.json/)) {
                                emit(null, _doc['json']['titles'])
                            }

                            if (_doc['_id'] === `${TEST_ZITE}:data/movie_data.json`) {
                                emit(null, _doc['json']['title_data'])
                            }
                        },
                        reduce: function (_keys, _docs) {
                            // console.log('KEYS', _keys)
                            // console.log('VALUES', _docs)

                            /* Initialize data. */
                            let data = {}

                            /* Initailize (array) SQL list. */
                            let sqlList = []

                            _docs.forEach(function (_doc) {
                                // console.log('DOCUMENT', _doc)

                                for (let _keyId in _doc) {
                                    // console.log('KEY ID', _keyId)

                                    /* Validate key id. */
                                    if (!data[_keyId]) {
                                        data[_keyId] = {}
                                    }

                                    Object.assign(data[_keyId], _doc[_keyId])
                                }
                            })

                            // console.log('Added _docs to data', data)

                            for (let _keyId in data) {
                                let formatted = {
                                    'imdb_id': _keyId,
                                    ...data[_keyId]
                                }

                                /* Push formatted to list. */
                                sqlList.push(formatted)
                            }

                            // console.log('SQL LIST', sqlList)

                            // return data
                            return sqlList
                        }
                    }

                    let options = {
                        // key: 'sample-view',
                        // startkey: ['sample-view'],
                        // endkey: ['sample-view', 2],
                    }

                    let found = await _dbManager['files']
                        .query(stdMapping, options)
                        .catch(function (_err) {
                            console.error(_err)
                        })

                    console.log('FOUND from [ stdMapping ]', found)

                    /* Set result. */
                    result = found['rows'][0]['value']

                    /* Filter result (based on parsed-SQL params). */
                    result = result.filter((_record) => {
                        return (
                            _record['peers'] > 30000
                        )
                    })
                    // result = result.filter((_record) => {
                    //     return (
                    //         _record['imdb_id'] === 'tt5095030' ||
                    //         _record['imdb_id'] === 'tt3766354' ||
                    //         _record['imdb_id'] === 'tt4649466' ||
                    //         _record['imdb_id'] === 'tt2250912' ||
                    //         _record['imdb_id'] === 'tt4154756'
                    //     )
                    // })

                    /* Set command. */
                    cmd = 'response'

                    /* Set to. */
                    to = data.id

                    return _zerovueMsg({ cmd, to, result })

                case 'INNERREADY':
                    this.addLog('Received [ innerReady ]. Sending [ wrapperOpenedWebsocket ]')

                    return _zerovueMsg({
                        cmd: 'wrapperOpenedWebsocket',
                        to: data.id,
                        result: null
                    })

                case 'SERVERINFO':
                    this.addLog('Received [ serverInfo ]. Sending [ Supeer sample ]')

                    cmd = 'response'

                    to = data.id

                    result = {
                        debug: false,
                        fileserver_ip: '*',
                        fileserver_port: 10443,
                        ip_external: false,
                        language: 'en',
                        platform: 'Supeer', // Supeer | Ghost | Supeer | Private | Web
                        plugins: [
                            'AnnounceLocal',
                            'AnnounceShare',
                            'AnnounceZero',
                            'Bigfile',
                            'Chart',
                            'ContentFilter',
                            'Cors',
                            'CryptMessage',
                            'FilePack',
                            'MergerSite',
                            'Newsfeed',
                            'OptionalManager',
                            'PeerDb',
                            // 'PeerMessage',
                            'Sidebar',
                            'Stats',
                            // 'Superuser',
                            // 'Sybil',
                            'TranslateSite',
                            'Trayicon',
                            'UiConfig',
                            'Zeroname'
                        ],
                        rev: 181003,
                        timecorrection: -5.038857062657674,
                        tor_enabled: false,
                        tor_has_meek_bridges: false,
                        tor_status: 'Error ([Errno 61] Connection refused)',
                        tor_use_bridges: false,
                        ui_ip: '127.0.0.1',
                        ui_port: 43110,
                        version: '18.10.3'
                    }

                    return _zerovueMsg({ cmd, to, result })

                case 'SITEINFO':
                    this.addLog('Received [ siteInfo ]. Sending [ ZeroCoding sample ]')

                    cmd = 'response'

                    to = data.id

                    result = {
                        address: '1CoDiNGYdEQX3PmP32K3pbZnrHJ2nWxXun',
                        auth_address: '13a49FcHd7AK4JF7vDvGrc98QnAYZraYFP',
                        auth_key: '3a2ba02c7813b4e92983cadc37cd06120fed5517a888ffe0509cb78da07e2703',
                        bad_files: 0,
                        cert_user_id: 'd14na.test@nametag.bit',
                        content: {
                            files: 22,
                            description: 'A full-stack integrated development environment (I…ecentralized applications (DApps) on the Zeronet.',
                            address: '1CoDiNGYdEQX3PmP32K3pbZnrHJ2nWxXun',
                            favicon: 'images/favicon.png',
                            includes: 0
                        },
                        content_updated: 1541169510.480437,
                        feed_follow_num: 1,
                        next_size_limit: 10,
                        peers: 18,
                        privatekey: false,
                        settings: {
                            ajax_key: '08e4a273df1e423886ff03cc6a00ca096f07ea098a463f386498d04dcf6ce71f',
                            added: 1535758717,
                            optional_downloaded: 0,
                            serving: true,
                            domain: 'zerocoding.bit'
                        },
                        size_limit: 10,
                        started_task_num: 0,
                        tasks: 0,
                        workers: 0
                    }

                    return _zerovueMsg({ cmd, to, result })

                case 'WRAPPERGETLOCALSTORAGE':
                    this.addLog('Received [ wrapperGetLocalStorage ]. Sending [ null ]')

                    cmd = 'response'

                    to = data.id

                    result = null

                    return _zerovueMsg({ cmd, to, result })

                case 'WRAPPERSETLOCALSTORAGE':
                    console.error('Writing to Local Storage is UNIMPLEMENTED!')

                    cmd = 'response'

                    to = data.id

                    result = null

                    return _zerovueMsg({ cmd, to, result })

                case 'WRAPPERGETSTATE':
                    this.addLog('Received [ wrapperGetState ]. Sending [ null ]')

                    cmd = 'response'

                    to = data.id

                    result = null // window.history.state

                    return _zerovueMsg({ cmd, to, result })

                default:
                    return console.error('Unhandled API event', data)
                }
            }

            /* Verify we have a successful message. */
            if (data.success) {
                /* Log all successful messages to console. */
                this.addLog(data.msg)

                /* Validate Iframe authorization. */
                if (data.msg === 'GATEKEEPER_IS_READY') {
                    /* Set Gatekeeper ready flag. */
                    gateReady = true

                    /* Connect to Supeer. */
                    _connect()
                }
            }
        } else {
            /* Report any communications error. */
            this.addLog('Oops! Something went wrong.' +
                  'We DID NOT receive the data we were looking for. ' +
                  'What we did receive was:<br /><br />' +
                  JSON.stringify(data))
        }
    }
}

/**
 * Send Gateway Message
 *
 * WARNING We're sending the message to "*", rather than some specific
 * origin. Sandboxed iframes which lack the 'allow-same-origin' header
 * don't have an origin which we can target.
 * (this might allow some "zero-day-style" esoteric attacks)
 */
// const _zerovueMsg = function (_message = {}) {
//     contentWindow.postMessage(_message, '*')
// }

module.exports = handler
