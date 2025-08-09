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


export const getStudents = async (req, res) => {
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


export const getStudentDetail = async (req, res) => {
    const { id } = req.params;
    try {
        const student = await studentModel.findById(id)
            .populate("student", "name")
            .populate({
                path: 'sClass',
                model: "class",
                select: "className"
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

        const exsistingAttendance = student.attendance.find((a) => {
            a.subjectId.toString() === subjectId && a.date.toDateString() === new Date(date).toDateString()
        })
        if (exsistingAttendance) {
            exsistingAttendance.status = status;
        }
        else {
            student.attendance.push({ date, status, subjectId });
        }
        const newAttendance = await student.save();
        return res.json({ success: true, data: newAttendance });

    //     const d = new Date(date);
    // if (Number.isNaN(d.getTime())) {
    //   return res.json({ success: false, message: "Invalid date" });
    // }

    // // ensure status is one of enum
    // if (!["present", "absent"].includes(status)) {
    //   return res.json({ success: false, message: "Invalid status" });
    // }

    // const idx = student.attendance.findIndex(
    //   (a) =>
    //     String(a.subjectId) === String(subjectId) &&
    //     new Date(a.date).toDateString() === d.toDateString()
    // );

    // if (idx >= 0) {
    //   student.attendance[idx].status = status; // update existing
    // } else {
    //   student.attendance.push({ date: d, status, subjectId }); // add new
    // }

    // const saved = await student.save();
    // return res.json({ success: true, data: saved, message: "Attendance saved" });

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