import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChevronDown, ChevronRight } from "lucide-react";
import { fetchTeacherDetail, updateTeacherSubject, removeTeacher, clearTeacherState, } from "../../../redux/teacher/teacherSlice";
import { fetchClasses } from "../../../redux/class/classSlice";
import { fetchFreeSubjects, clearSubjectState } from "../../../redux/subject/subjectSlice";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const TeacherDetailsPage = () => {
  const { id } = useParams(); // teacherId
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { classes = [] } = useSelector((s) => s.class || {});
  const { teacher, loading = false, message = "", error = false } = useSelector((s) => s.teacher || {});
  const { freeSubjects = [], loading: subjLoading = false } = useSelector((s) => s.subject || {});

  const [busy, setBusy] = useState(false);
  const [classId, setClassId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [openClass, setOpenClass] = useState(null); // only one open at a time


  useEffect(() => {
    dispatch(fetchTeacherDetail(id));
    dispatch(fetchClasses());
    return () => {
      dispatch(clearTeacherState());
      dispatch(clearSubjectState());
    };
  }, [dispatch, id]);

  // when class changes, fetch free subjects for that class
  useEffect(() => {
    const cid = classId;
    if (cid) {
      dispatch(fetchFreeSubjects(cid));
    }
  }, [dispatch, classId]);

  useEffect(() => {
    if (error && message) toast.error(message);
    else if (message) toast.success(message);
  }, [error, message]);

  const onAssignSubject = async () => {
    const cid = classId
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

  const toggleClass = (classId) => {
    setOpenClass((prev) => (prev === classId ? null : classId));
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
          <div className="p-4 rounded-2xl shadow-md bg-white border border-gray-200">

            {/* Teacher Name */}
            <p className="text-lg font-semibold text-gray-800 mb-3">
              <span className="text-blue-600">Name:</span>{" "}
              {teacher?.teacher?.name || "—"}
            </p>

            {/* Classes & Subjects */}
            <div className="text-sm text-gray-700">
              <ul className="space-y-3">
                {teacher?.classes?.length > 0 ? (
                  teacher.classes.map((cls) => {
                    const isOpen = openClass === cls.class._id;
                    return (
                      <li
                        key={cls.class._id}
                        className="p-3 rounded-lg bg-gray-50 border border-gray-100"
                      >
                        <button
                          onClick={() => toggleClass(cls.class._id)}
                          className="flex items-center w-full text-left focus:outline-none"
                        >
                          {isOpen ? (
                            <ChevronDown className="w-4 h-4 mr-2 text-gray-600" />
                          ) : (
                            <ChevronRight className="w-4 h-4 mr-2 text-gray-600" />
                          )}
                          <span className="font-medium text-gray-900">
                            Class: {cls.class.className || "_"}
                          </span>
                        </button>

                        {/* Subjects list */}
                        <div
                          className={`ml-6 mt-2 overflow-hidden transition-all duration-300 ${isOpen ? "max-h-40" : "max-h-0"
                            }`}
                        >
                          <ul className="list-disc list-inside text-gray-600 space-y-1">
                            {cls?.subjects?.length > 0 ? (
                              cls.subjects.map((subs) => (
                                <li key={subs._id} className="pl-1">
                                  {subs?.subjectName || "_"}
                                </li>
                              ))
                            ) : (
                              <li className="italic text-gray-400">
                                No subjects assigned
                              </li>
                            )}
                          </ul>
                        </div>
                      </li>
                    );
                  })
                ) : (
                  <li className="italic text-gray-400">No subjects assigned</li>
                )}
              </ul>
            </div>
          </div>

          {/* Assign another subject */}
          <div className="border-t pt-4">
            <h2 className="text-lg font-medium mb-2">Assign Subject</h2>

            <div className="grid grid-cols-12 gap-2">
              <select
                className="col-span-5 border rounded-lg px-3 py-2 outline-none"
                value={classId}
                onChange={(e) => {
                  setClassId(e.target.value);
                  setSubjectId("");
                }}
              >
                <option value=""> Select Class </option>
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
                disabled={subjLoading || !(classId)}
              >
                <option value="">
                  {subjLoading ? "Loading…" : " Select Free Subject "}
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
            {!freeSubjects.length && (classId) && !subjLoading && (
              <p className="text-xs text-gray-500 mt-1">No free subjects in this class.</p>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={onDelete}
              disabled={busy}
              className="px-3 py-1.5 rounded-md bg-red-600 text-white disabled:opacity-50"
            >
              {busy ? "Deleting…" : "Remove Teacher"}
            </button>
          </div>
        </div>
      )
      }
    </div >
  );
};

export default TeacherDetailsPage;