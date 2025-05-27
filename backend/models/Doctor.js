import mongoose from 'mongoose'

const contactInfoSchema=new mongoose.Schema({
    phoneNumber:{type:String},
    email:{type:String},
    address:{type:String}
})

const doctorSchema=new mongoose.Schema({
    firstName:{type:String,required:true},
    lastName:{type:String,required:true},
    specialization:{type:String},
    contact:contactInfoSchema,
})

const Doctor=mongoose.model('Doctor',doctorSchema)
export default Doctor