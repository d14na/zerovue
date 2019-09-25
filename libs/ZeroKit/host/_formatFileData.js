/**
 * Parse File Data
 *
 * NOTE Decoding file data (primarily for UI display).
 */
const formatFileData = function (_data, _fileExt) {
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

module.exports = formatFileData
