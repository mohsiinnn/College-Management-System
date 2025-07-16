import mongoose from "mongoose";

const subjectScheema = new mongoose.Schema({
    subjectName: {
        type: String,
        required: true
    },
    courseCode: {
        type: String,
        required: true,
        unique: true
    },
    className: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'class',
        required: true,
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'teacher'
    }
}, {timestamps: true})

const subjectModel = mongoose.models.subject || mongoose.model('subject', subjectScheema);
export default subjectModel;