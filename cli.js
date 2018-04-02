#!/usr/bin/env node

const program = require('commander');
const path = require('path');
const mime = require('mime-types');
const Aws = require('aws-sdk');

program
  .version(require('./package.json').version)
  .option('-A, --aws-access-key <value>', 'AWS access key that has privilege to put objects in bucket.')
  .option('-S, --aws-secret-key <value>', 'AWS secret key corresponding to access key.')
  .option('-r, --s3-region <name>', 'S3 bucket region.')
  .option('-b, --s3-bucket <name>', 'S3 bucket name.')
  .option('-p, --s3-key-prefix <value>', 'S3 bucket key prefix. Parameter is optional.')
  .option('-s, --source <path>', 'Path with files that should be published. It should be path relative to module. By default it is `./dist`.', './dist')
  .option('-e, --s3-endpoint <url>', 'URL to the S3 endpoint. Used for testing purposes with Minio server. Should be omited when working with AWS S3 services.')
  .parse(process.argv);

[
    { key: 'awsAccessKey', name: "AWS access key" },
    { key: 'awsSecretKey', name: "AWS secret key" },
    { key: 's3Region', name: "S3 region" },
    { key: 's3Bucket', name: "S3 bucket" }
].forEach(parameter => {
    if (!program[parameter.key]) {
        console.error(parameter.name + " is mandatory");
        program.outputHelp();
        process.exit(1);
    }
});

const s3Options = {
    accessKeyId: program.awsAccessKey,
    secretAccessKey: program.awsSecretKey,
    region: program.s3Region,
    params: {
        Bucket: program.s3Bucket
    }
};
if (program.s3Endpoint) {
    s3Options.endpoint = program.s3Endpoint;
    s3Options.s3ForcePathStyle = true;
}
const s3 = new Aws.S3(s3Options);

const sourcePackageDir = process.cwd();
const sourcePackageFile = path.join(sourcePackageDir, 'package.json');
const sourcePackage = require(sourcePackageFile);

const prefix = [
    program.s3PathPrefix,
    sourcePackage.name,
    'v' + sourcePackage.version
]
    .filter(i => i)
    .join('/')
const sourceDir = path.join(sourcePackageDir, program.source);

const message = [
    'Publish',
    '`' + sourceDir + '`',
    'to',
    '`arn:aws:s3:::' + s3Options.params.Bucket + '/' + prefix + '`',
    'in region',
    '`' + s3Options.region + '`',
].join(' ')
console.log(message + ':');
require('.')(sourceDir, error => {
    console.error(error);
    process.exit(1);
})(item => {
    const params = {
        Key: [prefix, item.file].join('/'),
        Body: item.data
    };
    var mimeType = mime.lookup(item.file);
    if (mimeType) {
        params.ContentType = mimeType;
    }

    s3.putObject(params, (error, data) => {
            if (error) {
                console.error(error);
                process.exit(1);
            }

            console.log(' + ' + item.file + ' [' + mimeType + ']');
        });

    // FIXME: Set cache control
});
