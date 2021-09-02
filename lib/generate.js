const Metalsmith = require('metalsmith')
const path = require('path')
const Handlebars = require('handlebars')
const getOptions = require('./options')
module.exports = function generate (name, src, dest, done) {
    const opts = getOptions(name, src)
    const metalsmith = Metalsmith(path.join(src, 'template'))
    const data = Object.assign(metalsmith.metadata(), {
        destDirName: name,
        inPlace: dest === process.cwd(),
        noEscape: true
    })
    console.log('gsddata', data)
    opts.helpers && Object.keys(opts.helpers).map(key => {
        console.log('gsdkey', key)
        console.log('gsdhelpers', opts.helpers[key])
        Handlebars.registerHelper(key, opts.helpers[key])
    })
}
