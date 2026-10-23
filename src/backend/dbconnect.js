import mongoose from "mongoose";

const dbconnect = async () => {
    if(mongoose.connection.readyState >=1){
        return
    }
    try {
        await mongoose.connect("mongodb+srv://muhammadrummaniqbal_db_user:root@cluster0.qk4ygws.mongodb.net/minicom")
        console.log("db connected")
    } catch (error) {
        console.log(error)
    }
}
export default dbconnect