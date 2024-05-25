const axios = require("axios");
const cheerio = require("cheerio");
const path = require('path');
const fs = require("fs");

// const filePath = path.join(__dirname, './iphone.html');

const BROWSER_HEADERS = {
  headers: { "Accept-Encoding": "gzip,deflate,compress" },
};

const BRANDS = [
  "Apple",
  "Samsung",
  "Motorola",
  "Xiaomi",
  "Asus",
  "Lenovo",
  "Huawei",
  "LG",
];

let phonesList = [];

const getData = async () => {
  // const html = fs.readFileSync(filePath, 'utf8');
  const BASE_URL = "https://phonesdata.com/en/smartphones/";
  for (const brand of BRANDS) {
      const url = BASE_URL + brand;
      let pageResquest = await axios.get(url, BROWSER_HEADERS);
      const html = pageResquest.data;

      const $ = cheerio.load(html);
      $('h3').each((index, element) => {
        const idValue = parseInt($(element).attr('id'), 10);
        if (idValue < 2014) return false;
        $(element).closest('.col-md-12')
        .nextAll()
        .each((i, nextElement) => {
          const nextDiv = $(nextElement);
          if (!(nextDiv.hasClass('col-md-2') && nextDiv.hasClass('col-sm-3') && nextDiv.hasClass('col-xs-3'))) return false;
            const model = nextDiv.find('span').text();
            const imgSrc = nextDiv.find('img').attr('data-ezsrc');
            console.log(imgSrc);
            console.log(model);
            phonesList.push({ model: model, img: imgSrc });
        });
      });
      console.log(brand + " concluida");
  }
  fs.writeFile("phonesList.json", JSON.stringify(phonesList, null, 4), (err) =>
    console.log("File successfully written!")
  );
};

getData();
