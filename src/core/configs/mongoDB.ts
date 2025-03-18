import mongoose from "mongoose";

export const ConnectDB = async() => {
    console.log('MongoDB connection with retry')
    try{
        await mongoose.connect(process.env.DATABASE_URI!,{

        })
        console.log('Database connected');
    }catch(error:unknown){
        console.log('Database connection failed',error)
        setTimeout(() => {
            ConnectDB()
        },5000)
    }
}