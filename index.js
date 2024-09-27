const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const moongoose = require('mongoose');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema');

const app = express();

app.use(cors());
dotenv.config();

moongoose
    .connect(process.env.MONGODB_KEY)
    .then((console.log("Connected to Database")))
    .catch(error => console.error(error));

app.get('/', (req, res) => {
    res.send('Welcome to the backend world!');
});

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true,
}));

app.listen(5000, () => {
    console.log('server is running on port 5000');
});