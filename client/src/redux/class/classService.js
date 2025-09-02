import axios from "axios";
axios.defaults.withCredentials = true;

const API_URL = import.meta.env.VITE_BACKEND_URL;

// GET /api/class/all-classes
const getAllClasses = async () => {
  const { data } = await axios.get(`${API_URL}/api/class/all-classes`);
  return data;
};

// GET /api/class/:id       
const getClassById = async (id) => {
  const { data } = await axios.get(`${API_URL}/api/class/${id}`);
  return data;
};

// POST /api/class/register-class
const createClass = async (payload) => {
  const { data } = await axios.post(`${API_URL}/api/class/register-class`, payload);
  return data;
};

// POST /api/class/delete-classStudents/:id
const deleteClassStudents = async (id) => {
  const { data } = await axios.post(`${API_URL}/api/class/delete-classStudents/${id}`);
  return data;
};

// POST /api/class/delete-class/:id
const deleteClass = async (id) => {
  const { data } = await axios.post(`${API_URL}/api/class/delete-class/${id}`);
  return data;
};

export default {
  getAllClasses,
  getClassById,
  createClass,
  deleteClassStudents,
  deleteClass,
};
