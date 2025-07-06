import mongoose from "mongoose";

const classScheema = new mongoose.Schema({
    className: {
        type: String,
        required: true,
        unique: true
    },
    department: {
        type: String,
        required: true,
    },
    teachers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }]
}, { timestamps: true });

const classModel = mongoose.models.class || mongoose.model('class', classScheema);

export default classModel;