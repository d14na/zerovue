/**
 * Search
 *
 * Handles ALL submissions from the Zite | Search input.
 *
 * Currently Supported Request Types:
 *     1. Zeronet (zitetags, publickeys, bigfiles, etc).
 *     2. Torrent (info hash)
 *     3. IPFS (cid)
 */
const search = async function (_query) {
    /* Set (local) query. */
    const query = _query

    this.addLog(`Searching for [ ${query} ]`)

    return ZeroVue.updateWebSource(`Sooo, you're looking for some [ ${_query} ]?`)

    /* Show "connecting.." notification. */
    await wait('Peer-to-Peer Search', `Processing request for<br />[ <strong class="text-primary">${query}</strong> ]`, 'Please wait..')

    /* Initialize (data) managers. */
    let action = null
    let dataId = null
    let dest = null
    let infoHash = null
    let innerPath = null
    let params = null
    let pkg = null

    /* Basic validation. */
    if (!query || query === '' || !query.length) {
        return
    }

    /* Validate search query. */
    if (query.slice(0, 10).toUpperCase() === 'DEBUG.MENU') {
        /* Clear open modals. */
        // this.clearModals()

        /* Show ADMIN permission modal. */
        $('#modalDebug').modal({
            backdrop: 'static',
            keyboard: false
        })

        /* Reset search. */
        ZeroVue.resetSearch()
    } else if (query.slice(0, 8).toUpperCase() === 'GET.FILE' && query.length > 11) {
        /* Set action. */
        action = 'GET'

        /* Retrieve request parameters. */
        params = query.slice(9)

        /* Retrieve destination. */
        dest = params.split(':')[0]

        /* Retrieve inner path. */
        innerPath = params.split(':')[1]

        /* Set data id. */
        dataId = params

        /* Build package. */
        pkg = { action, dataId }
    } else if (query.slice(0, 1) === '1' && (query.length === 33 || query.length === 34)) {
        /* Set action. */
        action = 'GET'

        /* Set destination. */
        dest = query

        /* Set inner path. */
        innerPath = 'content.json'

        /* Set data id. */
        dataId = `${dest}:${innerPath}`

        /* Build package. */
        pkg = { action, dataId }
    } else if (query.length === 40) {
        /* Set action. */
        action = 'GET'

        /* Set info hash. */
        infoHash = query

        /* Set inner path. */
        innerPath = 'torrent'

        /* Set data id. */
        dataId = `${infoHash}:${innerPath}`

        /* Build package. */
        pkg = { action, dataId }
    } else if (query.slice(0, 20) === 'magnet:?xt=urn:btih:') {
        /* Set action. */
        action = 'GET'

        /* Retrieve info hash. */
        infoHash = query.slice(20, 60)

        /* Set inner path. */
        innerPath = 'torrent'

        /* Set data id. */
        dataId = `${infoHash}:${innerPath}`

        /* Build package. */
        pkg = { action, dataId }
    } else {
        /* Set action. */
        action = 'SEARCH'

        /* Build package. */
        pkg = { action, query }
    }

    /* Send package. */
    if (this.sendMessage(pkg)) {
        /* Reset search. */
        ZeroVue.resetSearch()
    }
}

module.exports = search
