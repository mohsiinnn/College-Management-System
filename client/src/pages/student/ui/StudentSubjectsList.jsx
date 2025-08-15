import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchClassSubjects } from "../../../redux/subject/subjectSlice";

export default function StudentSubjectsList({ subjects = [] }) {
  const dispatch = useDispatch()
  const {
    student,
  } = useSelector((s) => s.student || {});
  const { classSubjects = [] } =
    useSelector((s) => s.subject || {});

  const currentClassId = useMemo(
    () => student?.sClass?._id || student?.sClass || "",
    [student]
  );

  // console.log("student check: ", student);
  // console.log(currentClassId);
  // console.log("class Subjects check: ", classSubjects);
  
  

  useEffect(() => {
    if (currentClassId) {
      dispatch(fetchClassSubjects(currentClassId));
    }
  }, [dispatch, currentClassId]);
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Enrolled Subjects</h3>
      </div>

      <ul>
        {classSubjects.map((s) => (
          <li key={s._id} value={s._id}>
            {s.subjectName} ({s.courseCode})
          </li>
        ))}
      </ul>
    </div>
  );
}
