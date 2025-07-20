import subjectModel from "../models/subjectModel.js";

export const createSubjects = async (req, res) => {

    const { subjects, className } = req.body;

    try {

        if (!subjects || !Array.isArray(subjects)) {
            return res.status(400).json({ message: "Subjects array is missing or invalid." });
        }

        const preparedSubjects = subjects.map(subject => ({
            subjectName: subject.subjectName,
            courseCode: subject.courseCode,
            className  // 👈 className is assigned as a reference
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
        if (subjects.length > 0) {
            return res.json({ success: true, data: subjects });
        }
        else {
            return res.json({ success: false, message: "No subjects found" })
        }
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export const classSubjects = async (req, res) => {
    const classId = req.params.id;
    try {
        const subjects = await subjectModel.find({ className: classId }).populate("className", "className");
        if (subjects.length > 0) {
            return res.json({ success: true, data: subjects });
        }
        else {
            return res.json({ success: true, message: "No subjects found in this class" });
        }
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export const freeSubjectList = async (req, res) => {
    const classId = req.params.id;
    try {
        const subjects = await subjectModel.find({ className: classId, teacher: { $exists: false } });
        if (subjects.length > 0) {
            return res.json({ success: true, data: subjects });
        }
        else {
            return res.json({ success: true, message: "No subjects found with teacher" });
        }
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
            return res.json({ success: true, message: "No subject found" })
        }
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}