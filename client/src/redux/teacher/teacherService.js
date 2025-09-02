import axios from "axios";

axios.defaults.withCredentials = true;
const API_URL = import.meta.env.VITE_BACKEND_URL;

// POST /api/teacher/add-teacher/:id 
const addTeacherProfile = async ({ subjectId, classId, email }) => {
  const { data } = await axios.post(
    `${API_URL}/api/teacher/add-teacher/${subjectId}`,
    { classId, email }
  );
  return data;
};

// GET /api/teacher/all-teachers
const getAllTeachers = async () => {
  const { data } = await axios.get(`${API_URL}/api/teacher/all-teachers`);
  return data;
};

// GET /api/teacher/all-teachers
const getTeachers = async () => {
  const { data } = await axios.get(`${API_URL}/api/teacher/active-teachers`);
  return data;
};


// GET /api/teacher/getOneTeacher/:id
const getOneTeacher = async (id) => {
  const { data } = await axios.get(`${API_URL}/api/teacher/getOneTeacher/${id}`);
  return data;
};


// GET /api/teacher/getTeacher/:id
const getTeacherDetail = async (id) => {
  const { data } = await axios.get(`${API_URL}/api/teacher/getTeacher/${id}`);
  return data;
};

// POST /api/teacher/update-teacher/:id  
const updateTeacherSubject = async ({ subjectId, teacherId, classId }) => {
  const { data } = await axios.post(
    `${API_URL}/api/teacher/update-teacher/${subjectId}`,
    { teacherId, classId } 
  );
  return data;
};

// POST /api/teacher/delete-teacher/:id
const deleteTeacher = async (id) => {
  const { data } = await axios.post(`${API_URL}/api/teacher/delete-teacher/${id}`);
  return data;
};

// POST /api/teacher/delete-teachers
const deleteAllTeachers = async () => {
  const { data } = await axios.post(`${API_URL}/api/teacher/delete-teachers`);
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
