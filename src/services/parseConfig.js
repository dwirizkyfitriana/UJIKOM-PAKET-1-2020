let Parse = require('parse')

const ParseURL = process.env.VUE_APP_SERVER_URL
const ParseAppId = process.env.VUE_APP_APP_ID
const ParseJSKey = process.env.VUE_APP_JS_KEY
const ParseMasterKey = process.env.VUE_APP_MASTER_KEY

let isInit = false

let init = async () => {
    if (isInit) {
        return Parse
    }

    // console.log('Init Parse')
    Parse.initialize(ParseAppId, ParseJSKey)
    Parse.serverURL = ParseURL
    Parse.masterKey = ParseMasterKey
    isInit = true
    return Parse
}

init()

export { Parse }
