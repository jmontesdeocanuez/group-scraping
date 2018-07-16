const axios = require ('axios');
const cheerio = require ('cheerio');
const url = "http://www.marca.com/";

axios.get(url).then(response =>{
    const $ = cheerio.load(response.data);
    console.log($);
})