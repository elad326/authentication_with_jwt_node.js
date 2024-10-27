const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

app.get('/api', (req, res) => {
    res.json({
        message: 'welcome to the api'
    });
});

// a request we want to protect 
app.post('/api/posts', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);  // Forbidden if token is invalid
        } else {
            res.json({
                message: 'Post created',
                authData
            });
        }
    });
});


app.post('/api/login', (req, res) => {
    // fake user 
    const user = {
        id: 1,
        username: 'elad',
        email: 'elad@gmail.com'
    };

    jwt.sign({user: user}, 'secretkey', { expiresIn: '30s' }, (err, token) => {

        res.json({
            token: token
        });
    });
});


// verify token middleware func
function verifyToken(req, res, next){

    // get the token from the header 
    const bearerHeader = req.headers['authorization'];

    // FORMAT OF THOKEN 
    // authorization: Bearer <acces_token> [ we had to get him from this Bearer ]

    // check if bearer is not udefined 
    if (typeof bearerHeader !== 'undefined') {

        // make array [ with split ] from here -- uthorization: Bearer <acces_token>  by the space 
        const bearer = bearerHeader.split(' ');
        
        // get token from bearer arr 
        const bearerToken = bearer[1];

        // set the token at the request 
        req.token = bearerToken;

        // for the middleware - call the next func
        next();

    }else{
        // Forbidden
        res.sendStatus(403);
    }

}


app.listen(5000, () => console.log("listening..."));