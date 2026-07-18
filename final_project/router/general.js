const express = require('express');
let books = require("./booksdb.js");
const { default: axios } = require('axios');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();


// Register
public_users.post("/register", (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    if(username && password){

        let valido = isValid(username);

        if(!valido){
            return res.status(401).json({message:"Username already exists"});
        }

        users.push({
            username,
            password
        });

        return res.status(201).json({message:"User created successfully"});
    }

    return res.status(404).json({message:"Unable to register user"});
});


// Get all books
public_users.get('/', function (req, res) {
    return res.status(200).json(books);
});

public_users.get('/asyncbooks', async function (req,res) {
    try{
        let response = await axios.get('localhost:5000/');
        return res.status(200).json(response.data);
    }catch (err) {

         return res.status(500).json({
            message: "Error getting books"
        });
    }
});




// Get by ISBN
public_users.get('/isbn/:isbn', function (req, res) {

    const isbn = req.params.isbn;

    return res.status(200).json(books[isbn]);

});

public_users.get("/async/isbn/:isbn", async function(req, res){

    const isbn = req.params.isbn;

    try{

        const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);

        return res.status(200).json(response.data);

    }catch(err){

        return res.status(500).json({
            message:"Error getting book"
        });

    }

});


// Get by author
public_users.get('/author/:author', function (req, res) {

    const author = req.params.author;

    let result = Object.values(books).filter(book => book.author === author);

    return res.status(200).json(result);

});

public_users.get("/async/author/:author", async function(req, res){

    const author = req.params.author;

    try{

        const response = await axios.get(`http://localhost:5000/author/${author}`);

        return res.status(200).json(response.data);

    }catch(err){

        return res.status(500).json({
            message: err.message
        });

    }

});


// Get by title
public_users.get('/title/:title', function (req, res) {

    const title = req.params.title;

    let result = Object.values(books).filter(book => book.title === title);

    return res.status(200).json(result);

});

public_users.get("/async/title/:title", async function(req, res){

    const title = req.params.title;

    try{

        const response = await axios.get(`http://localhost:5000/title/${title}`);

        return res.status(200).json(response.data);

    }catch(err){

        return res.status(500).json({
            message:"Error getting books"
        });

    }

});


// Get reviews
public_users.get('/review/:isbn', function (req, res) {

    const isbn = req.params.isbn;

    return res.status(200).json(books[isbn].reviews);

});

module.exports.general = public_users;