const express = require('express')
const http = require('http')
const path = require('path')
const request = require('request')
const Mongoose = require('mongoose')
const moment = require('moment')
const LocalStorage = require('node-localstorage').LocalStorage;
let localStorage = new LocalStorage('./scratch');

let io = require('socket.io');
var geoip = require('geoip-lite')
const { exec } = require('child_process')

const bodyParser = require('body-parser')
const app = express()
const sgMail = require('@sendgrid/mail')
const sendgridAPIKey = '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'
sgMail.setApiKey(sendgridAPIKey)

var mongourl = Mongoose.connect('mongodb://127.0.0.1:27017/edureka')
import news from './models/news'
app.use(express.static(__dirname+'/public'))

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

app.set('view-engine', 'ejs')
app.set('views', './views')
exec('curl ip-adresim.app', function(error, stdout, stderr){
    
    var ipaddress = stdout
    var geo = geoip.lookup(ipaddress.trim())
    console.log(geo)
    var weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${geo.ll[0]}&lon=${geo.ll[1]}&appid=a00c884130f91f44ecf831a3b28771cd`
    app.get("/", (req, res) => {
        request(weatherURL, {json: true}, (err, body) => {
            var sortArr = { date: -1 }
            news.find((err,newsres) => {
                if(err) throw err;
                res.render('index.ejs', {result: body.body.main, geo: geo, news: newsres})
            }).sort(sortArr).limit(3)
            
        })
        
    })
    app.get('/contact-us', (req, res) => {
        res.render('contactus.ejs')
    })
    app.post("/send_mail", (req, res) => {
        sgMail.send({
            to: 'xyz@edureka.co',
            from: req.body.email,
            subject: 'Contact us query',
            text: `Your query is ${req.body.query}`
        })
    })
    app.get('/about-us', (req, res) => {
        res.render('about.ejs')
    })
})
// For socket


// Set up express
let server = http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});

// Set up socket.io
io = require('socket.io').listen(server);


// Handle socket traffic
io.sockets.on('connection',  (socket) => {

    var list = io.sockets.sockets;
    var users = Object.keys(list);
   
    // Set the nickname property for a given client
    socket.on('nick', (nick) => {
        socket.set('nickname', nick);
        socket.emit('userlist', users);
    });

    // Relay chat data to all clients
    socket.on('chat', (data) => {
        socket.get('nickname', (err, nick) => {
            localStorage.setItem('userlocal',moment().format('YYYY-MM-DD'))

            let nickname = err ? 'Anonymous' : nick;

            let payload = {
                message: data.message,
                nick: nickname,
                time:localStorage.getItem('userlocal')
            };

            socket.emit('chat',payload);
            socket.broadcast.emit('chat', payload);
        });
    });
});

app.listen(3000, (err, data) => {
    if (err) throw err
    console.log('Application running on port 3000')
})