// import classModel from "../models/classModel.js";
import subjectModel from "../models/subjectModel.js";
import teacherModel from "../models/teacherModel.js";
import userModel from "../models/userModel.js";

export const createTeacherProfile = async (req, res) => {
    const subjectId = req.params.id;
    const { email } = req.body;
    try {
        const user = await userModel.findOne({ email: email });
        if (!user || user.role !== 'teacher') {
            return res.json({ success: false, message: "User not found or not a teacher" })
        }

        const exists = await teacherModel.findOne({ teacher: user._id });
        if (exists) {
            return res.json({ success: false, message: "Teacher profile already exists" })
        }

        const teacher = await teacherModel.create({ teacher: user._id });
        if (!teacher) {
            return res.json({ success: false, message: "There is a problem while creating teacher" });
        }

        // Update the subject's teacher field 
        const subject = await subjectModel.findByIdAndUpdate(subjectId, { teacher: teacher._id }, { new: true });
        if (!subject) {
            return res.json({ success: false, message: "Subject not found" });
        }

        const updateTeacher = await teacherModel.findByIdAndUpdate(teacher._id, { tSubjects: subject._id }, { new: true }).populate("teacher", "name").populate("tSubjects", "subjectName")
        if (updateTeacher) {
            return res.json({ success: true, data: updateTeacher });
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
        // .populate('tClass', 'className')
        if (teacher) {
            return res.json({ success: true, data: teacher });
        } else {
            return res.json({ success: true, message: "No teacher found" });
        }
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}


export const updateTeacherSubject = async (req, res) => {
    const subjectId = req.params.id;
    const { teacherId } = req.body;
    try {

        // Update the subject's teacher field 
        const subject = await subjectModel.findByIdAndUpdate(subjectId, { teacher: teacherId }, { new: true });
        if (!subject) {
            return res.json({ success: false, message: "Subject not found" });
        }

        // Add the subject to teacher's subject
        const teach = await teacherModel.findByIdAndUpdate(teacherId, { $addToSet: { tSubjects: subject._id } }, { new: true });

        return res.json({ success: true, data: teach })

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export const deleteTeacher = async (req, res) => {
    const teacherId = req.params.id;
    try {
        const deleteTeacher = await teacherModel.findByIdAndDelete(teacherId);
        if (deleteTeacher) {
            await subjectModel.updateMany(
                { teacher: deleteTeacher._id },
                { $unset: { teacher: "" } }     // remove the teacher field from each one
            )
        }
        return res.json({ success: true, message: "Teacher deleted successfully" });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export const deleteAllTeachers = async (req, res) => {
    try {
        const teachersToDelete = await teacherModel.find()
        if (teachersToDelete.length === 0) {
            return res.json({ message: "No teacher found to delete" });
        }

        const ids = teachersToDelete.map(i => i._id);

        const deleteTeachers = await teacherModel.deleteMany({ _id: { $in: ids } });

        //deleted all referances of teachers in subjectsModel
        if (deleteTeachers) {
            await subjectModel.updateMany(
                { teacher: { $in: ids } },      // match all subjects whose teacher is in that list
                { $unset: { teacher: "" } }
            )
        }

        return res.json({ success: true, data: deleteTeachers });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

//Delete teachers from spesefic class ( optional for me )
// export const deleteTeachersFromClass = async (req, res) => {
//     const classId = req.params.id;
//     try {
//         const classTeachers = await teacherModel.find({ tClass: classId })
//         if (classTeachers.length === 0) {
//             return res.json({ success: false, message: "No teacher found to delete" });
//         }

//         const ids = classTeachers.map(i => i._id);

//         const deletedTeachers = await teacherModel.deleteMany({ _id: { $in: ids } });
//         if (deletedTeachers) {
//             await classModel.updateMany(
//                 { teachers: { $in: ids } },
//                 { $unset: { teachers: "" } }
//             )
//         }

//         return res.json({ success: true, data: deletedTeachers })

//     } catch (error) {
//         return res.json({ success: false, message: error.message });
//     }
// }