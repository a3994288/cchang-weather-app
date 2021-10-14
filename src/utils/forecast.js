const request = require('request');

const forecast = (longitude, latitude, callback) => {
    const url = 'http://api.weatherstack.com/current?access_key=763f49380f7ae7246fcb7dc97e5dc08f&query=' + encodeURIComponent(latitude) + ',' + encodeURIComponent(longitude);
    request({ url, json: true }, (error, {body}={}) => {
        if (error) {
            callback(error);
        } else if (body.error) {
            callback(body.error);
        }
        else {
            callback(undefined, body.current);
        }

    })
}

module.exports = forecast;