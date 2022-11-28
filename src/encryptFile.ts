import {Readable} from "node:stream";
import * as openpgp from "openpgp";
import {NodeStream} from "openpgp";

export const encryptFile = async (stream: Readable, publicKeyArmored: string): Promise<NodeStream<any>> => {

    const publicKey = await openpgp.readKey({armoredKey: publicKeyArmored});

    return await openpgp.encrypt({
        message: await openpgp.createMessage({text: stream, format: 'text'}), // input as Message object
        encryptionKeys: publicKey,
    });
}