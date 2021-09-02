const Metalsmith = require('metalsmith')
const path = require('path')
const chalk = require('chalk')
const Handlebars = require('handlebars')
const getOptions = require('./options')
const logger = require('./logger')
const ask = require('./ask')
const filter = require('./filter')

module.exports = function generate (name, src, dest, done) {
    console.log('gsdgenerate', name, src, dest, done)
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

    const helpers = { chalk, logger }
    if (opts.metalsmith && typeof opts.metalsmith.before === 'function') {
        console.log('gsdmetalsmith')
        opts.metalsmith.before(metalsmith, opts, helpers)
    }
    metalsmith.use(askQuestions(opts.prompts))
        .use(filterFiles(opts.filters))
        // .use(renderTemplateFiles(opts.skipInterpolation))

    /*if (typeof opts.metalsmith === 'function') {
        opts.metalsmith(metalsmith, opts, helpers)
    } else if (opts.metalsmith && typeof opts.metalsmith.after === 'function') {
        opts.metalsmith.after(metalsmith, opts, helpers)
    }

    metalsmith.clean(false)
        .source('.')
        .destination(dest)
        .build((err, files) => {
            done(err)
            if (typeof opts.complete === 'function') {
                const helpers = { chalk, logger, files }
                opts.complete(data, helpers)
            } else {
                logMessage(opts.completeMessage, data)
            }
        })

    return data*/
}

function askQuestions (prompts) {
    return (files, metalsmith, done) => {
        ask(prompts, metalsmith.metadata(), done)
    }
}

function filterFiles (filters) {
    return (files, metalsmith, done) => {
        filter(files, filters, metalsmith.metadata(), done)
    }
}
