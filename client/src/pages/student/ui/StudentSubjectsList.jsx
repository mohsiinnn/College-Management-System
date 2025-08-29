import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchClassSubjects } from "../../../redux/subject/subjectSlice";
import { clearStudentState, fetchStudentOnly } from "../../../redux/student/studentSlice";

export default function StudentSubjectsList() {
  const dispatch = useDispatch();
  const { dashboardData } = useSelector((state) => state.user)
  const { student } = useSelector((s) => s.student || {});
  const { classSubjects = [] } = useSelector((s) => s.subject || {});

  useEffect(() => {
    const id = dashboardData?.data?._id;
    if (id) {
      dispatch(fetchStudentOnly(id));
    } else {
      console.error("User _id is missing!", dashboardData);
    }

    return () => dispatch(clearStudentState())
  }, [dispatch, dashboardData])


  const currentClassId = useMemo(
    () => student?.sClass?._id || student?.sClass || "",
    [student]
  );

  useEffect(() => {
    if (currentClassId) {
      dispatch(fetchClassSubjects(currentClassId));
    }
  }, [dispatch, currentClassId]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 m-8">
      <div className="mx-auto flex justify-center items-center max-w-7xl px-4 sm:px-6 lg:px-8 pt-4 pb-6">
        <h1 className="text-3xl font-medium text-sky-600">
          Enrolled Subjects
        </h1>
      </div>

      {classSubjects.length === 0 ? (
        <p className="text-gray-500 text-center py-6">
          No subjects enrolled yet.
        </p>
      ) : (
        <ul className="space-y-3">
          {classSubjects.map((s) => (
            <li
              key={s._id}
              className="p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm 
                         flex justify-between items-center hover:bg-sky-100 
                         transition-colors duration-200"
            >
              <span className="text-gray-800 font-medium">
                {s.subjectName}
              </span>
              <span className="text-gray-500 text-sm font-semibold">
                {s.courseCode}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
