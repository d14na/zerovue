// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

/* Initialize IPC. */
const ipc = require('electron').ipcRenderer

/* Initialize VueJS application. */
const app = new Vue({
    el: '#app',
    // data: {
    //     zerovue: null,
    //     navGreeting: 'Welcome! This is an early preview of the ZeroVue Rendering Engine.',
    //     mySource: '',
    //     preload: 'file:'
    // }
    data: () => ({
        zerovue: null,
        navGreeting: 'Welcome! This is an early preview of the ZeroVue Rendering Engine.',
        mySource: '',
        preload: 'file:'
    }),
    computed: {
        //
    },
    methods: {
        open (link) {
            this.$electron.shell.openExternal(link)
        },
        home () {
            console.log('go home')
        },
        openFile () {
            ipc.send('open-file-dialog')
        }
    },
    mounted: function () {
        const fpath = require('path')

        const {app} = require('electron').remote

        app.on('start_debugger', function (event) {
            console.log('HOME wants to start the debugger')
        })

        ipc.on('got-app-path', (event, path) => {
            console.log('PATH', path)
            // const rootPath = path.slice(0, path.indexOf('node_modules'))
            // console.log('ROOT PATH', rootPath)

            /* Insert pre-loaded script. */
            // TODO This will be ZeroKit
            this.preload = fpath.join(
                'file://',
                path,
                '/preload.js'
            )

            console.log('this.preload', this.preload)

            this.mySource = `data:text/html,
How much <strong>HTML</strong> can we fit in here??
<div id="testArea"><!-- test area --></div>
<button class="uk-button uk-button-danger uk-button-small" onclick="document.getElementById('testArea').innerHTML='<b>hi-there</b>'">Start Test</button>
<button class="uk-button uk-button-danger uk-button-small" onclick="startTest()">Start PRELOAD Test</button>
<style></style>
            `
        })

        this.zerovue = document.querySelector('webview')
        console.log('this.zerovue', this.zerovue)
        // const indicator = document.querySelector('.indicator')

        // const loadstart = () => {
        //     console.log('loadstart')
        //     // indicator.innerText = 'loading...'
        // }

        // const loadstop = () => {
        //     console.log('loadstop')
        //     // indicator.innerText = ''
        // }

        // this.zerovue.addEventListener('did-start-loading', loadstart)
        // this.zerovue.addEventListener('did-stop-loading', loadstop)

        ipc.send('get-app-path')

        // setTimeout(() => {
        //     console.log('this.zerovue [INNER]', this.zerovue)
        //     this.zerovue.executeJavaScript(`finalTest('hi again!')`)
        // }, 5000)
    }
})
