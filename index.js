const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
//middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pbafkul.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
  try {
    const categoryCollection = client.db('goShopDb').collection('categoryCollection');
    const allProductsCollection = client.db('goShopDb').collection('allProductsCollection');
    const watchLaterCollection = client.db('goShopDb').collection('watchLaterCollection');
    const placeOrderCollection = client.db('goShopDb').collection('placeOrderCollection');
    const userCollection = client.db('goShopDb').collection('userCollection');
    //category
    app.get('/category', async (req, res) => {
      const query = {};
      const result = await categoryCollection.find(query).toArray();
      res.send(result);
    });
    app.get('/flashsale', async (req, res) => {
      const query = {};
      const result = await allProductsCollection.find(query).sort({'posted_date':-1}).limit(8).toArray();
      res.send(result);
    });
    //add watch later collection
    app.post('/watchLater', async (req, res) => {
      const watchLater = req.body;
      const id=req.body.product_id;
      const query={product_id:id}
      const findWatchLater=await watchLaterCollection.findOne(query);
      if(findWatchLater){
        res.send(false);
        console.log('already added');
      }else{
        const result = await watchLaterCollection.insertOne(watchLater);
        res.send(result);
  
      }
    });
     //add watch later collection
     app.post('/placeOrder', async (req, res) => {
      const placeOrder = req.body;
      const id=req.body.product_id;
      const query={product_id:id}
      const findOrder=await placeOrderCollection.findOne(query);
      if(findOrder){
        res.send(false);
      }else{
        const result = await placeOrderCollection.insertOne(placeOrder);
        res.send(result);
      }
      

    });

      //myOrder 
      app.get('/myOrder', async (req, res) => {
        const useremail = req.query.email;
        const query = { email: useremail }
        const result = await placeOrderCollection.find(query).toArray();
        res.send(result);
      });

      //myOrder delete 
      app.delete('/myOrder/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await placeOrderCollection.deleteOne(query);
        res.send(result);
      });
    
    
    app.get('/products/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id);
      // console.log(id);
      const query = { category_id: id }
      const result = await allProductsCollection.find(query).toArray();
      res.send(result);
    });

    app.get('/buyProduct/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: ObjectId(id) };
      const result = await allProductsCollection.findOne(query);
      res.send(result);
    });
    // watch later
    app.get('/watchLater', async (req, res) => {
      const Useremail = req.query.email;
      const query = { email: Useremail };
      const result = await watchLaterCollection.find(query).toArray();
      res.send(result);
    });

     
    //add product
    app.post('/addProduct', async (req, res) => {
      console.log(req.body);
      const product = req.body;
      const result = await allProductsCollection.insertOne(product);
      res.send(result);
    });
    //myproduct 
    app.get('/myProduct', async (req, res) => {
      const useremail = req.query.email;
      const query = { email: useremail }
      const result = await allProductsCollection.find(query).toArray();
      res.send(result);
    });
    

    // add user
    app.post('/users', async (req, res) => {
      const users = req.body;
      const result = await userCollection.insertOne(users);
      res.send(result);
    });
    //google update user 
    app.put('/googleUser', async (req, res) => {
      const email = req.query.email;
      const name = req.query.name;
      console.log(name)
      const filter = { email: (email) };
      const option = { upsert: true }
      const updatedDoc = {
        $set: {
          role: 'buyer',
          name: name
        }
      }
      const result = await userCollection.updateOne(filter, updatedDoc, option);
      res.send(result);
    });

    //product delete 
    app.delete('/myProduct/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await allProductsCollection.deleteOne(query);
      res.send(result);
    });

    //get user 
    app.get('/getUser', async (req, res) => {
      const useremail = req.query.email;
      const query = { email: useremail}
      const result = await userCollection.findOne(query);
      console.log(result);
      res.send(result);
    });
// manage USER
    app.get('/ManageUsers', async (req, res) => {
      const query = { role:"buyer"}
      const result = await userCollection.find(query).toArray();
      res.send(result);
    });

// user delete 

app.delete('/user/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: ObjectId(id) };
  const result = await userCollection.deleteOne(query);
  res.send(result);
});
// manage seller
app.get('/ManageSellers', async (req, res) => {
  const query = { role:"seller"}
  const result = await userCollection.find(query).toArray();
  res.send(result);
});

// user delete 

app.delete('/seller/:id', async (req, res) => {
const id = req.params.id;
const query = { _id: ObjectId(id) };
const result = await userCollection.deleteOne(query);
res.send(result);
});

  } finally {

  }

}
run().catch(error => console.log(error));

app.get('/', async (req, res) => {
  res.send('server is running');
});

app.listen(port, () => console.log(`server is running on ${port}`));