import axios from "axios";

axios.defaults.withCredentials = true;
const API_URL = import.meta.env.VITE_BACKEND_URL;


// POST /api/student/add-student/:id 
const addStudentProfile = async ({ classId, email }) => {
  const { data } = await axios.post(`${API_URL}/api/student/add-student/${classId}`, { email });
  return data; 
};

// GET /api/student/all-students
const getAllStudents = async () => {
  const { data } = await axios.get(`${API_URL}/api/student/all-students`);
  return data; 
};

// GET /api/student/all-students
const getStudents = async () => {
  const { data } = await axios.get(`${API_URL}/api/student/active-students`);
  return data; 
};

// GET /api/student/getStudentOnly/:id
const getStudentOnly = async (id) => {
  const { data } = await axios.get(`${API_URL}/api/student/getStudentOnly/${id}`);
  return data; 
};

// GET /api/student/getStudent/:id
const getStudentDetail = async (id) => {
  const { data } = await axios.get(`${API_URL}/api/student/getStudent/${id}`);
  return data; 
};

// POST /api/student/delete-student/:id
const deleteStudent = async (id) => {
  const { data } = await axios.post(`${API_URL}/api/student/delete-student/${id}`);
  return data; 
};

// POST /api/student/delete-allStudents
const deleteAllStudents = async () => {
  const { data } = await axios.post(`${API_URL}/api/student/delete-allStudents`);
  return data;
};

// POST /api/student/delete-classStudents/:id 
const deleteStudentsFromClass = async (classId) => {
  const { data } = await axios.post(`${API_URL}/api/student/delete-classStudents/${classId}`);
  return data; 
};

// POST /api/student/add-attendance/:id 
const addAttendance = async ({ studentId, subjectId, status, date }) => {
  const { data } = await axios.post(`${API_URL}/api/student/add-attendance/${studentId}`, {
    subjectId, status, date,
  });
  return data; 
};

// GET attendance for class/subject/date
const getClassAttendance = async ({ classId, subjectId, date }) => {
  const { data } = await axios.get(
    `${API_URL}/api/student/class/${classId}/attendance`,
    { params: { subjectId, date } }
  );
  return data;
};

// POST batch attendance
const batchAddAttendance = async ({ classId, subjectId, date, attendance }) => {
  const { data } = await axios.post(
    `${API_URL}/api/student/class/${classId}/attendance`,
    { subjectId, date, attendance }
  );
  return data;
};


// const addBatchAttendance = async ({ classId, subjectId, status, date }) => {
//   const { data } = await axios.post(
//     `${API_URL}/api/student/class/${classId}/attendance`,
//     { subjectId, status, date }
//   );
//   return data;
// };


// POST /api/student/remove-attendance/:id  
const removeStudentAttendance = async (studentId) => {
  const { data } = await axios.post(`${API_URL}/api/student/remove-attendance/${studentId}`);
  return data; 
};

// POST /api/student/remove-allAttendance
const removeAllStudentsAttendance = async () => {
  const { data } = await axios.post(`${API_URL}/api/student/remove-allAttendance`);
  return data; 
};

// POST /api/student/clear-stuSubAttendance/:id 
const removeStudentAttendanceFromSubject = async ({ studentId, subjectId }) => {
  const { data } = await axios.post(`${API_URL}/api/student/clear-stuSubAttendance/${studentId}`, { subjectId });
  return data; 
};

// POST /api/student/clear-allStuSubAttendance/:id 
const removeAllStudentAttendanceFromSubject = async (subjectId) => {
  const { data } = await axios.post(`${API_URL}/api/student/clear-allStuSubAttendance/${subjectId}`);
  return data; 
};

export default {
  addStudentProfile,
  getAllStudents,
  getStudents,
  getStudentDetail,
  deleteStudent,
  getStudentOnly,
  deleteAllStudents,
  deleteStudentsFromClass,
  addAttendance,
  getClassAttendance,
  // addBatchAttendance,
  batchAddAttendance,
  removeStudentAttendance,
  removeAllStudentsAttendance,
  removeStudentAttendanceFromSubject,
  removeAllStudentAttendanceFromSubject,
};
