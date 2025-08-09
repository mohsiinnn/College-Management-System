import axios from "axios";

axios.defaults.withCredentials = true;
const API_URL = import.meta.env.VITE_BACKEND_URL;

// --- Profiles / CRUD ---

// POST /api/student/add-student/:id   (id = classId)  body: { email }
const addStudentProfile = async ({ classId, email }) => {
  const { data } = await axios.post(`${API_URL}/api/student/add-student/${classId}`, { email });
  return data; // { success, data } | { success:false, message }
};

// GET /api/student/all-students
const getStudents = async () => {
  const { data } = await axios.get(`${API_URL}/api/student/all-students`);
  return data; // { success:true, data:[...] }
};

// GET /api/student/getStudent/:id
const getStudentDetail = async (id) => {
  const { data } = await axios.get(`${API_URL}/api/student/getStudent/${id}`);
  return data; // { success:true, data:{...} } | { success:true, message }
};

// POST /api/student/delete-student/:id
const deleteStudent = async (id) => {
  const { data } = await axios.post(`${API_URL}/api/student/delete-student/${id}`);
  return data; // { success:true, message, studentId }
};

// POST /api/student/delete-allStudents
const deleteAllStudents = async () => {
  const { data } = await axios.post(`${API_URL}/api/student/delete-allStudents`);
  return data; // { success:true, data: deleteManyResult } | { success:false, message }
};

// POST /api/student/delete-classStudents/:id    (id = classId)
const deleteStudentsFromClass = async (classId) => {
  const { data } = await axios.post(`${API_URL}/api/student/delete-classStudents/${classId}`);
  return data; // { success, data } | { success:false, message }
};

// --- Attendance ---

// POST /api/student/add-attendance/:id        (id = studentId)  body: { subjectId, status, date }
const addAttendance = async ({ studentId, subjectId, status, date }) => {
  const { data } = await axios.post(`${API_URL}/api/student/add-attendance/${studentId}`, {
    subjectId, status, date,
  });
  return data; // { success, data } | { success:false, message }
};

// POST /api/student/remove-attendance/:id     (id = studentId)
const removeStudentAttendance = async (studentId) => {
  const { data } = await axios.post(`${API_URL}/api/student/remove-attendance/${studentId}`);
  return data; // { success, data } | { success:false, message }
};

// POST /api/student/remove-allAttendance
const removeAllStudentsAttendance = async () => {
  const { data } = await axios.post(`${API_URL}/api/student/remove-allAttendance`);
  return data; // { success, data } | { success:false, message }
};

// POST /api/student/clear-stuSubAttendance/:id   (id = studentId) body: { subjectId }
const removeStudentAttendanceFromSubject = async ({ studentId, subjectId }) => {
  const { data } = await axios.post(`${API_URL}/api/student/clear-stuSubAttendance/${studentId}`, { subjectId });
  return data; // { success, data } | { success:false, message }
};

// POST /api/student/clear-allStuSubAttendance/:id  (id = subjectId)
const removeAllStudentAttendanceFromSubject = async (subjectId) => {
  const { data } = await axios.post(`${API_URL}/api/student/clear-allStuSubAttendance/${subjectId}`);
  return data; // { success, data } | { success:false, message }
};

export default {
  addStudentProfile,
  getStudents,
  getStudentDetail,
  deleteStudent,
  deleteAllStudents,
  deleteStudentsFromClass,
  addAttendance,
  removeStudentAttendance,
  removeAllStudentsAttendance,
  removeStudentAttendanceFromSubject,
  removeAllStudentAttendanceFromSubject,
};
