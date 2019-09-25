/**
 * Image Converter
 */
const imgConverter = function (_input) {
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

module.exports = imgConverter
