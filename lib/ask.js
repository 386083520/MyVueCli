const async = require('async')
const inquirer = require('inquirer')

const promptMapping = {
    string: 'input',
    boolean: 'confirm'
}

module.exports = function ask (prompts, data, done) {
    async.eachSeries(Object.keys(prompts), (key, next) => {
        prompt(data, key, prompts[key], next)
    }, done)
}


function prompt (data, key, prompt, done) {
    let promptDefault = prompt.default
    inquirer.prompt([{
        type: promptMapping[prompt.type] || prompt.type,
        name: key,
        message: prompt.message || prompt.label || key,
        default: promptDefault,
        choices: prompt.choices || [],
        validate: prompt.validate || (() => true)
    }]).then(answers => {
        console.log('gsdanswers', answers)
        if (Array.isArray(answers[key])) {

        } else if (typeof answers[key] === 'string') {
            data[key] = answers[key].replace(/"/g, '\\"')
        }else {
            data[key] = answers[key]
        }
        console.log('gsddata', data)
        done()
    })

}
