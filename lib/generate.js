const Metalsmith = require('metalsmith')
const path = require('path')
module.exports = function generate (name, src, dest, done) {
    console.log('gsdgenerate', name, src, dest)
    const metalsmith = Metalsmith(path.join(src, 'template'))
    metalsmith.clean(false)
        .source('.')
        .destination(dest)
        .build((err, files) => {
            if(err) {
                console.log(err)
            }
        })
}
