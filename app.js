const express = require('express');
const logger = require('morgan');
const secureApp = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost/nodejsapistarter')
    .then(() => console.log('connected database from mongodb !!'))
    .catch((error) => console.error(`Connect database is failed with error which is ${error}`))

const app = express();

const deckRoute = require('./routes/deck');
const useRoute = require('./routes/user');

//Helmet
app.use(secureApp())

//Middleware
app.use(logger('dev'))
app.use(bodyParser.json())

//Routes
app.use('/decks', deckRoute)
app.use('/users', useRoute)

//Routes
app.get('/', (req, res, next) => {
    return res.status(200).json({
        message: 'Sever is OK!'
    })
});

//Catch 404 Errors and forward them to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404
    next(err)
})

//Error handler funciton
app.use((err, req, res, next) => {
    const error = app.get('env') === 'development' ? err : {}
    const status = err.status || 500

    //response to client
return res.status(status).json({
        error: {
            message: error.message
        }
    })
});




const port = app.get('port') || 3000
app.listen(port, () => console.log(`Sever is listening on port ${port}`));