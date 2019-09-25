/**
 * Verify Torrent Metadata
 *
 * NOTE A torrent's info hash is derived from its metadata.
 */
const parseMetadata = function (_infoHash, _metadata) {
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
    const verificationHash = ZeroUtils.calcInfoHash(encoded)
    console.log(`Calculated the verification hash [ ${verificationHash} ]`)

    /* Validate verficiation hash. */
    if (verificationHash === _infoHash) {
        return torrentInfo
    } else {
        return null
    }
}

module.exports = parseMetadata
