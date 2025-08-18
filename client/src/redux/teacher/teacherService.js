import axios from "axios";

axios.defaults.withCredentials = true;
const API_URL = import.meta.env.VITE_BACKEND_URL;

// POST /api/teacher/add-teacher/:id   (id = subjectId)
// body: { classId, email }
const addTeacherProfile = async ({ subjectId, classId, email }) => {
  const { data } = await axios.post(
    `${API_URL}/api/teacher/add-teacher/${subjectId}`,
    { classId, email }
  );
  // controller: { success, data } or { success:false, message }
  return data;
};

// GET /api/teacher/all-teachers
const getAllTeachers = async () => {
  const { data } = await axios.get(`${API_URL}/api/teacher/all-teachers`);
  // controller: { success:true, data:[...] } OR { success:true, message:"No teachers found" }
  return data;
};

// GET /api/teacher/all-teachers
const getTeachers = async () => {
  const { data } = await axios.get(`${API_URL}/api/teacher/active-teachers`);
  // controller: { success:true, data:[...] } OR { success:true, message:"No teachers found" }
  return data;
};


// GET /api/teacher/getOneTeacher/:id
const getOneTeacher = async (id) => {
  const { data } = await axios.get(`${API_URL}/api/teacher/getOneTeacher/${id}`);
  // controller: { success:true, data:{...} } OR { success:true, message:"No teacher found" }
  return data;
};


// GET /api/teacher/getTeacher/:id
const getTeacherDetail = async (id) => {
  const { data } = await axios.get(`${API_URL}/api/teacher/getTeacher/${id}`);
  // controller: { success:true, data:{...} } OR { success:true, message:"No teacher found" }
  return data;
};

// POST /api/teacher/update-teacher/:id   (id = subjectId)
// body: { teacherId, classId? }  NOTE: controller uses classId but not provided; see notes below
const updateTeacherSubject = async ({ subjectId, teacherId, classId }) => {
  const { data } = await axios.post(
    `${API_URL}/api/teacher/update-teacher/${subjectId}`,
    { teacherId, classId } // send classId to satisfy controller (bug fix note below)
  );
  // controller: { success:true, data } or { success:false, message }
  return data;
};

// POST /api/teacher/delete-teacher/:id
const deleteTeacher = async (id) => {
  const { data } = await axios.post(`${API_URL}/api/teacher/delete-teacher/${id}`);
  // controller: { success:true, data: deletedDoc }
  return data;
};

// POST /api/teacher/delete-teachers
const deleteAllTeachers = async () => {
  const { data } = await axios.post(`${API_URL}/api/teacher/delete-teachers`);
  // controller: { success:true, data: deleteManyResult } 
  // (your controller sometimes returns only { message } when none to delete)
  return data;
};

const teacherService = {
  addTeacherProfile,
  getAllTeachers,
  getTeachers,
  getOneTeacher,
  getTeacherDetail,
  updateTeacherSubject,
  deleteTeacher,
  deleteAllTeachers,
};

export default teacherService;
