const ghpages = require('gh-pages')

const process = require('process')
const path = require('path')
const distPath = path.resolve(__dirname, '../dist/claptastic')
const version = require('../package.json')

console.log('dist path', distPath)
const branch = process.env.BRANCH || 'gh-pages'
console.log('branch', branch)
ghpages.publish(distPath, { tag: version.version, branch }, function (err) {
    if (err) {
        console.error('Failed to publish', err)
        process.exitCode = -1
    } else {
        console.log('publish success')
    }
})
