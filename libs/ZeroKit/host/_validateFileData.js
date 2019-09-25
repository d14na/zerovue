/**
 * Validate File Data
 */
const validateFileData = function (_config, _fileData, _innerPath) {
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

module.exports = validateFileData
