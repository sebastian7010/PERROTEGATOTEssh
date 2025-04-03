const fs = require('fs');
const readline = require('readline');

// Cargar el JSON de productos
const products = JSON.parse(fs.readFileSync('products.json', 'utf8'));

// Estadísticas básicas
const totalProducts = products.length;
const totalValue = products.reduce((sum, p) => sum + p.price, 0);
const averagePrice = totalValue / totalProducts;

const cheapestProduct = products.reduce((min, p) => p.price < min.price ? p : min, products[0]);
const mostExpensiveProduct = products.reduce((max, p) => p.price > max.price ? p : max, products[0]);

const sortedByPrice = [...products].sort((a, b) => a.price - b.price);
const fiveCheapest = sortedByPrice.slice(0, 5);
const fiveMostExpensive = sortedByPrice.slice(-5).reverse();

const medianPrice = (totalProducts % 2 === 0) ?
    (sortedByPrice[totalProducts / 2 - 1].price + sortedByPrice[totalProducts / 2].price) / 2 :
    sortedByPrice[Math.floor(totalProducts / 2)].price;

// Producto con precio más cercano al promedio
let productClosestToAverage = products[0];
let minDiff = Math.abs(products[0].price - averagePrice);
for (const p of products) {
    const diff = Math.abs(p.price - averagePrice);
    if (diff < minDiff) {
        minDiff = diff;
        productClosestToAverage = p;
    }
}

// Conteos por comparación al promedio
const countAboveAverage = products.filter(p => p.price > averagePrice).length;
const countBelowAverage = products.filter(p => p.price < averagePrice).length;

// Agrupar productos por categoría (usando categoryId)
const groupByCategory = products.reduce((acc, p) => {
    const cat = p.categoryId;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(p);
    return acc;
}, {});

const categoryStats = {};
for (const cat in groupByCategory) {
    const arr = groupByCategory[cat];
    const count = arr.length;
    const totalCat = arr.reduce((sum, p) => sum + p.price, 0);
    const avgCat = totalCat / count;
    categoryStats[cat] = { count, totalCat, avgCat };
}

// Porcentajes del total por categoría
const categoryPercentages = {};
for (const cat in categoryStats) {
    categoryPercentages[cat] = ((categoryStats[cat].totalCat / totalValue) * 100).toFixed(2) + '%';
}

// Distribución de productos por rangos de precio
const rangeBelow20k = products.filter(p => p.price < 20000).length;
const range20kto50k = products.filter(p => p.price >= 20000 && p.price < 50000).length;
const range50kto100k = products.filter(p => p.price >= 50000 && p.price < 100000).length;
const rangeAbove100k = products.filter(p => p.price >= 100000).length;

// Conteo por palabra clave en el nombre
const countMaleta = products.filter(p => p.name.toLowerCase().includes("maleta")).length;
const countRopa = products.filter(p => p.name.toLowerCase().includes("ropa")).length;

// Promedio de precio para productos con "maleta" en el nombre
const maletaProducts = products.filter(p => p.name.toLowerCase().includes("maleta"));
const averageMaleta = maletaProducts.reduce((sum, p) => sum + p.price, 0) / (maletaProducts.length || 1);

// Conteo de productos con "premium" en la descripción
const countPremium = products.filter(p => p.description.toLowerCase().includes("premium")).length;

// Conteo de imágenes según su extensión
const countJpg = products.filter(p => p.image.toLowerCase().endsWith('.jpg')).length;
const countPng = products.filter(p => p.image.toLowerCase().endsWith('.png')).length;

// Conteo de productos con galería de más de 2 imágenes
const countGalleryMoreThan2 = products.filter(p => Array.isArray(p.gallery) && p.gallery.length > 2).length;

// Nombres duplicados
const nameCounts = {};
products.forEach(p => {
    const name = p.name;
    nameCounts[name] = (nameCounts[name] || 0) + 1;
});
const duplicateNames = Object.entries(nameCounts)
    .filter(([name, count]) => count > 1)
    .map(([name]) => name);

// Conteo de productos con descripción corta (menos de 10 palabras)
const countShortDescription = products.filter(p => {
    if (!p.description) return true;
    const words = p.description.trim().split(/\s+/).length;
    return words < 10;
}).length;

