const exists = require('fs').existsSync
const path = require('path')
const getGitUser = require('./git-user')

module.exports = function options (name, dir) {
    const opts = getMetadata(dir)
    setDefault(opts, 'name', name)
    const author = getGitUser()
    if (author) {
        setDefault(opts, 'author', author)
    }
    return opts
}

function getMetadata (dir) {
    const js = path.join(dir, 'meta.js')
    const json = path.join(dir, 'meta.json')
    let opts = {}
    if (exists(json)) {
        // TODO
    } else if (exists(js)) {
        const req = require(path.resolve(js))
        opts = req
    }
    return opts
}

function setDefault (opts, key, val) {
    const prompts = opts.prompts || (opts.prompts = {})
    prompts[key]['default'] = val
}
