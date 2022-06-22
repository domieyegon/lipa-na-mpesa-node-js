
const express = require('express');

const router = express.Router();

const fs = require('fs');

//controllers
const mpesa = require('../controllers/mpesa');

//route to get the auth token
router.get('/get-auth-token', mpesa.getOAuthToken);

//lipa na mpesa online 
router.post('/lipa-na-mpesa', mpesa.getOAuthToken, mpesa.lipaNaMpesaOnline);

//callback url
router.post('/lipa-na-mpesa-callback', mpesa.lipaNaMpesaOnlineCallback);

router.get('/test', function (req, res) {

    // create a JSON object
    const user = {
        "id": 1,
        "name": "John Doe",
        "age": 22
    };

    // convert JSON object to string
    const data = JSON.stringify(user);

    // write JSON string to a file
    fs.writeFile('user.json', data, (err) => {
        if (err) {
            throw err;
        }
        console.log("JSON data is saved.");
    });
    return res.send("Hello!")
});

module.exports = router;