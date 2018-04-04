[![Build Status](https://travis-ci.org/origami-network/node-cli-step-publish-s3.svg?branch=master)](https://travis-ci.org/origami-network/node-cli-step-publish-s3)
[![Coverage Status](https://coveralls.io/repos/github/origami-network/node-cli-step-publish-s3/badge.svg?branch=master)](https://coveralls.io/github/origami-network/node-cli-step-publish-s3?branch=master)

# node-cli-step-publish-s3
Publish artifacts to AWS S3 blob storage. Mainly used to allow access client side assets through CDN infrastructure.

## Specification

In order to execute living specification suite use the fallowing command.

```shell
> npm --aws-access-key=<access key> --aws-secret-key=<secret key> --s3-region=<region> --s3-bucket=<bucket> --public-base-url=<bucket base url> run spec
```

The S3 bucket should has at last [read only policy](specs/s3/public/policy.json) for direct public access to the objects. 

### Use Minio

[Minio](https://minio.io/) is an object storage server compatible with Amazon S3 cloud storage service.

In order to use it the parameter `--s3-endpoint=<minio endpoint>` need to be provided.
    
