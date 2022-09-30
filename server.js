const app = require('./admin');
const express = require('express');
const port = process.env.PORT || 5000;
const bodyParser =  require('body-parser');
const session = require('express-session');
const moment = require('moment');
app.use(express.static(__dirname+'/public'));

app.use(session({secret: 'edurekaSecert'}));
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.set('view engine', 'ejs');
app.set('views', './views');
const news= require('./models/adminnews')

let sess;

app.get('/',(req,res) => {
    sess=req.session;
    sess.email=" "
    console.log(">>>>",sess.email);
    res.render('home',{error: req.query.valid?req.query.valid:'',
                        msg: req.query.msg?req.query.msg:''})
})

app.get('/signup',(req,res) => {
  res.render('signup')
})
app.get('/admin-news', (req,res)=>{
    news.find((err,result) => {
        if(err) throw err;
        res.render('news.ejs',{data:result, moment: moment})
    })
})

app.get('/add-news-form',(req,res) => {
    res.render('newsadd.ejs')
})
// Add bug data
app.post('/add-news', (req,res) => {
    console.log(req)
    news.create(req.body, (err,result) => {
        if(err) throw err;
        console.log('data inserted');
    })
    res.redirect('/admin-news');
})

// Find news by name
app.post('/find_by_name',(req,res) => {
    let title = req.body.title;
    console.log(req)
    news
      .find({title:title}, (err,result) => {
          if(err) throw err;
          res.send(result)
      })
});
// Update news
app.put('/edit_news',(req,res)=>{
    news
        .findOneAndUpdate({"title":req.body.title},{
            $set:{
                title:req.body.title,
                desc:req.body.desc,
                url:req.body.url,
                urltoimage:req.body.urltoimage
            }
        },{
            upsert:true
        },(err,result) => {
            if(err) return res.send(err);
            res.send(result)
        })
})
// Delete news
app.delete('/delete_news',(req,res)=>{
    news
        .findOneAndDelete({"title":req.body.title},{
        },(err,result) => {
            if(err) return res.send(err);
            res.send(result)
        })
})
const server = app.listen(port, () => {
  console.log('Express server listening on port ' + port);
});