import classModel from "../models/classModel.js";
import studentModel from "../models/studentModel.js";
import subjectModel from "../models/subjectModel.js";
import teacherModel from "../models/teacherModel.js";
import userModel from "../models/userModel.js";


export const createClass = async (req, res) => {
    const { className, department } = req.body;
    if (!className || !department) {
        return res.json({ success: false, message: "ClassName and department are required" });
    }
    try {
        const exists = await classModel.findOne({ className });
        if (exists) {
            return res.json({ success: false, message: "Class with this name already exists" });
        }
        const newClass = new classModel({ className, department });
        await newClass.save();

        return res.json({ success: true, class: newClass, message: "Class created" });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}


export const getAllClasses = async (req, res) => {
    try {
        const classList = await classModel.find();
        if (classList.length > 0) {
            return res.json({ success: true, classes: classList });
        }
        else {
            return res.json({ success: false, message: "No sclasses found" });
        }
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}


export const getSingleClass = async (req, res) => {
    const { id } = req.params;
    try {
        const getClass = await classModel.findById(id)
        if (getClass) {
            return res.json({ success: true, class: getClass });
        } else {
            return res.json({ success: false, message: "Class not found" });
        }
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export const deleteClassStudents = async (req, res) => {
    const classId = req.params.id;
    try {
        const result = await studentModel.deleteMany({ sClass: classId });
        return res.json({
            success: true,
            message: `Removed ${result.deletedCount} students from class`,
            classId,
            deletedCount: result.deletedCount
        });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export const deleteClass = async (req, res) => {
    const classId = req.params.id;
    try {
        const deletedClass = await classModel.findByIdAndDelete(classId);
        if (deletedClass) {
            await studentModel.deleteMany({ sClass: classId });
            await subjectModel.deleteMany({ className: classId });
            await teacherModel.deleteMany({ tClass: classId });
        }
        else {
            res.json({ success: false, message: "Class not found" });
        }

        res.json({ success: true, classId: deletedClass._id, message: "Class deleted" });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

//Adding new Teachers
// export const addTeacher = async (req, res) => {
//     const { classId } = req.params;
//     const { teacherEmail } = req.body;

//     // Validate at least one Email is provided
//     if (!teacherEmail) {
//         return res.json({ success: false, message: 'Please provide teacher Email' });
//     }

//     try {

//         const teacher = await userModel.findOne({ email: teacherEmail, role: 'teacher' });

//         if (teacherEmail && !teacher) {
//             return res.json({ success: false, message: "Teacher not found with the provided email" })
//         }

//         const update = { $addToSet: {} };
//         if (teacher) {
//             update.$addToSet.teachers = teacher._id;   // Safely add teacher (no duplicates)
//         }

//         const updateClass = await classModel.findByIdAndUpdate(
//             classId,
//             update,
//             { new: true, runValidators: true, }
//         ).populate({
//             path: 'teachers',
//             match: { role: 'teacher' },
//             select: 'name email'
//         })

//         if (!updateClass) {
//             return res.json({ success: false, message: 'Class not found' });
//         }

//         return res.json({ success: true, data: updateClass })
//     } catch (error) {
//         return res.json({ success: false, message: error.message });
//     }
// }

// //Adding new Student
// export const addStudent = async (req, res) => {
//     const { classId } = req.params;
//     const { studentEmail } = req.body;

//     if (!studentEmail) {
//         return res.json({ success: false, message: "Enter Student Email" });
//     }

//     try {
//         const student = await userModel.findOne({ email: studentEmail, role: 'student' });

//         if (studentEmail && !student) {
//             return res.json({ success: false, message: "student not found with the provided email" })
//         }

//         const update = { $addToSet: {} };
//         if (student) {
//             update.$addToSet.students = student._id;   // Safely add student (no duplicates)
//         }
//         const updateClass = await classModel.findByIdAndUpdate(
//             classId,
//             update,
//             { new: true, runValidators: true }
//         ).populate({
//             path: 'students',
//             match: { role: 'student' },
//             select: 'name email'
//         })

//         if (!updateClass) {
//             return res.json({ success: false, message: "Class not found" })
//         }

//         return res.json({ success: false, data: updateClass });

//     } catch (error) {
//         res.json({ success: false, message: error.message })
//     }
// }

