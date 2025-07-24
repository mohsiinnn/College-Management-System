import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    sClass: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'class'
    },
    attendance: [{
        date: {
            type: Date,
            required: true
        },
        status: {
            type: String,
            enum: ['present', 'absent'],
            required: true
        },
        subjectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'subject',
            required: true
        }
    }]
})

const studentModel = mongoose.models.student || mongoose.model('student', studentSchema);

export default studentModel;