// import classModel from "../models/classModel.js";
import subjectModel from "../models/subjectModel.js";
import teacherModel from "../models/teacherModel.js";
import userModel from "../models/userModel.js";

export const createTeacherProfile = async (req, res) => {
    const subjectId = req.params.id;
    const { classId, email } = req.body;
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

        const updateTeacher = await teacherModel.findByIdAndUpdate(
            teacher._id,
            {
                $addToSet: {
                    classes: {
                        class: classId,
                        subjects: [subject._id]
                    }
                }
            }, { new: true }
        )
            .populate("teacher", "name")
            .populate("classes.class", "className")
            .populate("classes.subjects", "subjectName")

        if (updateTeacher) {
            return res.json({ success: true, data: updateTeacher });
        } else {
            return res.json({ success: false, message: "there is an error while updating teacher" });
        }

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export const getAllTeachers = async (req, res) => {
    try {
        const teachers = await userModel.find({ role: "teacher" })
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

export const getTeachers = async (req, res) => {
    try {
        const teachers = await teacherModel.find()
            .populate('teacher', 'name')
            .populate("classes.class", "className")
            .populate("classes.subjects", "subjectName")

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

export const getOneTeacher = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await userModel.findById(id)

        if (!user || user.role !== 'teacher') {
            return res.json({ success: true, message: "No User found" });
        }

        const teacher = await teacherModel.findOne({ teacher: user._id })
            .populate("teacher", "name email")
            .populate("classes.class", "className")
            .populate("classes.subjects", "subjectName")

        if (teacher) {
            return res.json({ success: true, data: teacher });
        } else {
            return res.json({ success: true, message: "No teacher found" });
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
            .populate("classes.class", "className")
            .populate("classes.subjects", "subjectName")

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
    const { teacherId, classId } = req.body;
    try {

        // Update the subject's teacher field 
        const subject = await subjectModel.findByIdAndUpdate(subjectId, { teacher: teacherId }, { new: true });
        if (!subject) {
            return res.json({ success: false, message: "Subject not found" });
        }

        const teacher = await teacherModel.findOne({ _id: teacherId })
        if (!teacher) {
            return res.json({ success: false, message: "Teacher not found" })
        }
        
        const check = teacher.classes.some(
            (c) => c.class.toString() === classId
        )

        if (check) {
            const teach = await teacherModel.findOneAndUpdate(
                { _id: teacherId, "classes.class": classId },
                { $addToSet: { "classes.$.subjects": subject._id } },
                { new: true }
            )
            return res.json({ success: true, data: teach })
        } else {
            // Add subject to a specific class for the teacher
            const teach = await teacherModel.findOneAndUpdate(
                { _id: teacherId },
                {
                    $addToSet: {
                        classes: {
                            class: classId,
                            subjects: [subject._id]
                        }
                    }
                }, { new: true }

            );
            return res.json({ success: true, data: teach })
        }

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
        return res.json({ success: true, data: deleteTeacher });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export const deleteAllTeachers = async (req, res) => {
    try {
        const teachersToDelete = await teacherModel.find()
        if (teachersToDelete.length === 0) {
            return res.json({ success: true, message: "No teacher found to delete" });
        }

        const ids = teachersToDelete.map(i => i._id);

        const deleteTeachers = await teacherModel.deleteMany({ _id: { $in: ids } });

        //deleted all referances of teachers in subjectsModel
        if (deleteTeachers) {
            await subjectModel.updateMany(
                { teacher: { $in: ids } }, 
                { $unset: { teacher: "" } }
            )
        }

        return res.json({ success: true, data: deleteTeachers });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

// Delete teachers from spesefic class ( optional for me )
// export const deleteTeachersFromClass = async (req, res) => {
//     const classId = req.params.id;
//     try {
//         const classTeachers = await teacherModel.find({ "classes.class": classId })
//         if (classTeachers.length === 0) {
//             return res.json({ success: false, message: "No teacher found to delete" });
//         }

//         const ids = classTeachers.map(i => i._id);

//         const deletedTeachers = await teacherModel.deleteMany({ _id: { $in: ids } });
//         if (deletedTeachers) {
//             await subjectModel.updateMany(
//                 { teacher: { $in: ids } },
//                 { $unset: { teacher: "" } }
//             )
//         }

//         return res.json({ success: true, data: deletedTeachers })

//     } catch (error) {
//         return res.json({ success: false, message: error.message });
//     }
// }