import {generateKey} from "./generateKey";
import {encryptFile} from "./encryptFile";
import {decryptFile} from "./decryptFile";
import * as fs from "fs";

const testPGP = async (fileName: string, publicKeyArmored: string, privateKeyArmored: string, passphrase: string) => {

    console.log('Testing encryption...');
    const startTime = process.hrtime();
    const readStream = fs.createReadStream(fileName, { encoding: 'utf8' });
    const encrypted = await encryptFile(readStream, publicKeyArmored);
    const writeStream = fs.createWriteStream(`${fileName}.enc`);
    await encrypted.pipe(writeStream);
    const endTime = process.hrtime(startTime);
    console.log(`Encryption took ${((startTime[1] - endTime[1]) / 1_000_000).toFixed(2)} milliseconds`);

    console.log('Testing decryption...');
    const startTime2 = process.hrtime();
    const decrypted = await decryptFile(encrypted, privateKeyArmored, passphrase);
    const writeStream2 = fs.createWriteStream(`${fileName}.dec`);
    await decrypted.pipe(writeStream2);
    const endTime2 = process.hrtime(startTime2);
    console.log(`Decryption took ${((startTime2[1] - endTime2[1]) / 1_000_000).toFixed(2)} milliseconds`);

    //Test if the decrypted file is the same as the original
    //const original = fs.readFileSync(fileName, { encoding: 'utf8' });
    //const decryptedFile = fs.readFileSync(`${fileName}.dec`, { encoding: 'utf8' });
    //console.log("Is decrypted same than the original", original === decryptedFile);
}

(async () => {
    const passphrase = `yourPassphrase`; // what the private key is encrypted with
    const { publicKeyArmored, privateKeyArmored } = await generateKey(passphrase, [{ name: 'User'}]);

    await testPGP('data/kacsa_150M.csv', publicKeyArmored, privateKeyArmored, passphrase);

})();