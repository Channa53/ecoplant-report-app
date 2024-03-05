const express = require('express');
const app = express();
const csv = require('csvtojson');

app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.get('/', (req, res) => {
    csv()
        .fromFile("FE_dev_exam_log.csv")
        .then((jsonObj)=> {
            result = jsonObj.map((item) => {
                return {
                    timestamp: item.timestamp,
                    kwh: parseInt(item.kwh),
                    pressure: parseInt(item.pressure),
                    temp: parseInt(item.temp)
                }
            })
            res.send(result);
        });
})
app.listen(8080, () => {
    console.log("server is listening on port 8080")
})