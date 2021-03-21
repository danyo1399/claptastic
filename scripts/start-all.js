'use strict'
const process = require('process'),
    path = require('path'),
    fs = require('fs'),
    crypto = require('crypto'),
    cp = require('child_process')
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
        /[xy]/g,
        function (c) {
            var r = (Math.random() * 16) | 0,
                v = c == 'x' ? r : (r & 0x3) | 0x8
            return v.toString(16)
        },
    )
}

const cwd = process.cwd()

const username = 'serveruser'
const password = uuidv4()
const secret = uuidv4()

const contents = `COUCHDB_USER=${username}
COUCHDB_PASSWORD=${password}
COUCHDB_SECRET=${secret}
`

const dir = path.resolve(cwd, 'dist', 'couchdb')
const dataDir = path.resolve(dir, 'data')
const envFilePath = path.resolve(dir, 'couchdb-env-file.ini')
const jsonFilePath = path.resolve(dir, 'couchdb.json')
mkdir(dir)
mkdir(dataDir)
fs.writeFileSync(envFilePath, contents)
fs.writeFileSync(jsonFilePath, JSON.stringify({ username, password, secret }))

// stop all
exec(`docker stop claptastic-server`, true)
exec(`docker stop claptastic-couchdb`, true)
exec(`docker rm claptastic-server`, true)
exec(`docker rm claptastic-couchdb`, true)
exec(`docker network create claptastic-net`, true)

exec(`npm run server:build`)

// couchdb
exec(
    `docker run -p:5984:5984 -d -it --restart always --network claptastic-net -v ${dataDir}:/opt/couchdb/data --env-file ${envFilePath} --name claptastic-couchdb couchdb`,
)

// server

exec(`docker build -f Dockerfile.server -t claptastic-server:latest .`)

exec(
    `docker run -d -it --restart always -p:80:80 --env PORT=80 --network claptastic-net --env-file ${envFilePath} --name claptastic-server claptastic-server`,
)

function mkdir(path) {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true })
    }
}

function exec(cmd, continueOnError) {
    try {
        let buffer = cp.execSync(cmd)
        console.log(buffer.toString())
    } catch (err) {
        console.log(err.toString())
        if (!continueOnError) {
            throw err
        }
    }
}
