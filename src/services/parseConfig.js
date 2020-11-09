let Parse = require('parse')

const ParseURL = 'https://parseapi.back4app.com/parse'
const ParseAppId = 'UL9Pq2EaFmgdRtHIKiIWJeawi8620kHWJn7smqMu'
const ParseJSKey = 'NfzIfMmSreQKQ6JgnlDZgR8ksMnCs5eZfXTYufH6'
const ParseMasterKey = 'LYVIDbFHeJKqON9dqlOCUwsB5kiZIL4hSx5FLFpg'

let isInit = false;

let init = async () => {
  if (isInit) {
    return Parse;
  }

  // console.log('Init Parse')
  Parse.serverURL = ParseURL;
  Parse.initialize(ParseAppId, ParseJSKey);
  Parse.masterKey = ParseMasterKey
  isInit = true;
  return Parse;
};

init();

export { Parse }