// src/pages/teachers/TeacherCreatePage.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTeacherProfile, clearTeacherState } from "../../../redux/teacher/teacherSlice";
import { fetchClasses } from "../../../redux/class/classSlice";
import { fetchFreeSubjects, clearSubjectState } from "../../../redux/subject/subjectSlice";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const TeacherCreatePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { classes = [] } = useSelector((s) => s.class || {});
  const { freeSubjects = [], loading: subjLoading = false } = useSelector((s) => s.subject || {});

  const [email, setEmail] = useState("");
  const [classId, setClassId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchClasses());
    return () => {
      dispatch(clearTeacherState());
      dispatch(clearSubjectState());
    };
  }, [dispatch]);

  // when class changes, fetch free subjects for that class
  useEffect(() => {
    if (classId) {
      dispatch(fetchFreeSubjects(classId));
      setSubjectId("");
    }
  }, [dispatch, classId]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!email || !classId || !subjectId) {
      toast.error("Email, class and subject are required");
      return;
    }
    setSubmitting(true);
    try {
      const res = await dispatch(
        addTeacherProfile({ email, classId, subjectId })
      ).unwrap();
      toast.success(res?.message || "Teacher profile created");
      navigate("/admin/dashboard/teachers");
    } catch (e) {
      toast.error(e?.message || String(e) || "Failed to create teacher");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 pt-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-sky-600">Create Teacher Profile</h1>
        <button
          onClick={() => navigate('/admin/dashboard/teachers')}
          className="px-4 py-2 bg-sky-600 text-white font-medium rounded-lg hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Back to list
        </button>
      </div>

      <form onSubmit={onSubmit} className="bg-white rounded-xl shadow p-4 space-y-4">
        <div>
          <label className="block text-sm mb-1">Teacher Email</label>
          <input
            type="email"
            placeholder="teacher@email.com"
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
            <option value=""> Select Class </option>
            {classes.map((c) => (
              <option key={c._id} value={c._id}>
                {c.className} ({c.department || "-"})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">Subject (free only)</label>
          <select
            className="w-full border rounded-lg px-3 py-2 outline-none"
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            disabled={!classId || subjLoading}
          >
            <option value="">{subjLoading ? "Loading…" : " Select Subject "}</option>
            {freeSubjects.map((s) => (
              <option key={s._id} value={s._id}>
                {s.subjectName} ({s.courseCode})
              </option>
            ))}
          </select>
          {!freeSubjects.length && classId && !subjLoading && (
            <p className="text-xs text-gray-500 mt-1">No free subjects in this class.</p>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2.5 rounded-lg bg-sky-600 text-white font-medium disabled:opacity-50"
        >
          {submitting ? "Creating…" : "Create"}
        </button>
      </form>
    </div>
  );
};

export default TeacherCreatePage;
