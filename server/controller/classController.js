import classModel from "../models/classModel.js";


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

        return res.json({ success: true, data: newClass });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

//Students List
export const studentList = async (req, res) => {
    const { classId } = req.params;
    const { studentId } = req.body;

    try {

    } catch (error) {

    }
}


//Adding new Students and Teachers
export const addTeacherAndStudent = async (req, res) => {
    const { classId } = req.params;
    const { teacherId, studentId } = req.body;

    // Validate at least one ID is provided
    if (!teacherId && !studentId) {
        return res.json({ success: false, message: 'Please provide either teacherId or studentId' });
    }

    try {
        const update = { $addToSet: {} };
        if (teacherId) {
            update.$addToSet.teachers = teacherId;   // Safely add teacher (no duplicates)
        }
        if (studentId) {
            update.$addToSet.students = studentId;   // Safely add student (no duplicates)
        }

        const updateClass = await classModel.findByIdAndUpdate(
            classId,
            update,
            { new: true, runValidators: true, }
        ).populate({
            path: 'students',
            match: { role: 'student' },
            select: 'name email'
        }).populate({
            path: 'teachers',
            match: { role: 'teacher' },
            select: 'name email'
        })

        if (!updateClass) {
            return res.json({ success: false, message: 'Class not found' });
        }

        return res.json({ success: true, data: updateClass })
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}