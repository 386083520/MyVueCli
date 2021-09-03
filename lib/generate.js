const Metalsmith = require('metalsmith')
const path = require('path')
const chalk = require('chalk')
const ask = require('./ask')
const filter = require('./filter')
const getOptions = require('./options')
const logger = require('./logger')

module.exports = function generate (name, src, dest, done) {
    console.log('gsdgenerate', name, src, dest)
    const opts = getOptions(name, src)
    const metalsmith = Metalsmith(path.join(src, 'template'))

    const helpers = { chalk, logger }

    if (opts.metalsmith && typeof opts.metalsmith.before === 'function') {
        opts.metalsmith.before(metalsmith, opts, helpers)
    }

    metalsmith
        .use(askQuestions(opts.prompts))
        .use(filterFiles(opts.filters))
    metalsmith.clean(false)
        .source('.')
        .destination(dest)
        .build((err, files) => {
            if(err) {
                console.log(err)
            }
        })
}

function askQuestions (prompts) {
    console.log('gsdaskQuestions')
    return (files, metalsmith, done) => {
        ask(prompts, metalsmith.metadata(), done)
    }
}

function filterFiles (filters) {
    console.log('gsdfilterFiles')
    return (files, metalsmith, done) => {
        filter(files, filters, metalsmith.metadata(), done)
    }
}
