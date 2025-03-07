import mongoose from "mongoose";


const connectDB = async (MONGO_URI) => {
    try {
        const DB_OPTION = {
            dbName: "HS"
        }
        await mongoose.connect(MONGO_URI, DB_OPTION)
        console.log('Connected Successfully...');
        
    }catch (error) {
        console.log(error);
    }
}

export default connectDB;