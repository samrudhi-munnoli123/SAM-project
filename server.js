const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios')

const app = express();


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/welcome', function (request, response) {
    response.sendFile(__dirname + '/pages/Welcome.html')
})


app.get('/register', function (request, response) {
    response.sendFile(__dirname + '/pages/regsiter.html')
})


app.post('/order', (req, res) => {
    const foodItem = req.body.foodItem;
    axios.post('http://localhost:5550/food', req.body)
        .then(function () {
            console.log(`Order received for: ${foodItem}`);
            res.send(`Order received for: ${foodItem}`);

        })
})

app.post('/menu', (req, res) => {
    const foodItem = req.body.foodItem;
    axios.post('http://localhost:5550/food', req.body)
        .then(function () {
            console.log(`Order received for: ${foodItem}`);
            res.send(`Order received for: ${foodItem}`);
        })


        .catch(function () {
            console.log(`Order failed for: ${foodItem}`)
            res.send(`Order failed for: ${foodItem}`)
        })

});


app.get('/menu', (req, res) => {

    const searchQuery = req.query.search || '';  // Get the search query from the request


    axios.get('http://localhost:5550/food')
    .then(function(result){
        console.log('Got data successfully in menu page')
        if(searchQuery){
            const filteredData = result.data.filter(food => 
                food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                food.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                food.description.toLowerCase().includes(searchQuery.toLowerCase())
            );

            // Render the filtered data to the menu page
            res.render('MenuPage.ejs', { data: filteredData, searchQuery });
        }
        else{

            res.render('MenuPage.ejs', {data: result.data})
        }

    })
    .catch(function(){
        console.log("Got some error while fetching all data")
    })
    

});

app.get('/order/:id', (req, res)=>{
    console.log('Id of food item: ', req.params.id)
    axios.get(`http://localhost:5550/food/${req.params.id}`)
    .then(function(result){
        res.render('payment.ejs', {data: result.data})

    })
    .catch(function(error){
        res.send(`Got some error: ${error}`)
    })
    
} )

const PORT = 3003;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
