// src/pages/students/StudentCreatePage.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addStudentProfile, clearStudentState } from "../../../redux/student/studentSlice";
import { fetchClasses } from "../../../redux/class/classSlice";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const StudentCreatePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { classes = [] } = useSelector((s) => s.class || {});

  const [email, setEmail] = useState("");
  const [classId, setClassId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchClasses());
    return () => dispatch(clearStudentState());
  }, [dispatch]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!email || !classId) {
      toast.error("Email and class are required");
      return;
    }
    setSubmitting(true);
    try {
      const res = await dispatch(addStudentProfile({ email, classId })).unwrap();
      toast.success(res?.message || "Student profile created");
      navigate("/admin/dashboard/students");
    } catch (e) {
      toast.error(e?.message || String(e) || "Create failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Create Student Profile</h1>
        <Link to="/admin/dashboard/students" className="text-indigo-600 hover:underline">
          Back to list
        </Link>
      </div>

      <form onSubmit={onSubmit} className="bg-white rounded-xl shadow p-4 space-y-4">
        <div>
          <label className="block text-sm mb-1">Student Email</label>
          <input
            type="email"
            placeholder="student@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Class</label>
          <select
            className="w-full border rounded-lg px-3 py-2 outline-none"
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
          >
            <option value="">-- Select Class --</option>
            {classes.map((c) => (
              <option key={c._id} value={c._id}>
                {c.className} ({c.department || "-"})
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2.5 rounded-lg bg-indigo-600 text-white font-medium disabled:opacity-50"
        >
          {submitting ? "Creating…" : "Create"}
        </button>
      </form>
    </div>
  );
};

export default StudentCreatePage;
