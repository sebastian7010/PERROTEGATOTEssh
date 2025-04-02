import fs from 'fs';
import path from 'path';
import axios from 'axios';

// Ruta del archivo JSON y de la carpeta destino
const jsonFilePath = path.resolve(process.cwd(), 'products-updated.json');
const outputFolder = path.resolve(process.cwd(), 'laCarpetaDeLasImagenes');

// Crea la carpeta destino si no existe
if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder, { recursive: true });
}

// Función para descargar una imagen dada una URL y guardarla en outputFolder
async function downloadImage(url) {
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        // Extrae el nombre de archivo de la URL
        const urlObj = new URL(url);
        const filename = path.basename(urlObj.pathname);
        const outputPath = path.join(outputFolder, filename);
        fs.writeFileSync(outputPath, response.data);
        console.log(`Descargado: ${filename}`);
    } catch (error) {
        console.error(`Error descargando ${url}: ${error.message}`);
    }
}

// Función principal para extraer enlaces y descargarlos
async function processProducts() {
    // Lee y parsea el JSON
    const data = fs.readFileSync(jsonFilePath, 'utf8');
    const products = JSON.parse(data);

    // Recorre cada producto y extrae enlaces de 'image' y 'galery'
    const downloadPromises = [];

    products.forEach((product, index) => {
        // Si existe la propiedad image y es un string
        if (product.image && typeof product.image === 'string') {
            downloadPromises.push(downloadImage(product.image));
        }

        // Si existe la propiedad galery, asumiendo que es un array de URLs
        if (product.galery && Array.isArray(product.galery)) {
            product.galery.forEach(url => {
                if (typeof url === 'string') {
                    downloadPromises.push(downloadImage(url));
                }
            });
        }
    });

    await Promise.all(downloadPromises);
    console.log('Descarga completada.');
}

processProducts();