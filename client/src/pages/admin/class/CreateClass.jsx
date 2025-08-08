// src/pages/classes/ClassCreatePage.jsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createClass, fetchClasses } from "../../../redux/class/classSlice";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const ClassCreatePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [className, setClassName] = useState("");
  const [department, setDepartment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!className || !department) {
      toast.error("Class name and department are required");
      return;
    }
    setSubmitting(true);
    try {
      const res = await dispatch(createClass({ className, department })).unwrap();
      toast.success(res?.message || "Class created");
      // optional: refresh list cache
      dispatch(fetchClasses());
      navigate("/classes");
    } catch (e) {
      toast.error(e?.message || String(e) || "Create failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Create Class</h1>
        <Link to="/admin/dashboard/classes" className="text-indigo-600 hover:underline">
          Back to list
        </Link>
      </div>

      <form onSubmit={onSubmit} className="bg-white rounded-xl shadow p-4 space-y-4">
        <div>
          <label className="block text-sm mb-1">Class Name</label>
          <input
            type="text"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            placeholder="e.g. BSCS-1"
            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Department</label>
          <input
            type="text"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            placeholder="e.g. Computer Science"
            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring"
          />
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

export default ClassCreatePage;
