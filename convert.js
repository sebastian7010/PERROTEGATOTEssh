// convert.js
const fs = require('fs');

try {
    // Lee el archivo original "007.json"
    const rawData = fs.readFileSync('8.json', 'utf-8');
    const products = JSON.parse(rawData);

    const convertedProducts = products.map(item => {
        // Convierte campos numéricos de string a número
        item.id = Number(item.id);
        item.categoryId = Number(item.categoryId);
        item.price = Number(item.price);

        // Extrae las claves que comienzan con "gallery/" y las junta en un array
        const gallery = [];
        Object.keys(item).forEach(key => {
            if (key.startsWith("gallery/")) {
                gallery.push(item[key]);
                // Elimina la clave original
                delete item[key];
            }
        });

        // Si no existe la propiedad "gallery" o está vacía, se asigna la que se construyó (o la imagen principal si no se obtuvo nada)
        if (!item.gallery || (Array.isArray(item.gallery) && item.gallery.length === 0)) {
            item.gallery = gallery.length > 0 ? gallery : (item.image ? [item.image] : []);
        }

        return item;
    });

    // Escribe el resultado en un nuevo archivo "007_convertido.json"
    fs.writeFileSync('8_convertido.json', JSON.stringify(convertedProducts, null, 2), 'utf-8');
    console.log("Conversión completada. Archivo guardado como '007_convertido.json'");
} catch (error) {
    console.error("Error al convertir el archivo:", error);
}