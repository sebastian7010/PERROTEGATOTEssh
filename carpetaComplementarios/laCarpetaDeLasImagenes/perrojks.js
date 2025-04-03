const fs = require('fs');

// Ruta de lectura: "products.json" en la raíz del proyecto
const inputFilePath = 'products.json';

// Ruta de escritura: en la carpeta "perro", se guardará "perro.json"
const outputFilePath = 'gato/gato.json';

// Lee el archivo "products.json"
fs.readFile(inputFilePath, 'utf8', (err, data) => {
    if (err) {
        console.error(`Error al leer ${inputFilePath}:`, err);
        return;
    }

    if (!data.trim()) {
        console.error(`El archivo ${inputFilePath} está vacío.`);
        return;
    }

    try {
        // Se asume que el JSON es un arreglo de objetos
        const jsonData = JSON.parse(data);

        // Filtra los objetos cuya propiedad "categoryId" esté entre 1 y 4
        const resultado = jsonData.filter(item => item.categoryId >= 5 && item.categoryId <= 8);

        // Escribe el resultado en "perro.json"
        fs.writeFile(outputFilePath, JSON.stringify(resultado, null, 2), (err) => {
            if (err) {
                console.error(`Error al escribir ${outputFilePath}:`, err);
            } else {
                console.log(`El archivo ${outputFilePath} se ha creado correctamente.`);
            }
        });
    } catch (error) {
        console.error('Error al parsear el JSON:', error);
    }
});