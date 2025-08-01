import mongoose,{Schema} from 'mongoose'

const workSchema=new Schema({
user:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true
},
title:{
    type:String,
    required:true
},
 githubUrl:{
    type:String
},
description:{
    type:String
},
resumeUrl:{
    type:String
}


    
},{
    timestamps:true
})

export  const Work=mongoose.model("Work",workSchema)