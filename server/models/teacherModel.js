import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    tClass: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "class"
    },
    tSubjects: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "subject"
    }
}, { timestamps: true })

const teacherModel = mongoose.models.teacher || mongoose.model('teacher', teacherSchema)

export default teacherModel;