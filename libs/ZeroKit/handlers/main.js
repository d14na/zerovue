/**
 * Handle Unknown Requests
 *
 * NOTE Currently this is un-implemented.
 */
const _handleUnknown = function (_data) {
    console.error('UNKNOWN REQUEST HANDLER', _data)
    return // FIXME We may not implement this report

    /* Format body. */
    const body = `<pre><code>
<h3>${dataId}</h3>
<hr />
${JSON.stringify(data, null, 4)}
    </code></pre>`

    /* Clear modals. */
    // this.clearModals()
}
