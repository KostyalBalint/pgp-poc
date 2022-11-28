import {generateKey} from "./generateKey";
import {encryptFile} from "./encryptFile";
import {decryptFile} from "./decryptFile";
import * as fs from "fs";

const memoryUsage: number[] = [];
let startTime = process.hrtime();

const startMonitoring = () => {
    startTime = process.hrtime();
    return setInterval(() => {
        memoryUsage.push(process.memoryUsage().heapUsed);
    }, 5);
}

const endMonitoring = (id: NodeJS.Timeout) => {
    const endTime = process.hrtime(startTime);
    console.log(`Encryption took ${((startTime[1] - endTime[1]) / 1_000_000).toFixed(2)} milliseconds`);
    clearInterval(id);
    console.log(memoryUsage.map((value, index) => `${(value / 1_000_000).toFixed(2)}MB`));
}

const testPGP = async (fileName: string, publicKeyArmored: string, privateKeyArmored: string, passphrase: string) => {

    console.log('Testing encryption...');
    const monitor = startMonitoring();
    const readStream = fs.createReadStream(fileName, { encoding: 'utf8' });
    const encrypted = await encryptFile(readStream, publicKeyArmored);
    const writeStream = fs.createWriteStream(`${fileName}.enc`);
    await encrypted.pipe(writeStream);
    endMonitoring(monitor);

    /*console.log('Testing decryption...');
    monitor = startMonitoring();
    const decrypted = await decryptFile(encrypted, privateKeyArmored, passphrase);
    const writeStream2 = fs.createWriteStream(`${fileName}.dec`);
    await decrypted.pipe(writeStream2);
    endMonitoring(monitor);*/

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