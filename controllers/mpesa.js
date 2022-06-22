const axios = require('axios').default;
require('dotenv').config();
const { json } = require('express/lib/response');
const fs = require('fs'); //File System -> allows you to work with the file system on your computer

class MPesaController {

    async getOAuthToken(req, res, next) {
        console.log("getOAuthToken");
        let consumer_key = process.env.CONSUMER_KEY;
        let consumer_secret = process.env.CONSUMER_SECRET;
        let url = process.env.OAUTH_TOKEN_URL;

        // form a buffer of the consumer_key and consumer_secret
        let buffer = new Buffer.from(consumer_key + ":" + consumer_secret);

        let auth = `Basic ${buffer.toString('base64')}`;
        console.log("auth: " + auth);

        try {

            let { data } = await axios.get(url, {
                "headers": {
                    "Authorization": auth
                }
            });


            req.token = data['access_token'];

            console.log("access_token: " + req.token);
            return next();

        } catch (err) {
            console.log(err);
            return res.send({
                success: false,
                Message: err['response']['statusText']
            })
        }
    }


    async lipaNaMpesaOnline(req, res) {

        console.log("---------------- lipaNaMpesaOnline---------------")

        let token = req.token;
        let auth = `Bearer ${token}`;
        console.log('token: ' + token);

        //getting the timestamp
        let timestamp = require('../middleware/timestamp').timestamp;

        console.log('timestamp: ' + timestamp);


        let url = process.env.LIPA_NA_MPESA_URL;
        let bs_short_code = process.env.LIPA_NA_MPESA_SHORTCODE;
        let passkey = process.env.LIPA_NA_MPESA_PASSKEY;

        let password = new Buffer.from(`${bs_short_code}${passkey}${timestamp}`).toString('base64');
        let transcation_type = "CustomerPayBillOnline";
        let amount = "1"; //you can enter any amount
        let partyA = "254728448303"; //party-sending-funds should follow the format:2547xxxxxxxx
        let partyB = process.env.LIPA_NA_MPESA_SHORTCODE;
        let phoneNumber = "254728448303"; //party-sending-funds should follow the format:2547xxxxxxxx

        let callBackUrl = "https://a093-105-161-177-226.ngrok.io/mpesa/lipa-na-mpesa-callback";
        let accountReference = "lipa-na-mpesa-test";
        let transaction_desc = "Testing lipa na mpesa functionality";

        try {

            let { data } = await axios.post(url, {
                "BusinessShortCode": bs_short_code,
                "Password": password,
                "Timestamp": timestamp,
                "TransactionType": transcation_type,
                "Amount": amount,
                "PartyA": partyA,
                "PartyB": partyB,
                "PhoneNumber": phoneNumber,
                "CallBackURL": callBackUrl,
                "AccountReference": accountReference,
                "TransactionDesc": transaction_desc
            }, {
                "headers": {
                    "Authorization": auth
                }
            }).catch(console.log);

            return res.send({
                success: true,
                message: data
            });

        } catch (err) {

            return res.send({
                success: false,
                // message:err['response']['statusText']
                message: err
            });

        };
    }

    lipaNaMpesaOnlineCallback(req, res) {

        //Get the transaction description
        let message = req.body.Body.stkCallback['ResultDesc'];
        console.log("Callback: " + message);

        let dataPath = "data";
        let filename = "callback.json";
        let data = req.body;
        let array = [];

        if (!fs.existsSync(`./${dataPath}`)) {
            fs.promises.mkdir(dataPath, { recursive: true });
        }

        if (!fs.existsSync(`./${dataPath}/${filename}`)) {
            array.push(data);
            writeToFile(`./${dataPath}/${filename}`, JSON.stringify(array));
        } else {
            fs.readFile(`./${dataPath}/${filename}`, 'utf8', (err, json) => {

                if (json.length > 0) {
                    array = JSON.parse(json);
                }

                array.push(data);
                writeToFile(`./${dataPath}/${filename}`, JSON.stringify(array));
            });
        }


        return res.send({
            success: true,
            message
        });



    };

}

function readFromFile(file) {
    fs.readFile(file, 'utf8', (err, data) => {
        if (data.length > 0) {
            return JSON.parse(data);
        }
        return [];
    });
}

function writeToFile(path, data) {
    fs.writeFile(path, data, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Callback saved!");
        }
    });
}

module.exports = new MPesaController();