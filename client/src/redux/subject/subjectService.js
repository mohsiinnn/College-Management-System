import axios from "axios";

axios.defaults.withCredentials = true;
const API_URL = import.meta.env.VITE_BACKEND_URL;

// POST /api/subject/add-subject   body: { subjects: [{subjectName,courseCode}], className }
const addSubjects = async (payload) => {
  const { data } = await axios.post(`${API_URL}/api/subject/add-subject`, payload);
  // controller: { success, data: [ ...inserted ] } OR { success:false, message }
  return data;
};

// GET /api/subject/all-subjects
const getAllSubjects = async () => {
  const { data } = await axios.get(`${API_URL}/api/subject/all-subjects`);
  // controller: { success:true, data:[...] } OR { success:false, message }
  return data;
};

// GET /api/subject/class-subjects/:id
const getClassSubjects = async (classId) => {
  const { data } = await axios.get(`${API_URL}/api/subject/class-subjects/${classId}`);
  // controller: { success:true, data:[...] } OR { success:true, message:"No subjects..." }
  return data;
};


const getTeacherClassSubjects = async ({classId, teacherId}) => {
  const { data } = await axios.post(
    `${API_URL}/api/subject/teacherClass-subjects/${classId}`,
    {teacherId}
  );
  // controller: { success:true, data:[...] } OR { success:true, message:"No subjects..." }
  return data;
};

// GET /api/subject/free-subjects/:id
const getFreeSubjects = async (classId) => {
  const { data } = await axios.get(`${API_URL}/api/subject/free-subjects/${classId}`);
  // controller: { success:true, data:[...] } OR { success:true, message:"No subjects..." }
  return data;
};

// GET /api/subject/subject-details/:id
const getSubjectDetails = async (id) => {
  const { data } = await axios.get(`${API_URL}/api/subject/subject-details/${id}`);
  // controller: { success:true, data:{...} } OR { success:true, message:"No subject found" }
  return data;
};

// POST /api/subject/delete-subject/:id
const removeSubject = async (id) => {
  const { data } = await axios.post(`${API_URL}/api/subject/delete-subject/${id}`);
  // controller: { success:true, data: deletedDoc }
  return data;
};

// POST /api/subject/delete-allSubjects
const removeAllSubjects = async () => {
  const { data } = await axios.post(`${API_URL}/api/subject/delete-allSubjects`);
  // controller: { success:true, data: deleteManyResult }
  return data;
};

// POST /api/subject/delete-allClassSubjects  body: { id? }  // your router uses : no param here, but controller expects /:id
// Your router actually: POST /delete-allClassSubjects (no :id) BUT controller uses req.params.id
// If your real route is POST /delete-allClassSubjects/:id, call with classId in URL.
// If it truly has no :id, you must send it in body. I'm coding both variants:
const removeSubjectsFromClass = async (classId) => {
  // prefer URL param version if you actually wired it that way:
  try {
    const { data } = await axios.post(`${API_URL}/api/subject/delete-allClassSubjects/${classId}`);
    return data;
  } catch {
    // fallback: body if your route has no :id
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
