const { expect } = require('chai');

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs-extra');

const parameters = require('./parameters');
const packagePath = path.join(__dirname, '.cli');
const packageFile = path.join(packagePath, 'package.json');
const package = {
    "name": "test-package",
    "version": "1.2.3",
}
const testTimeout = 30 * 1000; 

const cli = path.join('node_modules', '.bin', 'cli-publish-s3');
const execOptions = {
    cwd: packagePath,
    encoding: 'utf-8'
};

describe('Publish S3 - CLI', () => {
    describe("arguments", () => {
        
        before(() => {
            fs.emptyDirSync(packagePath);
            fs.writeFileSync(packageFile, JSON.stringify(package, null, 2) , 'utf-8');
            
            const command = 'npm install --no-save ../..'
            console.info('> ' + command);
            const stdio = execSync(command, execOptions);
            console.info(stdio);
        })

        const requredArguments = [
            { name: 'AWS access key', arguments: '-A "AWS access key"' },
            { name: 'AWS secret key', arguments: '-S "AWS secret key"' },
            { name: 'S3 region', arguments: '-r "S3 region"' },
            { name: 'S3 bucket', arguments: '-b "S3 bucket"' }
        ]
        requredArguments.forEach(item => {
            it("requires " + item.name, () => {
                const cliArguments = requredArguments
                    .filter(i => i.name !== item.name)
                    .map(i => i.arguments)
                    .join(' ')
                const command = cli + ' ' + cliArguments;
                console.info('> ' + command);
                expect(() => execSync(command, execOptions)).to.throw(Error, item.Name);
            }).timeout(testTimeout);
        });

        it("allows to define S3 key prefix", () => {
            throw new Error("TODO: not implemented");
        }).timeout(testTimeout);
        it("use `dist` as default module source path", () => {
            throw new Error("TODO: not implemented");
        }).timeout(testTimeout);
        it("alows to define module source path", () => {
            throw new Error("TODO: not implemented");
        }).timeout(testTimeout);
    });
});