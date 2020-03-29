const yaml = require('js-yaml')
const fse = require('fs-extra')
const path = require('path')

// Loads and parses the game yaml
module.exports = (function () {
  return yaml.safeLoad(fse.readFileSync(path.join(__dirname, './SequenceGameData.yml')))
}())
