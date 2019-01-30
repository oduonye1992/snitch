const config = {
    pipeline_id: Date.now(),
    timeout: process.env.TIMEOUT,
    "redis": {
        "url": process.env.DATA_PIPELINE_REDIS_TEST_URL
    },
    "fileStorage": {
        "localFileDirectory": `${__dirname}/mytmp`,
        "fileMode": "local"
    },
};

module.exports = config;