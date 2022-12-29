const express = require('express');
const cors = require('cors');
const port=process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const app = express();
//middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pbafkul.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
  try{
    const categoryCollection = client.db('goShopDb').collection('categoryCollection');
  //category
    app.get('/category',async(req,res)=>{
      const query={};
      const result = await categoryCollection.find(query).toArray();
      res.send(result);
    });
  }finally{

  }

}
run().catch(error => console.log(error));

app.get('/',async(req,res)=>{
    res.send('server is running');
});

app.listen(port,()=>console.log(`server is running on ${port}`));