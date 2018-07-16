//<3❤️

const express = require ('express');
const mongoose = require ('mongoose');

const axios = require ('axios');
const sendmail = require ('sendmail')
const cheerio = require ('cheerio');
const marcaUrl = "http://marca.com";
const sportUrl = "https://www.sport.es/es/";
const deportUrl = "https://depor.com/mundial";


const app = express();

app.get('/subscribe', subscribe)
app.get('/sendMeAnEmail', sendMeAnEmail)
  
mongoose.connect("mongodb://localhost/scrapping-service")
const USER = require ('./user.model');


async function subscribe(req, res) {
    const data = {
        email: req.query.email,
        news: req.query.news,
        query: req.query.query        
    }
    const user = new USER(data);
    /*user.save()
        .then(response => res.json(response))
        .catch(res.status(400).send('Error'))*/
    USER.create(data)
        .then(response => res.json(response))
        .catch(err => res.status(400).send('Error'))  
   
    
    await getTitularesFromMarca(marcaUrl, req).then(response => console.log(response));
    await getTitularesFromSport(sportUrl, req).then(response => console.log(response));
    await getTitularesFromDeport(deportUrl, req).then(response => console.log(response));    
}

function sendMeAnEmail(req, res) {
    const email = req.query.email;
    USER.findOne({"email":email}, (err, user) => {
        const news = user.news;
        const query = user.query;

    })
}

function sendAnEmail(user, titulares) {
    sendmail({
        from: 'no-reply@webscrappingservice.com',
        to: user,
        subject: 'Your news!',
        html: titulares,
    }, function (err, reply) {
        console.log(err && err.stack);
        console.dir(reply);
    });
    
}
function getTitularesFromMarca(url , req){
    return new Promise((resolve,reject) =>{
            return axios.get(url)
            .then(response => {
                const aux = [];
                const $ = cheerio.load(response.data);
                $(".mod-title>a").each(function(idx, element) {
                    const $titular = $(element).text();
                    aux.push($titular);                                           
                }) 
                const titularesFinales = aux.filter(titular => titular.includes(req.query.query))
                resolve(titularesFinales);                                               
            })
        })
}

function getTitularesFromSport(url, req){
    return new Promise((resolve,reject) =>{
            return axios.get(url)
            .then(response => {
                const aux = [];
                const $ = cheerio.load(response.data);
                $(".title>a").each(function(idx, element) {
                    const $titular = $(element).text();
                    aux.push($titular);                                           
                }) 
                const titularesFinales = aux.filter(titular => titular.includes(req.query.query))
                resolve(titularesFinales);                                               
            })
        })
}

function getTitularesFromDeport(url, req){
    return new Promise((resolve,reject) =>{
            return axios.get(url)
            .then(response => {
                const aux = [];
                const $ = cheerio.load(response.data);
                $(".flow-title>a").each(function(idx, element) {
                    const $titular = $(element).text();
                    aux.push($titular);                                           
                }) 
                const titularesFinales = aux.filter(titular => titular.includes(req.query.query))
                resolve(titularesFinales);                                               
            })
        })
}
app.listen(5000);