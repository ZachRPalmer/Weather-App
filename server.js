// server.js

const express = require('express')
const app = express()
const argv = require('yargs').argv
const bodyParser = require('body-parser')
const request = require('request')

const port = argv.c || '3000'

let apiKey = ''

app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))

app.set('view engine', 'ejs')

app.get('/', function (req, res) {
  res.render('index')
})

app.post('/', function(req, res){
    let city = req.body.city
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`
    request(url, function(err, response, body){
        if(err)
            res.render('index', {weather: null, error: 'Error, please try again'})
        else{
            let weather = JSON.parse(body)
            console.log(weather)
            if(weather.main == undefined)
                res.render('index', {weather: null, error: 'Error, please check to ensure your spelling is correct'})
            else{
                let output = 
`Today's weather for: ${weather.name} 
Current Temperature: ${weather.main.temp}
Today's High: ${weather.main.temp_max}
Today's Low:  ${weather.main.temp_min}
Humidity:     ${weather.main.humidity}
Wind Speed:   ${weather.wind.speed}`
                console.log(output)
//                    `Current Temperature in ${weather.name}: ${weather.main.temp}`
                res.render('index', {weather: output, error: null})
            }
        }
    })
})

app.listen(port, function () {
  console.log(`Listening on port ${port}`)
})