// Producto con mayor cantidad de palabras en la descripción
let productMaxWords = null;
let maxWords = 0;
products.forEach(p => {
    if (p.description) {
        const words = p.description.trim().split(/\s+/).length;
        if (words > maxWords) {
            maxWords = words;
            productMaxWords = p;
        }
    }
});

// Producto con menor cantidad de palabras en la descripción (excluyendo vacíos)
let productMinWords = null;
let minWords = Infinity;
products.forEach(p => {
    if (p.description && p.description.trim().length > 0) {
        const words = p.description.trim().split(/\s+/).length;
        if (words < minWords) {
            minWords = words;
            productMinWords = p;
        }
    }
});

// Definir 40 preguntas y respuestas
const questions = [
    { question: "1. ¿Cuántos productos tengo en total?", answer: totalProducts },
    { question: "2. ¿Cuál es el valor total del inventario?", answer: "$" + totalValue.toLocaleString() },
    { question: "3. ¿Cuál es el precio promedio de mis productos?", answer: "$" + averagePrice.toFixed(2) },
    { question: "4. ¿Cuál es el producto más barato y su precio?", answer: `${cheapestProduct.name} - $${cheapestProduct.price.toLocaleString()}` },
    { question: "5. ¿Cuál es el producto más caro y su precio?", answer: `${mostExpensiveProduct.name} - $${mostExpensiveProduct.price.toLocaleString()}` },
    { question: "6. ¿Cuántos productos hay por cada categoría?", answer: Object.entries(categoryStats).map(([cat, stat]) => `Categoría ${cat}: ${stat.count}`).join(" | ") },
    { question: "7. ¿Cuál es el valor total de productos por cada categoría?", answer: Object.entries(categoryStats).map(([cat, stat]) => `Categoría ${cat}: $${stat.totalCat.toLocaleString()}`).join(" | ") },
    { question: "8. ¿Cuál es la categoría con el mayor valor total?", answer: `Categoría ${Object.entries(categoryStats).sort(([,a],[,b]) => b.totalCat - a.totalCat)[0][0]}` },
    { question: "9. ¿Cuál es la categoría con el mayor número de productos?", answer: `Categoría ${Object.entries(categoryStats).sort(([,a],[,b]) => b.count - a.count)[0][0]}` },
    { question: "10. ¿Cuáles son los 5 productos más caros?", answer: fiveMostExpensive.map(p => `${p.name} ($${p.price.toLocaleString()})`).join(" | ") },
    { question: "11. ¿Cuáles son los 5 productos más baratos?", answer: fiveCheapest.map(p => `${p.name} ($${p.price.toLocaleString()})`).join(" | ") },
    { question: "12. ¿Cuál es el precio mediano de mis productos?", answer: "$" + medianPrice.toFixed(2) },
    { question: "13. ¿Cuál producto tiene el precio más cercano al promedio?", answer: `${productClosestToAverage.name} ($${productClosestToAverage.price.toLocaleString()})` },
    { question: "14. ¿Cuántos productos tienen un precio superior al promedio?", answer: countAboveAverage },
    { question: "15. ¿Cuántos productos tienen un precio inferior al promedio?", answer: countBelowAverage },
    { question: "16. ¿Cuáles son los totales (cantidad y valor) por categoría?", answer: Object.entries(categoryStats).map(([cat, stat]) => `Categoría ${cat}: ${stat.count} productos, $${stat.totalCat.toLocaleString()}`).join(" | ") },
    { question: "17. ¿Cuál es el precio promedio por categoría?", answer: Object.entries(categoryStats).map(([cat, stat]) => `Categoría ${cat}: $${stat.avgCat.toFixed(2)}`).join(" | ") },
    { question: "18. ¿Qué porcentaje del valor total representa cada categoría?", answer: Object.entries(categoryPercentages).map(([cat, perc]) => `Categoría ${cat}: ${perc}`).join(" | ") },
    { question: "19. ¿Cuál es la diferencia de precio entre el producto más caro y el más barato?", answer: "$" + (mostExpensiveProduct.price - cheapestProduct.price).toLocaleString() },
    { question: "20. ¿Cuál es el rango de precios (mínimo y máximo)?", answer: `Mínimo: $${cheapestProduct.price.toLocaleString()}, Máximo: $${mostExpensiveProduct.price.toLocaleString()}` },
    { question: "21. ¿Cuántos productos tienen un precio superior al promedio?", answer: countAboveAverage },
    { question: "22. ¿Cuántos productos tienen un precio inferior al promedio?", answer: countBelowAverage },
    { question: "23. ¿Cuál es la suma total de precios por categoría?", answer: Object.entries(categoryStats).map(([cat, stat]) => `Categoría ${cat}: $${stat.totalCat.toLocaleString()}`).join(" | ") },
    { question: "24. ¿Cuál es el promedio de precio por categoría?", answer: Object.entries(categoryStats).map(([cat, stat]) => `Categoría ${cat}: $${stat.avgCat.toFixed(2)}`).join(" | ") },
    { question: "25. ¿Cuántos productos tienen 'premium' en la descripción?", answer: countPremium },
    { question: "26. ¿Cuántos productos tienen imagen en formato .jpg?", answer: countJpg },
    { question: "27. ¿Cuántos productos tienen imagen en formato .png?", answer: countPng },
    { question: "28. ¿Cuántos productos tienen una galería con más de 2 imágenes?", answer: countGalleryMoreThan2 },
    { question: "29. ¿Cuáles son los nombres duplicados de productos?", answer: duplicateNames.length > 0 ? duplicateNames.join(" | ") : "Ninguno" },
    { question: "30. ¿Cuántos productos tienen descripción corta (menos de 10 palabras)?", answer: countShortDescription },
    { question: "31. ¿Cuál es el valor total de inventario de la categoría 1?", answer: categoryStats["1"] ? "$" + categoryStats["1"].totalCat.toLocaleString() : "No hay categoría 1" },
    { question: "32. ¿Cuáles productos tienen precio inferior a $20,000?", answer: products.filter(p => p.price < 20000).map(p => p.name).join(" | ") || "Ninguno" },
    { question: "33. ¿Cuáles productos tienen precio superior a $100,000?", answer: products.filter(p => p.price >= 100000).map(p => p.name).join(" | ") || "Ninguno" },
    { question: "34. ¿Cuántos productos tienen precio entre $50,000 y $100,000?", answer: products.filter(p => p.price >= 50000 && p.price < 100000).length },
    { question: "35. ¿Cuál es la distribución de productos por rango de precio: <20k, 20k-50k, 50k-100k, >100k?", answer: `<20k: ${rangeBelow20k}, 20k-50k: ${range20kto50k}, 50k-100k: ${range50kto100k}, >100k: ${rangeAbove100k}` },
    { question: "36. ¿Cuántos productos tienen 'maleta' en el nombre?", answer: countMaleta },
    { question: "37. ¿Cuántos productos tienen 'ropa' en el nombre?", answer: countRopa },
    { question: "38. ¿Cuál es el precio promedio de los productos que tienen 'maleta' en el nombre?", answer: "$" + (maletaProducts.length ? averageMaleta.toFixed(2) : "0") },
    { question: "39. ¿Cuál producto tiene la mayor cantidad de palabras en su descripción?", answer: productMaxWords ? `${productMaxWords.name} (${maxWords} palabras)` : "Ninguno" },
    { question: "40. ¿Cuál producto tiene la menor cantidad de palabras en su descripción (excluyendo vacíos)?", answer: productMinWords ? `${productMinWords.name} (${minWords} palabras)` : "Ninguno" }
];

// Crear la interfaz de readline para recibir el número de la pregunta
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log("=== Análisis de productos (products.json) ===");
console.log("Ingresa un número del 1 al 40 para ver la respuesta de esa pregunta, o 'q' para salir.");

rl.on('line', (input) => {
    if (input.trim().toLowerCase() === 'q') {
        rl.close();
        return;
    }
    const num = parseInt(input.trim());
    if (isNaN(num) || num < 1 || num > 40) {
        console.log("Por favor, ingresa un número válido entre 1 y 40, o 'q' para salir.");
    } else {
        const qa = questions[num - 1];
        console.log(`\n${qa.question}`);
        console.log("Respuesta:", qa.answer, "\n");
    }
    console.log("Ingresa otro número (1-40) para ver otra pregunta, o 'q' para salir.");
});

rl.on('close', () => {
    console.log("Fin del análisis.");
});