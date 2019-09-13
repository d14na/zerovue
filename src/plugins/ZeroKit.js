/*******************************************************************************
 *
 * ZeroKit
 * -------
 *
 * UI Rendering Engine for Zeronet
 *
 */
class ZeroKit {
    constructor () {
        this.hi = 'there'

        // setTimeout(() => {
        //     document.getElementById('testArea').innerHTML = document.getElementById('testArea').innerHTML + '<br />hi, i waited 3 seconds, now am here to preload'
        // }, 3000)
    }

    classTest (_val) {
        console.log('starting CLASS test..', _val)
        alert('starting CLASS test.. ' + _val)
        // document.getElementById('testArea').innerHTML = document.getElementById('testArea').innerHTML + '<br />starting a brand new CLASS now!'
    }

    /**
     * Test Connection
     */
    testConnection () {
        console.log('Let\'s test the connection from SANDBOX')
    }

}


// console.log('ZeroKit', ZeroKit)

// zeroKit.classTest()
// console.log('zeroKit', zeroKit)

// window.alertTest = function (_val) {
//     alert(_val)
//     // document.getElementById('testArea').innerHTML = document.getElementById('testArea').innerHTML + '<br />' + _val
// }

// setTimeout(() => {
//     document.getElementById('testArea').innerHTML = document.getElementById('testArea').innerHTML + '<br />hi, i waited 3 seconds, now am here to preload'
// }, 3000)

// window.addEventListener('DOMContentLoaded', () => {
//     setTimeout(() => {
//         document.getElementById('testArea').innerHTML = document.getElementById('testArea').innerHTML + '<br />hi, i waited 3 seconds, now am here to preload'
//     }, 3000)
//
//     window.startTest = () => {
//         console.log('starting test..')
//         alert('starting test..')
//         document.getElementById('testArea').innerHTML = document.getElementById('testArea').innerHTML + '<br />hi, you started it, so i am here to preload'
//     }
//
//     window.finalTest = (_val) => {
//         document.getElementById('testArea').innerHTML = document.getElementById('testArea').innerHTML + '<br />' + _val
//     }
//
// })

/**
 * ZeroKit Global
 *
 * This supports pure JS implementations.
 *
 * NOTE: Used by the webview/iframe.
 */
window.zeroKit = new ZeroKit()

/**
 * ZeroKit Module
 *
 * This supports NodeJs and module implementations.
 *
 * NOTE: Used by the Browser (Parent) Window.
 */
exports.module = ZeroKit
