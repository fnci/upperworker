/* const express = require('express'); // CommonJS */
import  express from 'express';
const app = express();
const port = 3000; // Define a port to run the project.

app.get("/", function(req, res) {
    res.send("Welcome World!");
});

app.listen(port);