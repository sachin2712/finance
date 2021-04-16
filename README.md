TECH STACK
Angular4, Meteor

PURPOSE
To manage bank statments and daily financial operations for a company

DEPLOY
meteor angular 2 project to server

STEP 1: On your server clone the finance app and install below packages using below commands.

        git clone https://github.com/upexcel/finance.git 

        cd finance

        meteor npm install


STEP 2: Run below command into your root folder of our app, this will generate a zip folder in output folder

        meteor build ./../output


STEP 3: Move to output folder which is outside of app folder and run below command to extract the zip file

        gzip -df finance.tar.gz 

        tar -xf your_file_name.tar

STEP 4: After extracting file using tar we will get a folder bundle. go to bundle folder and move all file outside using these commands

    cd bundle

    mv * ..

    cd ..

STEP 5: Now go to /programs/server and install dependencies

    a) cd /programs/server

    b) meteor npm install

    c) npm uninstall fibers   // to fix the fibers error

    d) npm install fibers    


STEP 6: Now export detail of mongo atlas by typing command

   export MONGO_URL="mongodb+srv://<username>:<password>@cluster0.ui0nb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority" 

   export ROOT_URL=http://176.9.137.77

   export PORT=3000 


STEP 7: Move to bundle root folder and start it with pm2

    pm2 start main.js --name finance


Mongo Atlas settings: 

STEP 1: create your own Mongo Atlas account and set MONGO_URL export MONGO_URL="mongodb+srv://<username>:<password>@cluster0.ui0nb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"


STEP 2: for setting basic accounts system add these files into collection users 

{

"_id": "BSricoEcZkdjLimsD",

"createdAt": {

    "$date": "2016-09-30T05:48:51.059Z"

},

"services": {

    "password": {

        "bcrypt": "$2a$10$4EpqYDIdE0VG1.Hy2IzoJ.wbJUfJO8GZDTX7XeEwaPbxIp9FIgKYi"

    },

    "resume": {

        "loginTokens": [

            {

                "when": {

                    "$date": "2016-09-30T05:50:21.673Z"

                },

                "hashedToken": "2VQ3gF1auPInHyi2IcMb6tpxwmxuoVqg/UUzdq7+hxA="

            }

        ]

    }

},

"username": "manish",

"emails": [

    {

        "address": "manish@gmail.com",

        "verified": false

    }

],

"profile": {

    "role": "admin",

    "name": "manish",

    "email": "manish@gmail.com"

},

"roles": [

    "admin"

]
}

it will create a account with email id manish@gmail.com and password 1****6 . Login and create a new admin account and delete old one.

STEP 3: Add these document into roles collection 

{ "_id": "xC6ng3WYqxLdSbMgF", "name": "admin" }

{ "_id": "hhydvtSS9PeFxnT44", "name": "Accounts" }

{ "_id": "Y3uixAiEFYdbbpH29", "name": "guest" }
