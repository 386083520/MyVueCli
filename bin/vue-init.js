#!/usr/bin/env node
const program = require('commander')
const chalk = require('chalk')
const path = require('path')
const home = require('user-home')
const tildify = require('tildify')
const exists = require('fs').existsSync
const inquirer = require('inquirer')
const logger = require('../lib/logger')

program
    .usage('<template-name> [project-name]')
    .option('-c, --clone', 'use git clone')
    .option('--offline', 'use cached template')

program.on('--help', () => {
    console.log('  Examples:')
    console.log()
    console.log(chalk.gray('    # create a new project with an official template'))
    console.log('    $ vue init webpack my-project')
    console.log()
    console.log(chalk.gray('    # create a new project straight from a github template'))
    console.log('    $ vue init username/repo my-project')
    console.log()
})

function help () {
    program.parse(process.argv)
    if (program.args.length < 1) return program.help()
}
help()

let template = program.args[0]
console.log('gsdtemplate', template)
const rawName = program.args[1]
console.log('gsdrawName', rawName)
const inPlace = !rawName || rawName === '.'
console.log('gsdinPlace', inPlace)
const name = inPlace ? path.relative('../', process.cwd()) : rawName
console.log('gsdname', name, process.cwd())
const to = path.resolve(rawName || '.')
console.log('gsdto', to)
const tmp = path.join(home, '.vue-templates', template.replace(/[\/:]/g, '-'))
console.log('gsdtmp', tmp)
console.log('gsdoffline', program.offline)
if (program.offline) {
    console.log(`> Use cached template at ${chalk.yellow(tildify(tmp))}`)
    template = tmp
    console.log('gsdofflinetemplate', template)
}

if (inPlace || exists(to)) {
    inquirer.prompt([{
        type: 'confirm',
        message: inPlace
            ? 'Generate project in current directory?'
            : 'Target directory exists. Continue?',
        name: 'ok'
    }]).then(answers => {
        if (answers.ok) {
            run()
        }
    }).catch(logger.fatal)
} else {
    run()
}

function run () {
    console.log('gsdrun')
}
