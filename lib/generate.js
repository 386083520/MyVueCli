const Metalsmith = require('metalsmith')
const path = require('path')
const chalk = require('chalk')
const async = require('async')
const Handlebars = require('handlebars') // 轻量的语义化模板
const render = require('consolidate').handlebars.render
const ask = require('./ask')
const filter = require('./filter')
const getOptions = require('./options')
const logger = require('./logger')

Handlebars.registerHelper('if_eq', function (a, b, opts) {
    return a === b
        ? opts.fn(this)
        : opts.inverse(this)
})

module.exports = function generate (name, src, dest, done) {
    console.log('gsdgenerate', name, src, dest)
    const opts = getOptions(name, src)
    const metalsmith = Metalsmith(path.join(src, 'template'))
    opts.helpers && Object.keys(opts.helpers).map(key => {
        Handlebars.registerHelper(key, opts.helpers[key])
    })
    const helpers = { chalk, logger }

    if (opts.metalsmith && typeof opts.metalsmith.before === 'function') {
        opts.metalsmith.before(metalsmith, opts, helpers)
    }

    metalsmith
        .use(askQuestions(opts.prompts))
        .use(filterFiles(opts.filters))
        .use(renderTemplateFiles(opts.skipInterpolation))
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

function renderTemplateFiles(skipInterpolation) {
    return (files, metalsmith, done) => {
        const keys = Object.keys(files)
        const metalsmithMetadata = metalsmith.metadata()
        async.each(keys, (file, next) => {
            const str = files[file].contents.toString()
            if (!/{{([^{}]+)}}/g.test(str)) { // {{aaa}}
                return next()
            }
            render(str, metalsmithMetadata, (err, res) => {
                if (err) {
                    return next(err)
                }
                files[file].contents = new Buffer.from(res)
                next()
            })
        }, done)
    }
}
