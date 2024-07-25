import mongoose from "mongoose";

export default async function dbConnection() {
    try {
        mongoose.connect('mongodb://127.0.0.1:27017/hybridSchool')
        console.log('DB is connected')
    } catch (error) {
        console.log(error)
    }
}