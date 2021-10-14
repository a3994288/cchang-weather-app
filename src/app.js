const path = require('path');
const express = require('express');
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')
const hbs = require('hbs');

const app = express();
const port = process.env.PORT || 3000;
//Define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials')

//setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

//setup static dir to serve
app.use(express.static(publicDirectoryPath))
app.get('', (req, res) => {
    res.render('index', {
        title: 'weather app',
        name: 'home'
    });
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'weather app',
        name: 'about'
    });
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'weather app',
        name: 'help'
    });
})

app.get('/weather', (req, res) => {
    const address = req.query.address;
    if (!address) {
        return res.send({
            error: 'you must provide a address'
        })
    }
    geocode(address, (error, {longitude, latitude, location}={}) => {
        if (error) {
            return res.send({error})
        }
    
        forecast(longitude,latitude, (error, forecastdata) => {
            if (error) {
                return res.send({error})
            } 
            res.send({
                forecast: forecastdata.weather_descriptions[0],
                address,
                location
            })
        })
    })
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'you must provide a search term'
        })
    }
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: 'Help Error',
        name: 'error',
        errormessage: 'help page not exist'
    });
})

app.get('*', (req, res) => {
    res.render('404', {
        title: 'Generic error',
        name: 'error',
        errormessage: 'page not exist'
    });
})

app.listen(port, () => {
    console.log('server is running on port '+ port);
});