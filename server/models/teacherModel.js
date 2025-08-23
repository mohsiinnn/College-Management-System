import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  classes: [
    {
      class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "class",
        required: true
      },
      subjects: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "subject"
        }
      ]
    }
  ]
}, { timestamps: true });

const teacherModel = mongoose.models.teacher || mongoose.model('teacher', teacherSchema);

export default teacherModel;