module.exports = {
    aws: {
        accessKey: process.env.npm_config_aws_access_key,
        secretKey: process.env.npm_config_aws_secret_key
    },
    s3: {
        region: process.env.npm_config_s3_region,
        bucket: process.env.npm_config_s3_bucket,
        endpoint: process.env.npm_config_s3_endpoint
    }
};
