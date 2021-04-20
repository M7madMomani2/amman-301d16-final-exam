'use strict'
// Application Dependencies
const express = require('express');
const pg = require('pg');
const methodOverride = require('method-override');
const superagent = require('superagent');
const cors = require('cors');

// Environment variables
require('dotenv').config();

// Application Setup
const app = express();
const PORT = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;

// Express middleware
// Utilize ExpressJS functionality to parse the body of the request
// Specify a directory for static resources
// define our method-override reference
// Set the view engine for server-side templating
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Use app cors
app.use(cors());

// Database Setup
const client = new pg.Client(DATABASE_URL);

// app routes here
// -- WRITE YOUR ROUTES HERE --
app.get('/' ,homePage)
app.post('/', saveToDB)
app.get('/favorite-quotes' ,favoritePage)
app.post('/favorite-quotes', sendDetails)
app.get('/favorite-quotes/:id', viewDetails)
app.put('/favorite-quotes/:id', updateDetails)
app.delete('/favorite-quotes/:id', deleteDetails)




app.use('*', (request, response) => response.status(404).send('This route does not exist'));

// callback functions
// -- WRITE YOUR CALLBACK FUNCTIONS FOR THE ROUTES HERE --
function homePage(req,res){
    const url=`https://thesimpsonsquoteapi.glitch.me/quotes?count=10`
    superagent.get(url).set('User-Agent', '1.0').then(data=> data.body.map(object=> new Simpsons(object)))
    .then(result=> res.render('pages/index' , {results:result }))
    
}
function favoritePage(req,res){
    const sql = 'SELECT * FROM simpsons';
    client.query(sql).then(data=> res.render('pages/favorite-quotes', { results: data.rows}))

}

function saveToDB (req,res){
    const sql = 'INSERT INTO simpsons(quote, character, image, characterDirection) VALUES($1,$2,$3,$4) returning id;';
    console.log(req.body);
    const {quote, character, image, characterDirection}=req.body;
    const values=[quote, character, image, characterDirection];
    client.query(sql,values ).then(data=> res.redirect('/'));

}

function sendDetails(req,res){
    console.log(req.bode.id);

    const sql = 'SELECT * FROM simpsons WHERE id=$1;';
    res.redirect(`/favorite-quotes/${req.params.id}`)
    // client.query(sql,[req.params.id]).then(data=> res.redirect(`/favorite-quotes/${req.params.id}`))
}

function viewDetails(req,res){
    const sql = 'SELECT * FROM simpsons WHERE id=$1;';
    client.query(sql,[req.params.id]).then(data=> res.render('pages/details', { results: data.rows}))
    // res.render('pages/details', { results: data.rows})
}

function updateDetails(req,res){
    const sql = 'UPDATE simpsons SET quote = $1, character = $2, image = $3,characterDirection = $4  WHERE id=$5;';
    const {quote, character, image, characterDirection,id}=req.body;
    const values=[quote, character, image, characterDirection,id];
    client.query(sql,values).then(data=> res.redirect(`/favorite-quotes`))
    // res.render('pages/details', { results: data.rows})
}

function deleteDetails(req,res){
    const sql = 'DELETE FROM simpsons WHERE WHERE id=$1;';
    client.query(sql,[req.params.id]).then(data=> res.redirect(`/favorite-quotes`))
}




// helper functions
function Simpsons (object){
    this.quote = object.quote;
    this.character = object.character;
    this.image = object.image;
    this.characterDirection = object.characterDirection;

}




// app start point
client.connect().then(() =>
    app.listen(PORT, () => console.log(`Listening on port: ${PORT}`))
);
