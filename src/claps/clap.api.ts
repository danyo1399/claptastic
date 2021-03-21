import config from '../config.json'
import getLogger from '../utils/logger'

const logger = getLogger('clap api')
export function addClap(clap: { userId: string; message: string }) {
    fetch(`${config.apiServer}/claps`, {
        method: 'POST',

        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(clap),
    })
        .then((res) => {
            if (!res.ok) {
                throw res
            }
        })
        .catch((err) => {
            logger.error('failed to post clap to api', {
                status: err.status,
            })
        })
}
