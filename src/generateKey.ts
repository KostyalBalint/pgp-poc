import * as openpgp from "openpgp";
import {MaybeArray, UserID} from "openpgp";

export async function generateKey(passphrase: string, userIds: MaybeArray<UserID>): Promise<{ publicKeyArmored: string, privateKeyArmored: string }> {
    const {privateKey, publicKey, revocationCertificate} = await openpgp.generateKey({
        type: 'ecc', // Type of the key, defaults to ECC
        curve: 'curve25519', // ECC curve name, defaults to curve25519
        userIDs: userIds,
        passphrase: passphrase, // protects the private key
        format: 'armored' // output key format, defaults to 'armored' (other options: 'binary' or 'object')
    });

    return {
        publicKeyArmored: publicKey,
        privateKeyArmored: privateKey
    }
}