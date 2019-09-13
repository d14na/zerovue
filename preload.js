// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {

    setTimeout(() => {
        document.getElementById('testArea').innerHTML = document.getElementById('testArea').innerHTML + '<br />hi, i waited 3 seconds, now am here to preload'
    }, 3000)

    window.startTest = () => {
        console.log('starting test..')
        alert('starting test..')
        document.getElementById('testArea').innerHTML = document.getElementById('testArea').innerHTML + '<br />hi, you started it, so i am here to preload'
    }

    window.finalTest = (_val) => {
        document.getElementById('testArea').innerHTML = document.getElementById('testArea').innerHTML + '<br />' + _val
    }

})
