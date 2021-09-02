module.exports = function evaluate (exp, data) { // lint {'name': '','vie-router': 'yes' }
    const fn = new Function('data', 'with (data) { return ' + exp + '}')
    return fn(data)
}
