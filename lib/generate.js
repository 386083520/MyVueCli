const Metalsmith = require('metalsmith')
const path = require('path')
const ask = require('./ask')
const getOptions = require('./options')

module.exports = function generate (name, src, dest, done) {
    console.log('gsdgenerate', name, src, dest)
    const opts = getOptions(name, src)
    const metalsmith = Metalsmith(path.join(src, 'template'))
    metalsmith.use(askQuestions(opts.prompts))
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
