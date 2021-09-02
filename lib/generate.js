const Metalsmith = require('metalsmith')
const path = require('path')
const ask = require('./ask')
const filter = require('./filter')
const getOptions = require('./options')

module.exports = function generate (name, src, dest, done) {
    console.log('gsdgenerate', name, src, dest)
    const opts = getOptions(name, src)
    const metalsmith = Metalsmith(path.join(src, 'template'))
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
