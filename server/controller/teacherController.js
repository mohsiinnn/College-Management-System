import subjectModel from "../models/subjectModel.js";
import teacherModel from "../models/teacherModel.js";
import userModel from "../models/userModel.js";

export const createTeacherProfile = async (req, res) => {
    const { subjectId, email } = req.body;
    try {
        // Ensure user exists and is a teacher
        const user = await userModel.findOne({ email: email });
        if (!user || user.role !== 'teacher') {
            return res.json({ success: false, message: "User not found or not a teacher" })
        }

        // Prevent duplicate teacher profiles
        const exists = await teacherModel.findOne({ teacher: user._id });
        if (exists) {
            return res.json({ success: false, message: "Teacher profile already exists" })
        }

        //Creating teacher profile
        const teacher = await teacherModel.create({ teacher: user._id });
        if (!teacher) {
            return res.json({ success: false, message: "There is a problem while creating teacher" });
        }

        // Update the subject's teacher field 
        const subject = await subjectModel.findByIdAndUpdate(subjectId, { teacher: teacher._id }, { new: true });
        if (!subject) {
            return res.json({ success: false, message: "Subject not found" });
        }

        const updateTeacher = await teacherModel.findByIdAndUpdate(teacher._id, { tSubjects: subject._id })
        if (updateTeacher) {
            return res.json({ success: true, data: subject });
        } else {
            return res.json({ success: false, message: "there is an error while updating teacher" });
        }

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}


export const getTeachers = async (req, res) => {
    try {
        const teachers = await teacherModel.find()
            .populate('teacher', 'name')
            .populate({
                path: 'tSubjects',
                model: "subject",
                select: "subjectName"
            })
            .populate('tClass', 'className')

        if (teachers.length > 0) {
            return res.json({ success: true, data: teachers });
        }
        else {
            return res.json({ success: true, message: "No teachers found" });
        }
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}


export const getTeacherDetail = async (req, res) => {
    const { id } = req.params;
    try {
        const teacher = await teacherModel.findById(id)
            .populate("teacher", "name")
            .populate({
                path: 'tSubjects',
                model: "subject",
                select: "subjectName"
            })
            .populate("tClass", "className")
        if (teacher) {
            res.json({ success: true, data: teacher })
        }
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}


export const updateTeacherSubject = async (req, res) => {
    const { subjectId, teacherId } = req.body;
    try {

        // Update the subject's teacher field 
        const subject = await subjectModel.findByIdAndUpdate(subjectId, { teacher: teacherId }, { new: true });
        if (!subject) {
            return res.json({ success: false, message: "Subject not found" });
        }

        // Add the subject to teacher's subjects array
        const teach = await teacherModel.findByIdAndUpdate(teacherId, { tSubjects: subject._id });

        return res.json({ success: true, data: subject })

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}