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
    // teacher: {
    //     type: mongoose.Scheema.Types.ObjectId,
    //     ref: 'teacher'
    // }
}, {timestamps: true})

const subjectModel = mongoose.models.class || mongoose.model('class', subjectScheema);
export default subjectModel;