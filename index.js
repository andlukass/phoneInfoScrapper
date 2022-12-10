const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');


const BROWSER_HEADERS = { 
    headers: { "Accept-Encoding": "gzip,deflate,compress" } 
}

let phonesList = [];

const getMotorola = async () => {
    const BASE_URL = 'https://phonesdata.com/pt/smartphones/'
    const pathMotorola = 'motorola/20'  // xx/ no final
    for (let o=13;o <= 22;o++){
    const url = BASE_URL + pathMotorola + o.toString() + '/'
    let pageResquest = await axios.get(url, BROWSER_HEADERS);
    const html = pageResquest.data

    const $ = cheerio.load(html);
    for (let i=0;i<=50;i++){
        const selectorImg = `#main > div > div > div.col-md-9.col-sm-7 > div > div:nth-child(10) > div > div > a > img`
        const selectorTitle = `#main > div > div > div.col-md-9.col-sm-7 > div > div:nth-child(${i}) > div > p > a`
        if($(selectorTitle).text()){
            const image = $(selectorImg).attr('data-ezsrc');
            const title = $(selectorTitle).text();
            phonesList.push( {brand: 'motorola', model: title, img: image})
        }
    }
console.log('pagina'+o+'concluida')

};
fs.writeFile('phonesList.json', 
                          JSON.stringify(phonesList, null, 4), 
                          (err)=> console.log('File successfully written!'))
//console.log(phonesList);
phonesList = [];
console.log(phonesList,'final')
};

getMotorola();