const metadata = require('read-metadata')
const path = require('path')
const exists = require('fs').existsSync
const getGitUser = require('./git-user')
const validateName = require('validate-npm-package-name')

module.exports = function options (name, dir) {
    console.log('gsdoptions', name, dir)
    const opts = getMetadata(dir)
    setDefault(opts, 'name', name)
    setValidateName(opts)
    const author = getGitUser()
    console.log('gsdauthor', author)
    if (author) {
        setDefault(opts, 'author', author)
    }
    return opts
}

function getMetadata (dir) {
    const json = path.join(dir, 'meta.json')
    const js = path.join(dir, 'meta.js')
    let opts = {}
    if (exists(json)) {
        opts = metadata.sync(json)
    } else if (exists(js)) {
        const req = require(path.resolve(js))
        if (req !== Object(req)) {
            throw new Error('meta.js needs to expose an object')
        }
        opts = req
    }
    return opts
}

function setDefault (opts, key, val) {
    if (opts.schema) {
        opts.prompts = opts.schema
        delete opts.schema
    }
    const prompts = opts.prompts || (opts.prompts = {})
    if (!prompts[key] || typeof prompts[key] !== 'object') {
        prompts[key] = {
            'type': 'string',
            'default': val
        }
    } else {
        prompts[key]['default'] = val
    }
}

function setValidateName (opts) {
    const name = opts.prompts.name
    const customValidate = name.validate
    console.log('gsdcustomValidate', name)
    name.validate = name => {
        const its = validateName(name)
        console.log('gsdits', its)
        if (!its.validForNewPackages) {
            const errors = (its.errors || []).concat(its.warnings || [])
            return 'Sorry, ' + errors.join(' and ') + '.'
        }
        if (typeof customValidate === 'function') return customValidate(name)
        return true
    }

}