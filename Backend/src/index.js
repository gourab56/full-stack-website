
import dotenv from 'dotenv'
dotenv.config(
    {
        path:'../.env'
    }
)
import connectDB from './db/index.js'
import { app } from './app.js';

/*;(async()=>{
    try{
   await   mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)  
    }
    catch(error){
        console.log("Error connecting to MongoDB:", error);
    }
})()*/


connectDB()
.then(()=>{
    app.listen(process.env.PORT||8000,()=>{
        console.log(`Server is running on port ${process.env.PORT||8000}`);   
})
})
.catch((err)=>{
    console.log("Error in connecting to MongoDB:", err);
})
