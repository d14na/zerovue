/**
 * Require File (from Zeronet)
 */
const requireFile = async function  (_dest, _config, _innerPath) {
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
            this.sendMessage(pkg)

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
        this.sendMessage(pkg)
    }
}

module.exports = requireFile
