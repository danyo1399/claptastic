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

const configuration = `COUCHDB_USER=${username}
COUCHDB_PASSWORD=${password}
COUCHDB_SECRET=${secret}
`

const nodeServerPort = process.env.SERVER_PORT || 80

const couchDbBasePath = path.resolve(cwd, 'dist', 'couchdb')
const couchdbDataPath = path.resolve(couchDbBasePath, 'data')
const envConfigFilePath = path.resolve(couchDbBasePath, 'couchdb-env-file.ini')
const jsonConfigFilePath = path.resolve(couchDbBasePath, 'couchdb.json')
mkdir(couchDbBasePath)
mkdir(couchdbDataPath)
fs.writeFileSync(envConfigFilePath, configuration)
fs.writeFileSync(
    jsonConfigFilePath,
    JSON.stringify({ username, password, secret }),
)

// stop all
exec(`docker stop claptastic-server`, true)
exec(`docker stop claptastic-couchdb`, true)
exec(`docker rm claptastic-server`, true)
exec(`docker rm claptastic-couchdb`, true)
exec(`docker network create claptastic-net`, true)

exec(`npm run server:build`)

// couchdb
exec(
    `docker run -p:5984:5984 -d -it --restart always --network claptastic-net -v ${couchdbDataPath}:/opt/couchdb/data --env-file ${envConfigFilePath} --name claptastic-couchdb couchdb`,
)

// server

exec(`docker build -f Dockerfile.server -t claptastic-server:latest .`)

exec(
    `docker run -d -it --restart always -p:${nodeServerPort}:${nodeServerPort} --env PORT=${nodeServerPort} --network claptastic-net --env-file ${envConfigFilePath} --name claptastic-server claptastic-server`,
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
        return true
    } catch (err) {
        console.log(err.toString())
        if (!continueOnError) {
            throw err
        }
        return false
    }
}
