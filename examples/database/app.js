// ADDING Modules
const express = require('express');
const path = require("path");
const bodyparser = require("body-parser");
const app = express();

// Specify port
const port = 80;

// _______MONGOOSE______
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true, useUnifiedTopology: true });

// Define mongoose schema
const reviewsSchema = new mongoose.Schema({
    customername: String,
    productname: Number,
    reviews: String,
});

const Reviews = mongoose.model('Reviews',reviewsSchema);

// EXPRESS SPECIFIC STUFF

app.use('/static', express.static('static')); // For serving static files
app.use(express.urlencoded());


// TEMPLATE ENGINE SPECIFIC STUFF
app.set('view engine', 'jsx'); // set the view engine as jsx
app.set('views', path.join(__dirname,'/views')); // set the views directory
app.engine('jsx', require('express-react-views').createEngine());

// ENDPOINTS
app.get('/', (req,res)=>{
    const params = {title: 'Customer Reviews'}
    res.status(200).render('index',params);
});


app.post('/', (req,res)=>{
    const mydata = new Reviews(req.body);
    console.log(mydata);
    const pra = {message: 'Thanks for giving your reviews, Your reviews are submitted.'}
    mydata.save().then(()=>{
        res.render('submitted',pra);
    }).catch(()=>{
        res.status(400).send(" Sorry there's a problem, Item was not saved to the database");
    });
});

//START THE SERVER
app.listen(port,()=>{
    console.log(`The application is running on the port ${port}`);
});