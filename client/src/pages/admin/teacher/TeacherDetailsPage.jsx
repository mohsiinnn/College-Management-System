// src/pages/teachers/TeacherDetailsPage.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTeacherDetail,
  updateTeacherSubject,
  removeTeacher,
  clearTeacherState,
} from "../../../redux/teacher/teacherSlice";
import { fetchClasses } from "../../../redux/class/classSlice";
import { fetchFreeSubjects, clearSubjectState } from "../../../redux/subject/subjectSlice";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const TeacherDetailsPage = () => {
  const { id } = useParams(); // teacherId
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { teacher = null, loading = false, message = "", error = false } =
    useSelector((s) => s.teacher || {});
  const { classes = [] } = useSelector((s) => s.class || {});
  const { freeSubjects = [], loading: subjLoading = false } =
    useSelector((s) => s.subject || {});

  const [busy, setBusy] = useState(false);
  const [classId, setClassId] = useState("");
  const [subjectId, setSubjectId] = useState("");

  // current class id hint from teacher (if present)
  const currentClassId = useMemo(() => {
    return teacher?.tClass?._id || teacher?.tClass || "";
  }, [teacher]);

  useEffect(() => {
    dispatch(fetchTeacherDetail(id));
    dispatch(fetchClasses());
    return () => {
      dispatch(clearTeacherState());
      dispatch(clearSubjectState());
    };
  }, [dispatch, id]);

  // when class picker changes, fetch free subjects for that class
  useEffect(() => {
    const cid = classId || currentClassId;
    if (cid) {
      dispatch(fetchFreeSubjects(cid));
    }
  }, [dispatch, classId, currentClassId]);

  useEffect(() => {
    if (error && message) toast.error(message);
    else if (message) toast.success(message);
  }, [error, message]);

  const onAssignSubject = async () => {
    const cid = classId || currentClassId;
    if (!cid || !subjectId) {
      toast.error("Select class and subject to assign");
      return;
    }
    setBusy(true);
    try {
      const res = await dispatch(
        updateTeacherSubject({ subjectId, teacherId: id, classId: cid })
      ).unwrap();
      toast.success(res?.message || "Teacher updated");
      // refresh detail
      dispatch(fetchTeacherDetail(id));
      // refresh free list
      dispatch(fetchFreeSubjects(cid));
      setSubjectId("");
    } catch (e) {
      toast.error(e?.message || String(e) || "Update failed");
    } finally {
      setBusy(false);
    }
  };

  const onDelete = async () => {
    if (!confirm("Delete this teacher profile?")) return;
    setBusy(true);
    try {
      await dispatch(removeTeacher(id)).unwrap();
      navigate("/admin/dashboard/teachers");
    } catch (e) {
      toast.error(e?.message || String(e) || "Delete failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Teacher Details</h1>
        <Link to="/admin/dashboard/teachers" className="text-indigo-600 hover:underline">
          Back to list
        </Link>
      </div>

      {loading && <p className="text-sm text-gray-500">Loading…</p>}

      {!loading && !teacher && (
        <p className="text-sm text-gray-500">Teacher not found.</p>
      )}

      {!loading && teacher && (
        <div className="bg-white rounded-xl shadow p-4 space-y-4">
          <div>
            <p>
              <span className="font-medium">Name:</span>{" "}
              {teacher?.teacher?.name || "—"}
            </p>
            <p>
              <span className="font-medium">Class:</span>{" "}
              {teacher?.tClass?.className || "—"}
            </p>
            <p>
              <span className="font-medium">Subjects:</span>{" "}
              {Array.isArray(teacher?.tSubjects)
                ? teacher.tSubjects.map((s) => s?.subjectName).join(", ") || "—"
                : "—"}
            </p>
          </div>

          {/* Assign another subject */}
          <div className="border-t pt-4">
            <h2 className="text-lg font-medium mb-2">Assign Subject</h2>

            <div className="grid grid-cols-12 gap-2">
              <select
                className="col-span-5 border rounded-lg px-3 py-2 outline-none"
                value={classId || currentClassId}
                onChange={(e) => {
                  setClassId(e.target.value);
                  setSubjectId("");
                }}
              >
                <option value="">-- Select Class --</option>
                {classes.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.className} ({c.department || "-"})
                  </option>
                ))}
              </select>

              <select
                className="col-span-5 border rounded-lg px-3 py-2 outline-none"
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                disabled={subjLoading || !(classId || currentClassId)}
              >
                <option value="">
                  {subjLoading ? "Loading…" : "-- Select Free Subject --"}
                </option>
                {freeSubjects.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.subjectName} ({s.courseCode})
                  </option>
                ))}
              </select>

              <button
                onClick={onAssignSubject}
                disabled={busy}
                className="col-span-2 px-3 py-2 rounded-md bg-indigo-600 text-white disabled:opacity-50"
              >
                {busy ? "Saving…" : "Assign"}
              </button>
            </div>
            {!freeSubjects.length && (classId || currentClassId) && !subjLoading && (
              <p className="text-xs text-gray-500 mt-1">No free subjects in this class.</p>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={onDelete}
              disabled={busy}
              className="px-3 py-1.5 rounded-md bg-red-600 text-white disabled:opacity-50"
            >
              {busy ? "Deleting…" : "Delete Teacher"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDetailsPage;
