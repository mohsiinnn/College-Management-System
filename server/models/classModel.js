import mongoose from "mongoose";

const classScheema = new mongoose.Schema({
    className: {
        type: String,
        required: true
    },
    department: {
        type: String
    },
    // teachers: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'user'
    // }],  
    student: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }]
}, { timestamps: true });

const classModel = mongoose.models.class || mongoose.model('class', classScheema);

export default classModel;