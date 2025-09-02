// import mongoose from "mongoose";
import classModel from "../models/classModel.js";
import studentModel from "../models/studentModel.js";
import userModel from "../models/userModel.js";


export const createStudentProfile = async (req, res) => {
    const classId = req.params.id;
    const { email } = req.body;
    try {
        const user = await userModel.findOne({ email: email });
        if (!user || user.role !== 'student') {
            return res.json({ success: false, message: "User not found or not a Student" });
        }
        const exists = await studentModel.findOne({ student: user._id })
        if (exists) {
            return res.json({ success: false, message: "Student profile already exists" });
        }

        const student = await studentModel.create({ student: user._id });
        if (!student) {
            return res.json({ success: false, message: "There is a problem while creating student" });
        }

        // Update the class's student field 
        const updateClass = await classModel.findByIdAndUpdate(classId, { $addToSet: { student: student._id } }, { new: true });
        if (!updateClass) {
            return res.json({ success: false, message: "Class not found" });
        }

        const updateStudent = await studentModel.findByIdAndUpdate(student._id, { sClass: updateClass._id }, { new: true }).populate('student', 'name').populate("sClass", "className")
        if (!updateStudent) {
            return res.json({ success: false, message: "there is an error while updating student" });
        }

        return res.json({ success: true, data: updateStudent });


    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export const getAllStudents = async (req, res) => {
    try {
        const students = await userModel.find({ role: 'student' })
        return res.json({ success: true, data: students })
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}


export const getActiveStudents = async (req, res) => {
    try {
        const students = await studentModel.find()
            .populate("student", "name")
            .populate({
                path: 'sClass',
                model: "class",
                select: "className"
            })
        // if (students.length > 0) {
        return res.json({ success: true, data: students })
        // }
        // else {
        //     return res.json({ success: false, message: "No students found" });
        // }

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

//Ye function student ki detail deta hai with user id not student id
export const getStudentOnly = async (req, res) => {
    const { id } = req.params;
    const user = await userModel.findById(id)
    if (!user || user.role !== 'student') {
        return res.json({ success: false, message: "User not found or not a Student" });
    }
    const student = await studentModel.findOne({ student: user.id })
        .populate("student", "name email")                 // <-- populate user (ref: 'user')
        .populate("sClass", "className")
        .populate({
            path: 'attendance.subjectId',
            model: 'subject',
            select: 'subjectName'
        })
    if (student) {
        return res.json({ success: true, data: student })
    }
    else {
        return res.status(404).json({ success: false, message: "Student not found with mohsin" });
    }
}

export const getStudentDetail = async (req, res) => {
    const { id } = req.params;
    try {
        const student = await studentModel.findById(id)
            .populate("student", "name email")
            .populate({
                path: 'sClass',
                model: "class",
                select: "className"
            })
            .populate({
                path: 'attendance.subjectId',
                model: 'subject',
                select: 'subjectName'
            })
        if (student) {
            return res.json({ success: true, data: student });
        }
        else {
            return res.json({ success: true, message: "No student found" });
        }
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export const deleteStudent = async (req, res) => {
    const { id } = req.params;
    try {
        const student = await studentModel.findById(id);
        if (!student) {
            return res.json({ success: false, message: "Student profile not found" })
        }

        if (student.sClass) {
            await classModel.findByIdAndUpdate(student.sClass, { $pull: { student: student._id } })
        }

        await student.deleteOne();

        return res.json({ success: true, message: "Student profile deleted", studentId: id })
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}



export const getClassAttendance = async (req, res) => {
    const { classId } = req.params;
    const { subjectId, date } = req.query;
    try {
        // Find all students in the class
        const students = await studentModel.find({ sClass: classId })
            .populate('student', 'name email')
            .populate('sClass', 'className');

        // For each student, filter attendance for the given subject/date
        const result = students.map(stu => {
            const attendance = stu.attendance.find(a =>
                (!subjectId || String(a.subjectId) === String(subjectId)) &&
                (!date || new Date(a.date).toDateString() === new Date(date).toDateString())
            );
            return {
                _id: stu._id,
                student: stu.student,
                sClass: stu.sClass,
                attendance: attendance || null
            };
        });

        return res.json({ success: true, data: result });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};


export const addBatchAttendance = async (req, res) => {
    // const { classId } = req.params;
    const { subjectId, date, attendance } = req.body;
    try {
        if (!subjectId || !date || !Array.isArray(attendance)) {
            return res.json({ success: false, message: "Missing data" });
        }
        for (const entry of attendance) {
            const stu = await studentModel.findById(entry.studentId);
            if (!stu) continue;
            const idx = stu.attendance.findIndex(a =>
                String(a.subjectId) === String(subjectId) &&
                new Date(a.date).toDateString() === new Date(date).toDateString()
            );
            if (idx >= 0) {
                stu.attendance[idx].status = entry.status;
            } else {
                stu.attendance.push({ subjectId, status: entry.status, date });
            }
            await stu.save();
        }
        return res.json({ success: true, message: "Attendance marked for all students" });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};


export const deleteAllStudents = async (req, res) => {
    try {
        const students = await studentModel.find();
        if (students.length === 0) {
            return res.json({ success: true, message: "No student found" });
        }

        const ids = students.map(i => i._id)
        const deleteStudents = await studentModel.deleteMany({ _id: { $in: ids } });

        if (deleteStudents) {
            await classModel.updateMany(
                { student: { $in: ids } },
                { $pull: { student: { $in: ids } } }
            )
        }

        return res.json({ success: true, data: deleteStudents });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export const deleteStudentsFromClass = async (req, res) => {
    const classId = req.params.id;
    try {
        const students = await studentModel.find({ sClass: classId });
        if (students.length === 0) {
            return res.json({ success: true, message: "No students to delete in this class" });
        }

        const ids = students.map(i => i._id)
        const deleteStudents = await studentModel.deleteMany({ _id: { $in: ids } });
        if (deleteStudents) {
            await classModel.updateMany(
                { student: { $in: ids } },
                { $pull: { student: { $in: ids } } }
            )
        }

        return res.json({ success: true, data: deleteStudents });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export const addAttendance = async (req, res) => {
    const studentId = req.params.id;
    const { subjectId, status, date } = req.body;
    try {
        const student = await studentModel.findById(studentId);
        if (!student) {
            return res.json({ success: false, message: "Student not found" });
        }

        if (!subjectId || !status || !date) {
            return res.json({ success: false, message: "Enter subjectId, status and date" })
        }

        // const subject = await subjectModel.findById(subjectId);

        const exsistingAttendance = student.attendance.find(a =>
            a.subjectId.toString() === subjectId &&
            new Date(a.date).toDateString() === new Date(date).toDateString()
        )
        if (exsistingAttendance) {
            exsistingAttendance.status = status;
        }
        else {
            student.attendance.push({ date, status, subjectId });
        }
        const newAttendance = await student.save();
        return res.json({ success: true, data: newAttendance });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export const removeStudentAttendance = async (req, res) => {
    const studentId = req.params.id;
    try {
        const student = await studentModel.findByIdAndUpdate(
            studentId,
            { $set: { attendance: [] } },
            { new: true }
        );
        if (!student) return res.json({ success: false, message: "Student not found" });
        return res.json({ success: true, data: student });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export const removeAllStudentsAttendance = async (req, res) => {
    try {
        const allStudents = await studentModel.updateMany({}, { $set: { attendance: [] } });
        if (allStudents) {
            return res.json({ success: true, data: allStudents });
        }
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export const removeStudentAttendanceFromSubject = async (req, res) => {
    const studentId = req.params.id;
    const { subjectId } = req.body;
    try {
        const student = await studentModel.findByIdAndUpdate(studentId,
            { $pull: { attendance: { subjectId: subjectId } } }
        )
        if (student) {
            return res.json({ success: true, data: student });
        }
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export const removeAllStudentAttendanceFromSubject = async (req, res) => {
    const subjectId = req.params.id;
    try {
        const allStudents = await studentModel.updateMany(
            { 'attendance.subjectId': subjectId },
            { $pull: { attendance: { subjectId } } }
        )
        if (allStudents) {
            res.json({ success: true, data: allStudents });
        }
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}