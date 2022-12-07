var path = require('path');

module.exports = {
    mode: 'development',
    entry: path.join(__dirname, 'srcjs', 'datetimePicker.jsx'),
    output: {
        path: path.join(__dirname, 'inst/www/shinyDatetimePickers/datetimePicker'),
        filename: 'datetimePicker.js'
    },
    module: {
        rules: [
        {
          test: /\.jsx?$/,
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  targets: {
                    esmodules: true
                  }
                }
              ],
              '@babel/preset-react'
            ],
            plugins: ["@babel/plugin-syntax-dynamic-import"]
          }
        },
            {
                test: /\.css$/,
                use: 'css-loader'
            }
        ]
    },
    externals: {
        'react': 'window.React',
        'react-dom': 'window.ReactDOM',
        'reactR': 'window.reactR'
    },
    stats: {
        colors: true
    },
    devtool: 'source-map'
};
