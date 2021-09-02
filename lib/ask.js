const async = require('async')
module.exports = function ask (prompts, data, done) {
    console.log('gsdask', prompts, data, done)
    async.eachSeries(Object.keys(prompts), (key, next) => {
        prompt(data, key, prompts[key], next)
    }, done)
}

function prompt (data, key, prompt, done) {
    console.log('gsdprompt', data, key, prompt)
    done()
}
