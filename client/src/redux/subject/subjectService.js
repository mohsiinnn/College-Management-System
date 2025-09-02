import axios from "axios";

axios.defaults.withCredentials = true;
const API_URL = import.meta.env.VITE_BACKEND_URL;

// POST /api/subject/add-subject  
const addSubjects = async (payload) => {
  const { data } = await axios.post(`${API_URL}/api/subject/add-subject`, payload);
  return data;
};

// GET /api/subject/all-subjects
const getAllSubjects = async () => {
  const { data } = await axios.get(`${API_URL}/api/subject/all-subjects`);
  return data;
};

// GET /api/subject/class-subjects/:id
const getClassSubjects = async (classId) => {
  const { data } = await axios.get(`${API_URL}/api/subject/class-subjects/${classId}`);
  return data;
};


const getTeacherClassSubjects = async ({classId, teacherId}) => {
  const { data } = await axios.post(
    `${API_URL}/api/subject/teacherClass-subjects/${classId}`,
    {teacherId}
  );
  return data;
};

// GET /api/subject/free-subjects/:id
const getFreeSubjects = async (classId) => {
  const { data } = await axios.get(`${API_URL}/api/subject/free-subjects/${classId}`);
  return data;
};

// GET /api/subject/subject-details/:id
const getSubjectDetails = async (id) => {
  const { data } = await axios.get(`${API_URL}/api/subject/subject-details/${id}`);
  return data;
};

// POST /api/subject/delete-subject/:id
const removeSubject = async (id) => {
  const { data } = await axios.post(`${API_URL}/api/subject/delete-subject/${id}`);
  return data;
};

// POST /api/subject/delete-allSubjects
const removeAllSubjects = async () => {
  const { data } = await axios.post(`${API_URL}/api/subject/delete-allSubjects`);
  return data;
};

// POST /api/subject/delete-allClassSubjects 
const removeSubjectsFromClass = async (classId) => {
  try {
    const { data } = await axios.post(`${API_URL}/api/subject/delete-allClassSubjects/${classId}`);
    return data;
  } catch {
    // body if route has no :id
    const { data } = await axios.post(`${API_URL}/api/subject/delete-allClassSubjects`, { id: classId });
    return data;
  }
};

const subjectService = {
  addSubjects,
  getAllSubjects,
  getClassSubjects,
  getTeacherClassSubjects,
  getFreeSubjects,
  getSubjectDetails,
  removeSubject,
  removeAllSubjects,
  removeSubjectsFromClass,
};

export default subjectService;
