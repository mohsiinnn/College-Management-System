import studentModel from "../models/studentModel.js";
import subjectModel from "../models/subjectModel.js";
import teacherModel from "../models/teacherModel.js";

export const createSubjects = async (req, res) => {

    const { subjects, className } = req.body;

    try {

        if (!subjects || !Array.isArray(subjects)) {
            return res.status(400).json({ message: "Subjects array is missing or invalid." });
        }

        const preparedSubjects = subjects.map(subject => ({
            subjectName: subject.subjectName,
            courseCode: subject.courseCode,
            className  // className is assigned as a reference
        }))

        const duplicate = await subjectModel.findOne({ courseCode: subjects[0].courseCode });
        if (duplicate) {
            return res.json({ success: false, message: "This courseCode already exists" })
        }

        // Save to database
        const result = await subjectModel.insertMany(preparedSubjects);

        return res.json({ success: true, data: result });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}


export const allSubjects = async (req, res) => {
    try {
        const subjects = await subjectModel.find().populate("className", "className");
        return res.json({ success: true, data: subjects });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export const classSubjects = async (req, res) => {
    const classId = req.params.id;
    try {
        const subjects = await subjectModel.find({ className: classId }).populate("className", "className");
        // if (subjects.length > 0) {
        return res.json({ success: true, data: subjects });
        // }
        // else {
        //     return res.json({ success: true, message: "No subjects found in this class" });
        // }
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export const teacherClassSubjects = async (req, res) => {
    const classId = req.params.id;
    const { teacherId } = req.body;
    
    if (!classId || !teacherId) {
        return res.json({ success: false, message: "Missing classId or teacherId" });
    }

    try {
        const subjects = await subjectModel.find({
            className: classId,
            teacher: teacherId
        }).populate("className", "className");

        return res.json({ success: true, data: subjects });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export const freeSubjectList = async (req, res) => {
    const classId = req.params.id;
    try {
        const subjects = await subjectModel.find({ className: classId, teacher: { $exists: false } });
        // if (subjects.length > 0) {
        return res.json({ success: true, data: subjects });
        // }
        // else {
        //     return res.json({ success: true, message: "No subjects found with teacher" });
        // }
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export const getSubjectDetail = async (req, res) => {
    const { id } = req.params;
    try {
        const subject = await subjectModel.findById(id).populate('className', 'className').populate({
            path: "teacher",
            populate: {
                path: "teacher",
                model: "user",
                select: "name"
            }
        });
        if (subject) {
            return res.json({ success: true, data: subject })
        }
        else {
            return res.json({ success: false, message: "No subject found" })
        }
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export const deleteSubject = async (req, res) => {
    const subjectId = req.params.id;
    try {
        const subject = await subjectModel.findByIdAndDelete(subjectId);
        if (subject) {
            if (subject.teacher) {
                await teacherModel.updateOne(
                    { tSubjects: subject._id },
                    { $pull: { tSubjects: subject._id } }
                )
            }

            await studentModel.updateOne(
                { $pull: { attendance: { subjectId: subject._id } } }
            )
        }

        res.json({ success: true, data: subject });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export const deleteAllSubjects = async (req, res) => {
    try {
        const subjects = await subjectModel.find();

        const ids = subjects.map(subject => subject._id);

        const deletedSubject = await subjectModel.deleteMany();

        if (deletedSubject) {
            await teacherModel.updateMany(
                { tSubjects: { $in: ids } },
                { $pull: { tSubjects: { $in: ids } } }
            );

            await studentModel.updateMany({}, { $pull: { attendance: { subjectId: { $in: ids } } } })
        }

        // res.json({ success: true, data: deletedSubject })
        return res.json({
            success: true,
            message: `Deleted ${deletedSubject?.deletedCount || 0} subjects`,
            deletedCount: deletedSubject?.deletedCount || 0,
        });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export const deleteSubjectsFromClass = async (req, res) => {
    const classId = req.params.id;
    try {
        const subjects = await subjectModel.find({ className: classId });
        const ids = subjects.map(s => s._id);

        const deletedSubjects = await subjectModel.deleteMany({ className: classId });
        if (deletedSubjects) {
            await teacherModel.updateMany(
                { tSubjects: { $in: ids } },
                { $pull: { tSubjects: { $in: ids } } }
            );

            await studentModel.updateMany({}, { $pull: { attendance: { subjectId: { $in: ids } } } })
        }

        // res.json({ success: true, data: deletedSubjects })
        return res.json({
            success: true,
            message: `Deleted ${deletedSubjects?.deletedCount || 0} subjects from class`,
            classId,
            deletedCount: deletedSubjects?.deletedCount || 0,
        });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}