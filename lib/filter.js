module.exports = (files, filters, data, done) => {
    if (!filters) {
        return done()
    }
    const fileNames = Object.keys(files)
    Object.keys(filters).forEach(glob => {
        fileNames.forEach(file => {

        })
    })
    done()
}
