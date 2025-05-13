import mongoose from 'mongoose'

const prescriptionSchema=new mongoose.Schema({
    patientId:{type:ObjectId,required:true},
    prescribedBy:{type:ObjectId,required:true},
    medicationId:{type:ObjectId,required:true},
    dosage:{type:String,required:true},
    frequency:{type:String,required:true},
    route:{type:String,required:true},
    duration:{type:String,required:true},
    datePrescribed:{type:Date,required:true},
    instructions:{type:String,required:true},
    status:{type:String}
})

const Prescription=mongoose.model('Prescription',prescriptionSchema)
export default Prescription