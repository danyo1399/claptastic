const Config = {
    version: process.env.VERSION,
    env: process.env.NODE_ENV,
    isProd() {
        return process.env.NODE_ENV === 'production'
    },
    sentry: process.env.SENTRY,
    apiServer: process.env.API_SERVER,
}

export default Config

console.log('config', Config)
