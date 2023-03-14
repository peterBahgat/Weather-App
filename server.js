/* Empty JS object to act as endpoint for all routes */
let projectData = {};

// include Express to run server and routes
const express = require('express');

// Start up an instance of app
const app = express();

/* Dependencies*/
const bodyParser = require('body-parser');
const cors = require('cors');

// configuring express to use some middle-wares
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

/* Initializing the main project folder */
app.use(express.static('website'));

// initializing the logic of choosing the port of the server(for this project it will be always a localhost:8000 as there is no env)
port = process.env.PORT || 3000;

// a callback function for debugging 
function listening() {
    console.log(`
    server is running .....
    running on localhost: ${port}
    `);
}

// spin up the server
const server = app.listen(port, listening);

// Post route
app.post("/addData", async (req, res) => {
    const postedData = await req.body;
    projectData = postedData;
    res.status(200).send(projectData);
});

// Get route
app.get("/all", async (req, res) => {
    res.send(projectData);
});