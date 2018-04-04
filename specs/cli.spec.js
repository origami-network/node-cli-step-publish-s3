const { expect } = require('chai');

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs-extra');
const uuid = require('uuid/v1');
const request = require('sync-request');

const parameters = require('./parameters');

const packageDir = path.join(__dirname, '.cli');
const packageFile = path.join(packageDir, 'package.json');
const package = {
    "name": "test-package-" + uuid(),
    "version": "1.2.3",
}
const packageDist = [
    'example.txt',
    'dir/example.txt',
    'dir/dir/example.txt'
]
const testTimeout = 30 * 1000; 

const cli = path.join('node_modules', '.bin', 'cli-publish-s3');
const execOptions = {
    cwd: packageDir,
    encoding: 'utf-8'
};

describe('Publish S3 - CLI', () => {
    describe("arguments", () => {
        
        before(() => {
            fs.emptyDirSync(packageDir);
            fs.writeFileSync(packageFile, JSON.stringify(package, null, 2) , 'utf-8');
            packageDist.forEach(file =>
                fs.outputFileSync(path.join(packageDir, 'dist', file), file)
            );

            const command = 'npm install --no-save ../..'
            console.info('> ' + command);
            const stdio = execSync(command, execOptions);
            console.info(stdio);
        })

        const requredArguments = [
            { name: 'AWS access key', arguments: '-A "' + parameters.aws.accessKey + '"' },
            { name: 'AWS secret key', arguments: '-S "' + parameters.aws.secretKey + '"' },
            { name: 'S3 region', arguments: '-r "' + parameters.s3.region + '"' },
            { name: 'S3 bucket', arguments: '-b "' + parameters.s3.bucket + '"' }
        ]
        requredArguments.forEach(item => {
            it("requires " + item.name, () => {
                const cliArguments = requredArguments
                    .filter(i => i.name !== item.name)
                    .map(i => i.arguments)
                    .join(' ')
                const command = cli + ' ' + cliArguments;
                console.info('> ' + command);

                expect(() => execSync(command, execOptions))
                    .to.throw(Error, item.Name);
            }).timeout(testTimeout);
        });

        it("use `dist` as default module source path", () => {
            const cliArguments = requredArguments
                .map(i => i.arguments)
                .join(' ');
            const command = cli + ' ' + cliArguments + (
                parameters.s3.endpoint
                    ? ' -e "' + parameters.s3.endpoint + '"'
                    : ''
            );
            
            console.info('> ' + command);
            const stdio = execSync(command, execOptions);
            console.info(stdio);

            packageDist.forEach(file => {
                const fileUrl = [
                    parameters.public.baseUrl,
                    package.name,
                    'v' + package.version,
                    file
                ].join('/');
                const response = request('GET', fileUrl);

                expect(stdio)
                    .to.include(file)
                expect(response.getBody().toString())
                    .to.equal(file);
            });
        }).timeout(testTimeout);

        it("alows to define module source path", () => {
            const subDir = 'dir'
            const sourceDir = path.join('dist', subDir)
            const cliArguments = requredArguments
                    .map(i => i.arguments)
                    .concat([
                        '-s "' + sourceDir + '"'
                    ])
                    .join(' ');
            const command = cli + ' ' + cliArguments + (
                parameters.s3.endpoint
                    ? ' -e "' + parameters.s3.endpoint + '"'
                    : ''
            );
            
            console.info('> ' + command);
            const stdio = execSync(command, execOptions);
            console.info(stdio);

            packageDist
                .filter(file => file.startsWith(subDir + '/'))
                .map(file => file.split('/').slice(1).join('/'))
                .forEach(file => {
                    const fileUrl = [
                        parameters.public.baseUrl,
                        package.name,
                        'v' + package.version,
                        file
                    ].join('/');
                    const response = request('GET', fileUrl);
                    
                    expect(stdio)
                        .to.include(file)
                    expect(response.getBody().toString())
                        .to.equal([subDir, file].join('/'));
                });
        }).timeout(testTimeout);

        it("allows to define S3 key prefix", () => {
            const prefix = uuid();
            const cliArguments = requredArguments
                    .map(i => i.arguments)
                    .concat([
                        '-p "' + prefix + '"'
                    ])
                    .join(' ');
            const command = cli + ' ' + cliArguments + (
                parameters.s3.endpoint
                    ? ' -e "' + parameters.s3.endpoint + '"'
                    : ''
            );
            
            console.info('> ' + command);
            const stdio = execSync(command, execOptions);
            console.info(stdio);

            packageDist.forEach(file => {
                const fileUrl = [
                    parameters.public.baseUrl,
                    prefix,
                    package.name,
                    'v' + package.version,
                    file
                ].join('/');
                const response = request('GET', fileUrl);
                
                expect(stdio)
                    .to.include(file)
                expect(response.getBody().toString())
                    .to.equal(file);
            });
        }).timeout(testTimeout);
    });
});