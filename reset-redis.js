const a = [
    [
        "2018-07-09T11:01:47.255Z",
        "2018-04-27T14:12:11.842Z",
        "",
        "2018-12-19T16:11:31.924Z",
        "2018-12-19T16:11:31.920Z",
        "",
        "2018-12-21T14:16:38.075Z",
        "2017-04-23T17:28:13.915Z",
        "2018-12-21T14:16:38.071Z",
        "2018-12-21T14:17:25.490Z",
        "",
        "2018-12-21T13:30:16.653Z",
        "",
        "",
        "",
        "",
        "",
        "2018-12-21T14:36:34.187Z",
        "2018-12-21T13:43:40.163Z",
        "",
        "2018-12-20T18:17:55.493Z",
        "2018-12-21T14:36:34.189Z",
        "2018-12-21T14:16:38.081Z",
        "2018-12-21T14:16:38.066Z"
    ],
    [
        "",
        "",
        1050062350,
        "2018-12-21T14:16:38.131Z",
        1050062321,
        "",
        "2018-03-30T18:55:05.150Z",
        "",
        "2018-12-20T17:15:15.795Z",
        "2017-06-27T12:37:17.845Z",
        "2018-03-30T18:55:05.150Z",
        "2018-12-21T14:16:38.140Z",
        "",
        "",
        "",
        "1970-12-21T14:36:32.826Z", ///////
        "",
        "",
        "2018-12-21T14:33:33.515Z",
        "",
        "2018-12-21T14:36:32.733Z",
        ""
    ],
    [
        "",
        "2018-12-21T07:12:24.713Z",
        "2018-12-21T14:25:09.135Z",
        "1970-10-10",
        "2018-12-21T14:29:55.031Z",
        "2018-11-06T15:57:15.769Z",
        "2018-11-07T14:22:07.880Z"
    ]
]

const redis = require("redis");

function cleanup() {
    return new Promise((resolve, reject) => {
        const url = "redis://h:p6a11c341e64edb51c43c340fabf8531341aec23750b7a1f807c805d4165234f2@ec2-34-239-33-196.compute-1.amazonaws.com:8859";
        const REDIS_KEY = "extract_data_snitch001";
        const client = redis.createClient({
            url
        });
        client.on("error", function (err) {
            console.log("Error ", err);
            return reject(err);
        });
        client.on("connect", function () {
            console.log("Connected to redis");
            console.log('Updating redis index');

            client.get(REDIS_KEY, (err, res) => {
                if (err) throw new Error('Error updating redis counter');
                console.log('Updated redis index');
                console.log(res);
                client.quit();
            }); 
           /* client.set(REDIS_KEY, JSON.stringify(a), (err, res) => {
                if (err) throw new Error('Error updating redis counter');
                console.log('Updated redis index');
                client.quit();
                resolve({
                    status: 200,
                    data: {},
                    meta: {}
                });
            });*/
        });
    });
};

cleanup();