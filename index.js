const mongo = require('mongoose')
const express = require('express')
require('dotenv').config()

const app = express()
const port  = process.env.port
const mongo_url = process.env.mongourl  
app.use(express.json())

mongo.connect(mongo_url)
.then((req,res)=>{
    console.log("database is connected")
}).catch((err)=>{
    console.log("there is an error in connecting database",err)
})

const salesSchema = mongo.Schema({
    productName:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }
})

const sales = mongo.model('sales',salesSchema)

app.get('/findall',async(req,res)=>{
    try{
        const result = await sales.find()
        res.status(200).json(result) 

    }catch(err){
        res.status(500).json({message:"ther is an error in fetching data",err})

    }
})

app.delete('/delete/:id',async(req,res)=>{
    try{
        const result = await sales.findByIdAndDelete(req.params.id)
        if(!result){
            res.status(404).json({message:"data is not found"})
        }
        res.status(200).json(result)
    }catch(err){
        res.status(500).json({message:"there is an error in delete operation",err})
    }
})

app.post('/add',async(req,res)=>{
    try{
        const newsale = new sales(req.body)
        const savedsale = await newsale.save()
        res.status(200).json(savedsale)
    }catch(err){
        res.status(500).json({message:"there is an error in adding sale",err})
    }
    
})

app.put('/update/:id',async(req,res)=>{
    try{
        const updatedsale = await sales.findByIdAndUpdate(req.params.id,req.body,{
            new:true
        })
        if(!updatedsale){
            res.status(404).json({message:"data is not found"})
        }
        res.status(200).json(updatedsale)
    }catch(err){
        res.status(500).json({message:"there is an error in update operation",err})
    }
    
})



app.listen(port,()=>{
    console.log("port is running")
})