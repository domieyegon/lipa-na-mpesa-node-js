1.Visit: https://developer.safaricom.co.ke/home

2. Create app:
    - Give it a name : e.g. Test App.
    - Check the Lipa na Mpesa Sandbox
    - Then click create app
 Action:
    A new App is created with:
        - Consumer Key: e.g GwWJwrnsddGjVqA2PoIa78vpgLLhmvEM
        - Consumer Secret: e.g l3cRGxT5a5gyI4f1

3. Configuring the Application:
    - Implementation of REST API using a preferred language (We will use Express.js).
    - To handle comunication to and from Daraja API we will use Axios.
        + Axios is Promise based HTTP client for the browser and node.js
        > npm i axios

    - Start a node js project by running:
        > npm init
        +++++++++++++++++
        OutPut:
            package name: (lipa_na_mpesa) 
            version: (1.0.0) 
            description: Node JS app with Expess js for Lipa Na MPesa Online
            entry point: (index.js) 
            test command: nodemon index.js
            git repository: 
            keywords: 
            author: Dominic Yegon
            license: (ISC) 
            About to write to /home/meliora/Academy/Domie/JS/lipa_na_mpesa/package.json:

            {
              "name": "lipa_na_mpesa",
              "version": "1.0.0",
              "description": "Node JS app with Expess js for Lipa Na MPesa Online",
              "main": "index.js",
              "scripts": {
                "test": "nodemon index.js"
              },
              "author": "Dominic Yegon",
              "license": "ISC"
            }  
            Is this OK? (yes)
        +++++++++++++++++++++

    - Install Express js and Axios
        > npm i axios express --save
    - Create a .env file in the app root folder.
    - Add The following to your .env file
        + APP_PORT= "5000"
        + CONSUMER_KEY = ""
        + CONSUMER_SECRET = ""
        + OAUTH_TOKEN_URL = "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
        + LIPA_NA_MPESA_URL = "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
        + LIPA_NA_MPESA_SHORTCODE = ""
        + LIPA_NA_MPESA_PASSKEY = ""
    

4. Getting an OAuth token.
    - To make every call to the Daraja API, we need to always supply an OAuth token. 