import {Readable} from "node:stream";
import * as openpgp from "openpgp";
import {NodeStream} from "openpgp";

export const decryptFile = async (stream: NodeStream<any>, privateKeyArmored: string, passphrase: string): Promise<NodeStream<any>> => {
    const message = await openpgp.readMessage({
        armoredMessage: stream
    });

    const privateKey = await openpgp.decryptKey({
        privateKey: await openpgp.readPrivateKey({armoredKey: privateKeyArmored}),
        passphrase
    });

    const {data: decrypted, signatures} = await openpgp.decrypt({
        message,
        decryptionKeys: privateKey
    });

    return decrypted;
}