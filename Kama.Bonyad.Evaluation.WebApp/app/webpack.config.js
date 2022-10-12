const path = require('path')
    , glob = require('glob')
    , webpack = require('webpack')
    , package = require('./package.json')
    , UglifyJSPlugin = require('uglifyjs-webpack-plugin')
    , ExtractTextPlugin = require('extract-text-webpack-plugin')
    , CopyWebpackPlugin = require('copy-webpack-plugin')
    , HtmlWebpackPlugin = require('html-webpack-plugin')
    , WebpackVersionFilePlugin = require('webpack-version-file-plugin')
    , extractSass = new ExtractTextPlugin({ filename: 'styles.css' })
    , buildMode = 'prod'; // 'dev' or 'prod'

module.exports = {
    entry: {
        'app': [
            './app.module.js'
            , './app.config.js'
            , './app.run.js'
        ].concat(glob.sync('./pages/**/*.js')).concat(glob.sync('./services/**/*.js')).concat(glob.sync('./directives/**/*.js'))
    }
    , output: {
        filename: '[name].bundle.js'
        , path: path.resolve(__dirname, 'dist')
    }
    , plugins: getPlugins()
    , module: {
        rules: [{
            test: /\.scss$/
            , exclude: /node_modules/
            , use: extractSass.extract({
                use: [
                    {
                        loader: 'css-loader'
                        , options: (buildMode === 'prod' ? { minimize: true } : { sourceMap: true })
                    }
                    , {
                        loader: 'sass-loader'
                        , options: (buildMode === 'prod' ? {} : { sourceMap: true })
                    }
                ]
            })
        }, {
            test: /\.js$/
            , use: {
                loader: 'babel-loader'
                , query: {
                    presets: ['@babel/preset-env']
                }
            }
        }, {
            test: /\.(eot|woff|ttf)$/
            , exclude: /node_modules/
            , include: path.join(__dirname, '')
            , loader: 'file-loader'
        }, {
            test: /\.(jpg|png)$/
            , exclude: /node_modules/
            , include: path.join(__dirname, '')
            , loader: 'file-loader?name=/assets/images/[name].[ext]'
        }, {
            test: /\.html$/
            , use: [{
                loader: 'html-loader',
                options: (buildMode === 'prod' ? { minimize: true } : {})
            }]
        }]
    }
}

function getPlugins() {
    let plugins = [
        extractSass
        , new WebpackVersionFilePlugin({
            packageFile: path.join(__dirname, 'package.json')
            , templateString: '{"name": "<%= package.name %>", "buildDate": "<%= extras.date %>", "buildTime": "<%= extras.time %>", "version": "<%= package.version %>"}'
            , outputFile: path.join('./', 'version.json')
            , extras: {
                'date': Date.now()
                , 'time': new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
            }
        })
        , new HtmlWebpackPlugin({
            filename: '../../Views/Inside/Index.cshtml'
            , hash: true
            , meta: { charset: 'utf-8' }
            //, minify: (buildMode === 'prod' ? { collapseWhitespace: true } : {})
            , template: '../Views/Inside/IndexTemplate.cshtml'
        })
        , new HtmlWebpackPlugin({
            filename: '../../Views/Outside/Index.cshtml'
            , hash: true
            //, minify: (buildMode === 'prod' ? { collapseWhitespace: true } : {})
            , template: '../Views/Outside/IndexTemplate.cshtml'
        })
        , new CopyWebpackPlugin([
            { context: './node_modules/bootstrap/dist/', from: '**/bootstrap.min.*', to: 'plugins/bootstrap' }
            , { context: './node_modules/bootstrap/dist/', from: 'fonts/*.*', to: 'plugins/bootstrap' }
            , { context: './node_modules/font-awesome/', from: 'css/font-awesome.min.*', to: 'plugins/font-awesome' }
            , { context: './node_modules/font-awesome/', from: 'fonts/*.*', to: 'plugins/font-awesome' }
            , { context: './node_modules/jquery/dist/', from: 'jquery.min.*', to: 'plugins/jquery' }
            , { from: './node_modules/select2/dist/js/select2.min.js', to: 'plugins/select2' }
            , { from: './node_modules/select2/dist/js/i18n/fa.js', to: 'plugins/select2' }
            , { from: './node_modules/select2/dist/css/select2.min.css', to: 'plugins/select2' }
            , { from: './node_modules/select2-bootstrap-theme/dist/select2-bootstrap.min.css', to: 'plugins/select2' }
            , { from: './node_modules/kamadatepicker/dist/kamadatepicker.min.js', to: 'plugins/kama' }
            , { from: './node_modules/kamadatepicker/dist/kamadatepicker.min.css', to: 'plugins/kama' }
            , { context: './node_modules/kama-angularjs-module/dist/', from: '*.*', to: 'plugins/kama' }
            , { context: './node_modules/tree-grid-directive/src/', from: '*.*', to: 'plugins/angular' }
            , { from: './node_modules/angular/angular.min.js', to: 'plugins/angular' }
            , { from: './node_modules/angular-sanitize/angular-sanitize.min.js', to: 'plugins/angular' }
            , { from: './node_modules/angular-route/angular-route.min.js', to: 'plugins/angular' }
            , { from: './node_modules/angular-animate/angular-animate.min.js', to: 'plugins/angular' }
            , { from: './node_modules/angular-smart-table/dist/smart-table.min.js', to: 'plugins/angular' }
            , { from: './node_modules/ngstorage/ngStorage.min.js', to: 'plugins/angular' }
            , { context: './node_modules/kama-ckeditor/ckeditor/', from: 'lang/*.*', to: 'plugins/ckeditor' }
            , { context: './node_modules/kama-ckeditor/ckeditor/', from: 'plugins/**/*.*', to: 'plugins/ckeditor' }
            , { context: './node_modules/kama-ckeditor/ckeditor/', from: 'skins/**/*.*', to: 'plugins/ckeditor' }
            , { context: './node_modules/kama-ckeditor/ckeditor/', from: '*.js', to: 'plugins/ckeditor' }
            , { context: './node_modules/kama-ckeditor/ckeditor/', from: '*.css', to: 'plugins/ckeditor' }
            , { context: './node_modules/kama-lvl-drag-drop/script/', from: '*.*', to: 'plugins/kama' }
        ])
    ];

    if (buildMode === 'prod') {
        plugins.push(new UglifyJSPlugin());
        plugins.push(new webpack.BannerPlugin(`${package.name} - version ${package.version}`));
    }
    else if (buildMode === 'dev') {
        plugins.push(new webpack.BannerPlugin({ banner: '//@ sourceURL=[name].js', raw: true }));
    }

    return plugins;
}