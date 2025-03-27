// convertToCSV.js
const fs = require('fs');
const { parse } = require('json2csv');

// Lee el archivo JSON convertido
const rawData = fs.readFileSync('007_convertido.json', 'utf-8');
const products = JSON.parse(rawData);

try {
    const csv = parse(products);
    fs.writeFileSync('007_convertido.csv', csv, 'utf-8');
    console.log("Conversión a CSV completada. Archivo guardado como '007_convertido.csv'");
} catch (err) {
    console.error(err);
}