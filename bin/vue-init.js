#!/usr/bin/env node
const download = require('download-git-repo')
const program = require('commander')
const chalk = require('chalk')
const path = require('path')
const home = require('user-home')
const tildify = require('tildify')
const ora = require('ora')
const exists = require('fs').existsSync
const inquirer = require('inquirer')
const rm = require('rimraf').sync
const logger = require('../lib/logger')
const generate = require('../lib/generate')
const checkVersion = require('../lib/check-version')
const warnings = require('../lib/warnings')
const localPath = require('../lib/local-path')
const isLocalPath = localPath.isLocalPath
const getTemplatePath = localPath.getTemplatePath

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
const hasSlash = template.indexOf('/') > -1
console.log('gsdhasSlash', hasSlash)
const rawName = program.args[1]
console.log('gsdrawName', rawName)
const inPlace = !rawName || rawName === '.'
console.log('gsdinPlace', inPlace)
const name = inPlace ? path.relative('../', process.cwd()) : rawName
console.log('gsdname', name)
const to = path.resolve(rawName || '.')
console.log('gsdto', to)
const clone = program.clone || false
console.log('gsdclone', clone)
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
    if (isLocalPath(template)) {
        const templatePath = getTemplatePath(template)
        console.log('gsdtemplatePath', templatePath)
        if (exists(templatePath)) {
            generate(name, templatePath, to, err => {

            })
        } else {
            logger.fatal('Local template "%s" not found.', template)
        }
    } else {
        checkVersion(() => {
            if (!hasSlash) {
                const officialTemplate = 'vuejs-templates/' + template
                console.log('gsdofficialTemplate', officialTemplate)
                if (template.indexOf('#') !== -1) {
                    downloadAndGenerate(officialTemplate)
                } else {
                    if (template.indexOf('-2.0') !== -1) {
                        warnings.v2SuffixTemplatesDeprecated(template, inPlace ? '' : name)
                        return
                    }
                    downloadAndGenerate(officialTemplate)
                }
            } else {
                downloadAndGenerate(template)
            }
        })
    }
}

function downloadAndGenerate (template) {
    const spinner = ora('downloading template')
    spinner.start()
    if (exists(tmp)) rm(tmp)
    download(template, tmp, { clone }, err => {
        spinner.stop()
        if (err) logger.fatal('Failed to download repo ' + template + ': ' + err.message.trim())
        generate(name, tmp, to, err => {
        })
    })
}
