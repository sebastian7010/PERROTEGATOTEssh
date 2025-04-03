import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// Definir carpetas de entrada y salida
const inputFolder = path.resolve(process.cwd(), 'img1703');
const outputFolder = path.resolve(process.cwd(), 'NEW-img-1703');

// Si la carpeta de salida no existe, se crea
if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder, { recursive: true });
}

// Lista de extensiones de imagen permitidas
const allowedExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp', '.tiff'];

// Lista de extensiones conocidas para eliminar del nombre base (en minúsculas)
const knownExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp', '.tiff'];

let convertedCount = 0;

(async() => {
    const files = fs.readdirSync(inputFolder);

    for (const file of files) {
        const ext = path.extname(file).toLowerCase();

        // Procesar solo archivos con extensiones permitidas
        if (!allowedExtensions.includes(ext)) {
            console.log(`Omitiendo ${file} (formato no permitido)`);
            continue;
        }

        const parsed = path.parse(file);
        let baseName = parsed.name;

        // Si el nombre base termina en alguna de las extensiones conocidas, la elimina.
        // Esto permite que si el archivo se llama "012plat3.jpg", se use solo "012plat3".
        for (const knownExt of knownExtensions) {
            if (baseName.toLowerCase().endsWith(knownExt)) {
                baseName = baseName.slice(0, -knownExt.length);
                break;
            }
        }

        // Genera el nombre final: baseName + .webp
        const outputFile = `${baseName}.webp`;
        const inputPath = path.join(inputFolder, file);
        const outputPath = path.join(outputFolder, outputFile);

        try {
            await sharp(inputPath)
                .toFormat('webp')
                .toFile(outputPath);
            convertedCount++;
            console.log(`Convertido: ${file} -> ${outputFile}`);
        } catch (error) {
            console.error(`Error convirtiendo ${file}: ${error.message}`);
        }
    }

    console.log(`Total de imágenes convertidas: ${convertedCount}`);
})();