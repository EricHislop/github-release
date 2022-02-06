import { SecretsManager } from 'aws-sdk'
import { BinaryLike, createHmac, KeyObject } from 'crypto'

const secretManager = new SecretsManager({ region: "ap-southeast-2" })

export async function secrets(event) {
    try {
        let secret: { [x: string]: BinaryLike | KeyObject }
        let secretString = await secretManager.getSecretValue({ SecretId: 'github-webhook' }).promise()
        secret = JSON.parse(secretString.SecretString)

        let signituare = "sha256=" + createHmac('sha256', secret['github-secret']).update(event.body).digest('hex');

        if (signituare === event.headers['x-hub-signature-256']) {
            return
        } else {
            throw 'Secrets didn\'t match'
        }
    } catch (error) {
        throw error
    }
}