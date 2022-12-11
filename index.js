const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

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
  const BASE_URL = "https://phonesdata.com/pt/smartphones/";
  for (let p = 0; p < BRANDS.length; p++) {
    const pathBrand = BRANDS[p] + "/20"; // xx/ no final
    for (let o = 12; o <= 22; o++) {
      const url = BASE_URL + pathBrand + o.toString() + "/";
      let pageResquest = await axios.get(url, BROWSER_HEADERS);
      const html = pageResquest.data;

      const $ = cheerio.load(html);
      for (let i = 0; i <= 50; i++) {
        const selectorImg = `#main > div > div > div.col-md-9.col-sm-7 > div > div:nth-child(${i}) > div > div > a > img`;
        const selectorTitle = `#main > div > div > div.col-md-9.col-sm-7 > div > div:nth-child(${i}) > div > p > a`;
        if ($(selectorTitle).text()) {
          const image = $(selectorImg).attr("data-ezsrc");
          const title = $(selectorTitle).text();
          phonesList.push({ brand: BRANDS[p], model: title, img: image });
        }
      }
      console.log("pagina " + o + " de " + BRANDS[p] + " concluida");
    }
  }
  fs.writeFile("phonesList.json", JSON.stringify(phonesList, null, 4), (err) =>
    console.log("File successfully written!")
  );
  //console.log(phonesList);
  phonesList = [];
  console.log(phonesList, "final");
};

getData();
