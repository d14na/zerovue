/**
 * Parse Database Schema (used by ZeroNet Core)
 */
const parseDbSchema = function (_dbSchema) {
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

module.exports = parseDbSchema
