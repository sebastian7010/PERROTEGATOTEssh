const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: 'production', // 'development' para desarrollo o 'production' para producción
    entry: './script.js', // Ajusta la ruta a tu archivo principal
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist') // Carpeta de salida
    },
    module: {
        rules: [{
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader' // Transpila tu código JS
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader'] // Procesa archivos CSS
            },
            {
                test: /\.(png|jpe?g|gif|webp)$/i,
                type: 'asset', // Gestiona imágenes
                parser: {
                    dataUrlCondition: {
                        maxSize: 10 * 1024 // Puedes ajustar el límite (10KB)
                    }
                }
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'styles.css',
        })
    ]
};