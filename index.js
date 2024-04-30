const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app=express();
const port=process.env.PORT||5000;


// middleware
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9ttivus.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const paintingCollection=client.db('paintingDB').collection('painting')
    const craftCollection=client.db('craftDB').collection('craft')
    const userCollection=client.db('craftDB').collection('user')

    app.get('/painting', async(req,res)=>{
      const cursor=paintingCollection.find();
      const result=await cursor.toArray();
      res.send(result);
    })
    app.get('/alCraft', async(req,res)=>{
      const cursor=craftCollection.find();
      const result=await cursor.toArray();
      res.send(result);
    })

    app.get('/myProduct', async (req, res) => {
      const userEmail = req.query.email;
      console.log(userEmail);
      const result = await craftCollection.find({ email: userEmail }).toArray();
      res.send(result);
  });
  

  app.get('/singleProduct/:id', async(req,res)=>{
    const result=await craftCollection.findOne({_id:new ObjectId(req.params.id)})
    res.send(result)
  })

   app.post('/alCraft',async(req,res)=>{
    const newCraft=req.body;
    console.log(newCraft);
    const result=await craftCollection.insertOne(newCraft)
    res.send(result)
   }) 


   app.put('/alCraft/:id',async(req,res)=>{
    const id =req.params.id;
    const filter={_id:new ObjectId(id)}
    const options={upsert :true}
    const updatedCraft=req.body;
    const craft={
      $set:{
        name:updatedCraft.name,
        subcategory:updatedCraft.subcategory,
        price:updatedCraft.price,
        image:updatedCraft.image,
        short_description:updatedCraft.short_description,
        ratting:updatedCraft.ratting,
        Customization:updatedCraft.Customization,
        ProccessingTime:updatedCraft.ProccessingTime,
        email:updatedCraft.email
      }
    }
    const result=await craftCollection.updateOne(filter,craft,options);
    res.send(result);

   })

app.delete('/alCraft/:id',async(req,res)=>{
  const id =req.params.id;
  const query={_id:new ObjectId(id)}
  const result=await craftCollection.deleteOne(query);
  console.log(result);
  res.send(result)
})


app.get('/alCraft/:id',async(req,res)=>{
  const id=req.params.id
  const query={_id:new ObjectId(id)}
  const result=await craftCollection.findOne(query);
  res.send(result)
})

  //  user related api
app.get('/user',async(req,res)=>{
  const cursor=userCollection.find();
  const users=await cursor.toArray();
  res.send(users)
})

  // app.post('/user',async(req,res)=>{
  //   const user=req.body;
  //   console.log(user);
  //   const result=await userCollection.insertOne(user);
  //   res.send(result)
  // })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('landscape server is running')
})

app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
})