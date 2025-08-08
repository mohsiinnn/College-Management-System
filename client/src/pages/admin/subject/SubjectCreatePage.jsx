// src/pages/subjects/SubjectCreatePage.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addSubjects, clearSubjectState } from "../../../redux/subject/subjectSlice";
import { fetchClasses } from "../../../redux/class/classSlice";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const SubjectCreatePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // class list for the select
  const { classes = [] } = useSelector((s) => s.class || {});

  // form state
  const [classId, setClassId] = useState("");
  const [rows, setRows] = useState([{ subjectName: "", courseCode: "" }]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchClasses());
    return () => dispatch(clearSubjectState());
  }, [dispatch]);

  const addRow = () => setRows((r) => [...r, { subjectName: "", courseCode: "" }]);
  const removeRow = (idx) => setRows((r) => r.filter((_, i) => i !== idx));

  const onChangeRow = (idx, key, value) => {
    setRows((r) => r.map((row, i) => (i === idx ? { ...row, [key]: value } : row)));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!classId) {
      toast.error("Please select a class");
      return;
    }
    if (!rows.length || rows.some((r) => !r.subjectName || !r.courseCode)) {
      toast.error("Please fill all subject rows");
      return;
    }
    setSubmitting(true);
    try {
      const res = await dispatch(
        addSubjects({ className: classId, subjects: rows })
      ).unwrap();
      toast.success(res?.message || "Subjects added");
      navigate("/admin/dashboard/subjects");
    } catch (e) {
      toast.error(e?.message || String(e) || "Failed to add subjects");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Add Subjects</h1>
        <Link to="/admin/dashboard/subjects" className="text-indigo-600 hover:underline">
          Back to list
        </Link>
      </div>

      <form onSubmit={onSubmit} className="bg-white rounded-xl shadow p-4 space-y-4">
        {/* Class select */}
        <div>
          <label className="block text-sm mb-1">Class</label>
          <select
            className="w-full border rounded-lg px-3 py-2 outline-none"
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
          >
            <option value="">-- Select Class --</option>
            {classes.map((c) => (
              <option value={c._id} key={c._id}>
                {c.className} ({c.department || "-"})
              </option>
            ))}
          </select>
        </div>

        {/* Rows */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-medium">Subjects</h2>
            <button type="button" onClick={addRow} className="px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200">
              + Add Row
            </button>
          </div>

          {rows.map((row, idx) => (
            <div key={idx} className="grid grid-cols-12 gap-2">
              <input
                type="text"
                placeholder="Subject Name"
                value={row.subjectName}
                onChange={(e) => onChangeRow(idx, "subjectName", e.target.value)}
                className="col-span-5 border rounded-lg px-3 py-2 outline-none"
              />
              <input
                type="text"
                placeholder="Course Code"
                value={row.courseCode}
                onChange={(e) => onChangeRow(idx, "courseCode", e.target.value)}
                className="col-span-5 border rounded-lg px-3 py-2 outline-none"
              />
              <button
                type="button"
                onClick={() => removeRow(idx)}
                className="col-span-2 px-3 py-2 rounded-md bg-red-100 text-red-700 hover:bg-red-200"
                disabled={rows.length === 1}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2.5 rounded-lg bg-indigo-600 text-white font-medium disabled:opacity-50"
        >
          {submitting ? "Saving…" : "Save Subjects"}
        </button>
      </form>
    </div>
  );
};

export default SubjectCreatePage;
