import fs from 'fs';
import path from 'path';
import archiver from 'archiver';

// Ruta de la carpeta que se va a comprimir
const folderToZip = path.resolve(process.cwd(), 'NEW-img-1703');

// Ruta del Escritorio (en Ubuntu generalmente se llama "Escritorio")
const desktopPath = path.resolve(process.env.HOME, 'Escritorio');

// Ruta y nombre del archivo ZIP resultante
const outputZipPath = path.join(desktopPath, 'NEW-img-1703.zip');

// Crear un stream de escritura para el archivo ZIP
const output = fs.createWriteStream(outputZipPath);

// Configurar archiver para generar un ZIP con compresión máxima
const archive = archiver('zip', { zlib: { level: 9 } });

// Cuando se finalice la compresión, muestra un mensaje en la consola
output.on('close', () => {
    console.log(`ZIP creado en el Escritorio: ${outputZipPath} (${archive.pointer()} bytes)`);
});

// Manejo de errores en el proceso de compresión
archive.on('error', err => {
    throw err;
});

// Conectar el stream de salida al objeto archiver
archive.pipe(output);

// Agregar la carpeta a comprimir (sin incluir un directorio extra en el ZIP)
archive.directory(folderToZip, false);

// Finalizar el archivo ZIP
archive.finalize();