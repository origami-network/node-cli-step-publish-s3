[![Build Status](https://travis-ci.org/origami-network/node-cli-step-publish-s3.svg?branch=master)](https://travis-ci.org/origami-network/node-cli-step-publish-s3)
[![Coverage Status](https://coveralls.io/repos/github/origami-network/node-cli-step-publish-s3/badge.svg?branch=master)](https://coveralls.io/github/origami-network/node-cli-step-publish-s3?branch=master)

# Publish to S3

Publish artifacts to AWS S3 blob storage.
Mainly used to allow access client side assets through CDN infrastructure.


## Usage

The simple usage is to define custom script that will install and run the command at once.

In the `package.json` add new script:

```json
{
    ...
    "scripts": {
        "cli-step-publish-s3": "npm install --no-save --silent @origami-network/cli-step-publish-s3 && cli-publish-s3"
        ...
    }
    ...
}
```

Now it is possible to run the command.

```shell
> npm run cli-step-publish-s3 <parameters>
```

It will copy the `./dist` folder of the current package to the defined S3 bucket.
The files will be placed with the prefix `<name>/v<version>`, where `<name>` and `<version>` are taken from the current package.


### Parameters

It is possible to store pass additional parameters to the script when calling `npm run`, by adding `--` and the arguments of the script:

  * **`-A`**, **`--aws-access-key <value>`** - AWS access key that has privilege to put objects in bucket.
  * **`-S`**, **`--aws-secret-key <value>`**, 'AWS secret key corresponding to access key.
     > NOTE: Do not store AWS secret key in the repository. It should be defined in secure storge.
  * **`-r`**, **`--s3-region <name>`** - 'S3 bucket region.
  * **`-b`**, **`--s3-bucket <name>`** - 'S3 bucket name.

Optionaly fallowing arguments can be used:

  * `-p`, `--s3-key-prefix <value>` - 'S3 bucket key prefix. Parameter is optional.
  * `-s`, `--source <path>` - 'Path with files that should be published. It should be path relative to module. By default it is `./dist`.
  * `-e`, `--s3-endpoint <url>` - 'URL to the S3 endpoint. Used for testing purposes with Minio server. Should be omited when working with AWS S3 services.  

In addition, fallowing informational parameters can be used:

 * `-h`, `--help` - output usage information,
 * `-V`, `--version` - output version of the script.

## Examples

### Command line

if the `package.json` has defined name `foo` with version `X.Y.Z` the example files in `./dist` folder:

 * `./dist/bundle.js` - `/foo/vX.Y.Z/bundle.js` 
 * `./dist/bundle.css` - `/foo/vX.Y.Z/bundle.css` 
 * `./dist/img/logo.svg` - `/foo/vX.Y.Z/logo.svg` 

Calling fallowing command:

```shell
> npm run cli-step-publish-s3 -- --aws-access-key <access key> --aws-secret-key <secret key> -s3-region us-east-1 --s3-bucket example
```

Will publish the files in bucket `example` in the `us-east-1` region, under keys:

 * `/foo/vX.Y.Z/bundle.js` 
 * `/foo/vX.Y.Z/bundle.css` 
 * `/foo/vX.Y.Z/logo.svg` 

It is possible to add aditional prefix to the S3 key witt fallowing command:

```shell
> npm run cli-step-publish-s3 -- --aws-access-key <access key> --aws-secret-key <secret key> -s3-region us-east-1 --s3-bucket example --s3-key-prefix some-prefix
```

The keys for published files will looks:

 * `/some-prefix/foo/vX.Y.Z/bundle.js` 
 * `/some-prefix/foo/vX.Y.Z/bundle.css` 
 * `/some-prefix/foo/vX.Y.Z/logo.svg`

If the files that shoudl be published are other folder, for instance in `./dist/cdn`, it is possible to point the location by calling:

```shell
> npm run cli-step-publish-s3 -- --aws-access-key <access key> --aws-secret-key <secret key> -s3-region us-east-1 --s3-bucket example --source ./dist/cdn
```


### Jenkinsfile

For Windows slave node add fallowing code to `Jenkinsfile`.

```groovy
    withCredentials([[
        $class: 'UsernamePasswordMultiBinding',
        credentialsId: '<CREDENTIALS_ID>',
        usernameVariable: 'AWS_ACCESS_KEY',
        passwordVariable: 'AWS_SECRET_KEY'
    ]]) {    
        bat "npm run cli-step-publish-s3 -- --aws-access-key ${env.AWS_ACCESS_KEY} --aws-secret-key ${env.AWS_SECRET_KEY} -s3-region <region> --s3-bucket <bucket>"
    }
}
```

On Un*x slave nodes `bat` step should be replaced with `sh` step.


## Specification

In order to execute living specification suite use the fallowing command.

```shell
> npm --aws-access-key=<access key> --aws-secret-key=<secret key> --s3-region=<region> --s3-bucket=<bucket> --public-base-url=<bucket base url> run spec
```

The S3 bucket to act as CDN should has at last [read only policy](specs/s3/public/policy.json) for direct public access to the objects.
Also the CORS should be defined. 


### Use Minio

[Minio](https://minio.io/) is an object storage server compatible with Amazon S3 cloud storage service.

In order to use it the parameter `--s3-endpoint=<minio endpoint>` need to be provided.
See [CI/CD file](./.travis.yml) for exeample usage.


## TODO

 * Prepare publishing to NPM registry.
 * Allow to pass `Cache-Control` header value.
 