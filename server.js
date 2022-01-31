let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let cors = require('cors');
var port = process.env.PORT || 4000;
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
const { version } = require('./package.json');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const config = {
    client: `${process.env.DBENGINE}`,
    connection: {
        host: `${process.env.BASEURL}`,
        user: `${process.env.DBUSER}`,
        password: `${process.env.PASSWORD}`,
        database: `${process.env.DATABASE}`,
        encrypt: (process.env.ENCRYPT === "true")
    },
}

const knex = require('knex')(config);
const tableName = "Todo_list";  //Todo: Update your table name here

app.get('/', (req, res) => {
    return res.send({
        error: false,
        message: `Welcome to RESTful API with NodeJS, Express and SQL Server (Env: ${process.env.NODE_ENV})`,
    })
});

// Fetch all todo items
app.get('/api/todos', async (req, res) => {
    try {
        let data = await knex(tableName).select();
        res.status(200).json(data);
    }
    catch (err) {
        console.log(err);
        res.status(400).send({ error: true, message: err });
    }
});

// Add a new todo item
app.post('/api/add', async (req, res) => {
    try {
        let text = req.body.text;
        let status = req.body.status;
        if (!text) {
            return res.status(400).send({ error: true, message: "Invalid Todo item1." });
        }
        else {
            let result = await knex(tableName).insert({ text: text, status: status });
            return res.send({ error: false, data: result, message: "Todo item is added successfully" });
        }
    }
    catch (err) {
        return res.status(400).send({ error: true, message: err });
    }
});

//Update todo's status 
app.put('/api/update', async (req, res) => {
    try {
        let id = req.body.id;
        let status = req.body.status;

        if (!id) {
            return res.status(400).send({ error: true, message: "Invalid item id" });
        }
        else {
            let result = await knex(tableName).where({ id: id }).update({ status: status });
            let message = (result) ? "Item status is updated sucessfully" : "Item is not found or data are no change";
            return res.send({ error: false, data: result, message: message });
        }
    }
    catch (err) {
        return res.status(400).send({ error: true, message: err });
    }
});

//Delete todo item by id
app.delete('/api/delete/:id', async (req, res) => {
    try {
        let id = req.params.id;

        if (!id) {
            return res.status(400).send({ error: true, message: "Invalid item id" });
        }
        else {
            var result = await knex(tableName).where({ id: id }).del();
            let message = (result) ? "Todo item is deleted successfully" : "Item is not found";
            return res.send({ error: false, data: result, message: message });
        }
    }
    catch (err) {
        return res.status(400).send({ error: true, message: err });
    }
});

app.get('/version', (req, res) => {
    res.send({ error: false, data: version, message: 'get version' });
})

app.listen(port, () => {
    console.log("Node app is running on port 4000");
});

module.exports = app;