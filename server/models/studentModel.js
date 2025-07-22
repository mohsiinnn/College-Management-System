import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    sClass: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'class'
    }
})

const studentModel = mongoose.models.student || mongoose.model('student', studentSchema);

export default studentModel;