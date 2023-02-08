let express = require('express');
let app = express();
let cors = require('cors');
let dotenv = require('dotenv');
dotenv.config()
let port = process.env.PORT || 7700;
let bodyParser = require('body-parser');
let mongo = require('mongodb');
let MongoClient = mongo.MongoClient;
let mongoUrl = process.env.LiveMongo;
let db = {};

// middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('<h1>Hii From Express</h1>')
})

app.get('/sdata', (req, res) => {
    db.collection('sdata').find().toArray((err, result) => {
        if (err) throw err;
        res.send(result)
    })
})

app.get('/locations', (req, res) => {
    db.collection('locations').find().toArray((err, result) => {
        if (err) throw err;
        res.send(result)
    })
})

app.get('/mealtype', (req, res) => {
    db.collection('mealTypes').find().toArray((err, result) => {
        if (err) throw err;
        res.send(result)
    })
})

app.get('/favfood', (req, res) => {
    db.collection('favfood').find().toArray((err, result) => {
        if (err) throw err;
        res.send(result)
    })
})

app.get('/menu/:restid', (req, res) => {
    let id = Number(req.params.restid);
    db.collection('menu').find({restaurant_id:id}).toArray((err, result) => {
        if (err) throw err;
        res.send(result)
    })
})

//menu user selected
app.post('/usermenu', (req, res) => {
    if(Array.isArray(req.body.id)){
        db.collection('menu').find({menu_id:{$in:req.body.id}}).toArray((err, data) => {
           if(err) throw err
           res.send(data);
        })
    }else{
        res.send('Invalid Input')
    }
})

app.get('/restaurants', (req, res) => {
    let stateid = Number(req.query.stateid);
    let mealid = Number(req.query.mealid);
    let query = {};
    if (stateid && mealid) {
        query = { state_id: stateid, "mealTypes.mealtype_id": mealid };
    }
    else if (stateid) {
        query = { state_id: stateid }
    } else if (mealid) {
        query = { "mealTypes.mealtype_id": mealid }
    }
    db.collection('restaurants').find(query).toArray((err, result) => {
        if (err) throw err;
        res.send(result)
    })
})

app.get('/filters/:mealid', (req, res) => {
    let mealid = Number(req.params.mealid);
    let cuisineid = Number(req.query.cuisineid);
    let lcost = Number(req.query.lcost);
    let hcost = Number(req.query.hcost);
    let query = {};
    if (req.query.sort) {
        sort = { cost: req.query.sort };
    }
    if (mealid && cuisineid) {
        query = {
            "mealTypes.mealtype_id": mealid,
            "cuisines.cuisine_id": cuisineid
        };
    } else if (lcost && hcost) {
        query = {
            "mealTypes.mealtype_id": mealid,
            cost: { $gt: lcost, $lt: hcost }
            // $and:[{cost:{$gt:lcost,$lt:hcost}}]
        };
    }
    else if (mealid) {
        query = {
            "mealTypes.mealtype_id": mealid,
        };
    }
    db.collection('restaurants').find(query).sort(sort).toArray((err, result) => {
        if (err) throw err;
        res.send(result);
    })
})

app.get('/restdetails/:restid', (req, res) => {
    //    let id = mongo.ObjectId(req.params.restid);
    let id = Number(req.params.restid);
    db.collection('restaurants').find({restaurant_id: id }).toArray((err, result) => {
        if (err) throw err;
        res.send(result);
    })
})

app.post('/placeorder', (req, res) => {
   db.collection('orders').insert(req.body, (err, result) => {
    if (err) throw err;
    res.send('order placed');   
   })
})

app.get('/vieworder', (req, res)=>{
    let uemail = req.query.email;
    let query ={}
    if(uemail){
        query = {
            email: uemail
        }
    }else{
        query = {}
    }
    db.collection('orders').find(query).toArray((err, result) => {
      if (err) throw err;
      res.send(result);
    })
})

app.put('/updateOrder/:email',(req, res) => {
    let uemail = req.params.email;
    db.collection('orders').updateOne(
        {email:uemail},
        {
            $set: {
                "price": req.body.price,
            }
        },
        (err, result) => {
            if (err) throw err;
            res.send("Order updated successfully");
        }
    )
})

app.delete('/deleteOrder/:id', (req, res) => {
    let _id = mongo.ObjectId(req.params.id);
    db.collection('orders').remove({_id}, (err, result) => {
        if (err) throw err;
        res.send("Order deleted successfully");
    })
})


// connect with mongodb
MongoClient.connect(mongoUrl, { useNewUrlParser: true }, (err, dc) => {
    if (err) console.log('Error while connecting');
    db = dc.db('restaurantsData'); //my database name 
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`)
    })
})

