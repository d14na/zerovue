/**
 * Hanlde Zeronet File
 */
const _handleZeroFile = async function (_data) {
    /* Validate configuration (content.json). */
    if (!ZeroVue.ziteMgr[_data.dest]) {
        /* Create a new manager for zite. */
        ZeroVue.ziteMgr[_data.dest] = {}
    }

    console.log('HANDLING ZERO FILE [ziteMgr]', ZeroVue.ziteMgr[_data.dest], _data)

    /* Initialize config. */
    let config = null

    /* Retrieve configuration. */
    config = ZeroVue.ziteMgr[_data.dest]['config']
    // console.log('FOUND CONFIG', config)

    /* Validate config. */
    if (!config || !config.files) {
        /* Try to retrieve from db. */
        config = await _dbRead('main', `${_data.dest}:content.json`)

        // console.log('WHAT DID WE FIND IN THE DB for:', `${_data.dest}:content.json`, config)

        /* Re-validate config. */
        if (!config || !config.data) {
            return this.addLog('No config found in Zite Manager.')
        } else {
            config = config.data

            /* Initialize zite file data. */
            ZeroVue.ziteMgr[_data.dest]['data'] = {}

            /* Set zite config (content.json). */
            ZeroVue.ziteMgr[_data.dest]['config'] = config

            /* Initialize zite (display) body. */
            ZeroVue.ziteMgr[_data.dest]['body'] = ''
        }
    }

    /* Set inner path. */
    const innerPath = _data.innerPath

    /* Validate inner path. */
    if (!innerPath) {
        return this.addLog(`Problem retrieving inner path [ ${innerPath} ]`)
    }

    /* Initialize file data. */
    let fileData = null

    /* Parse file data (into buffer). */
    if (_data.body) {
        fileData = Buffer.from(_data.body)
    }

    /* Validate file data. */
    const isValid = await this.validateFileData(config, fileData, innerPath)

    /* Validate file data. */
    if (isValid) {
        /* Initailize database name. */
        let dbName = null

        /* Validate inner path. */
        if (config['files'][innerPath]) {
            dbName = 'files'
        } else if (config['files_optional'][innerPath]) {
            dbName = 'optional'
        }

        /* Validate database name. */
        if (!dbName) {
            return console.error(`[ ${innerPath} ] NOT FOUND in config.`, config)
        }

        /* Set data id. */
        const dataId = `${_data.dest}:${_data.innerPath}`

        /* Write to database. */
        _dbWrite(dbName, dataId, fileData)

        /* Initialize file extension. */
        // NOTE Some files (eg. LICENSE, do not have extensions).
        let fileExt = ''

        if (innerPath.indexOf('.') !== -1) {
            /* Retrieve the file extention. */
            fileExt = innerPath.split('.').pop()
        }

        /* Add file data to zite manager. */
        ZeroVue.ziteMgr[_data.dest]['data'][innerPath] = fileData
    } else {
        /* Generate error body. */
        console.error(`[ ${innerPath} ] file verification FAILED!`)
        console.error({ configSize, fileSize, configHash, fileHash })
        console.error(Buffer.from(_data['body']).toString())
    }
}
