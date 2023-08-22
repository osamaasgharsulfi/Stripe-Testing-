const express = require('express');
const keys = require('./config/keys')
const stripe = require('stripe')(keys.stripeSecretKey);
const bodyParser = require('body-parser');
const { engine } = require('express-handlebars');
const app = express()

// Handlebars Middleware
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(`${__dirname}/public`))


// Index Route
app.get('/', (req, res) => {
    res.render('index', {
        stripePublishableKey: keys.stripePublishableKey
    })
})
app.get('/success', (req, res) => {
    res.render('success')
})

// Charge Routes
app.post('/charge', async (req, res) => {
    const amount = 2500;
    // First we create customer and it return us customer ID
    console.log(req.body)
    const customer = await stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken
    })
    // Now we cut charges
    const createCharges = await stripe.charges.create({
        customer: customer.id,
        amount,
        currency: 'usd',
        description: 'Web Development Ebook'
    })
    res.render('success')
})


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server started runing on PORT: ${port}`)
})