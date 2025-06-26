
const mongoose = require('mongoose')

const connectToDB = async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected successfully..');
        
    }
    catch(e){
        console.error('MongoDB conncetion failed',e);
        process.exit(1);  
    }
}

module.exports = connectToDB