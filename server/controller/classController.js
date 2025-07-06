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

export const updateClass = async (req, res) => {
    const { id } = req.params;
    
}