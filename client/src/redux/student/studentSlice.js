import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import studentService from "./studentService";

const initialState = {
  students: [],         // list
  allStudents: [],
  student: null,        // details
  loading: false,
  success: false,
  error: false,
  message: "",
};

export const addStudentProfile = createAsyncThunk(
  "student/addProfile",
  async (payload, thunkAPI) => {
    try {
      const res = await studentService.addStudentProfile(payload);
      if (!res?.success) throw new Error(res?.message || "Failed to create student");
      return res; // { success, data }
    } catch (err) {
      const m = err.response?.data?.message || err.message || String(err);
      return thunkAPI.rejectWithValue(m);
    }
  }
);

export const fetchAllStudents = createAsyncThunk(
  "student/fetchAllStudents",
  async (_, thunkAPI) => {
    try {
      const res = await studentService.getAllStudents();
      if (!res?.success) throw new Error(res?.message || "Failed to load students");
      return res; // { success, data:[...] }
    } catch (err) {
      const m = err.response?.data?.message || err.message || String(err);
      return thunkAPI.rejectWithValue(m);
    }
  }
);

export const fetchStudents = createAsyncThunk(
  "student/fetchAll",
  async (_, thunkAPI) => {
    try {
      const res = await studentService.getStudents();
      if (!res?.success) throw new Error(res?.message || "Failed to load students");
      return res; // { success, data:[...] }
    } catch (err) {
      const m = err.response?.data?.message || err.message || String(err);
      return thunkAPI.rejectWithValue(m);
    }
  }
);

export const fetchStudentOnly = createAsyncThunk(
  "student/fetchStudentOne",
  async (id, thunkAPI) => {
    try {
      const res = await studentService.getStudentOnly(id);
      if (!res?.success) throw new Error(res?.message || "Failed to load student");
      return res; // { success, data } | { success:true, message }
    } catch (err) {
      const m = err.response?.data?.message || err.message || String(err);
      return thunkAPI.rejectWithValue(m);
    }
  }
);

export const fetchStudentDetail = createAsyncThunk(
  "student/fetchOne",
  async (id, thunkAPI) => {
    try {
      const res = await studentService.getStudentDetail(id);
      if (!res?.success) throw new Error(res?.message || "Failed to load student");
      return res; // { success, data } | { success:true, message }
    } catch (err) {
      const m = err.response?.data?.message || err.message || String(err);
      return thunkAPI.rejectWithValue(m);
    }
  }
);

export const removeStudent = createAsyncThunk(
  "student/deleteOne",
  async (id, thunkAPI) => {
    try {
      const res = await studentService.deleteStudent(id);
      if (!res?.success) throw new Error(res?.message || "Delete failed");
      return { ...res, idArg: id }; // { success, message, studentId }
    } catch (err) {
      const m = err.response?.data?.message || err.message || String(err);
      return thunkAPI.rejectWithValue(m);
    }
  }
);

export const removeAllStudents = createAsyncThunk(
  "student/deleteAll",
  async (_, thunkAPI) => {
    try {
      const res = await studentService.deleteAllStudents();
      if (!res?.success) throw new Error(res?.message || "Delete all failed");
      return res; // { success, data: deleteManyResult }
    } catch (err) {
      const m = err.response?.data?.message || err.message || String(err);
      return thunkAPI.rejectWithValue(m);
    }
  }
);

export const removeStudentsFromClass = createAsyncThunk(
  "student/deleteFromClass",
  async (classId, thunkAPI) => {
    try {
      const res = await studentService.deleteStudentsFromClass(classId);
      if (!res?.success) throw new Error(res?.message || "Delete class students failed");
      return { ...res, classIdArg: classId };
    } catch (err) {
      const m = err.response?.data?.message || err.message || String(err);
      return thunkAPI.rejectWithValue(m);
    }
  }
);

// Attendance 
export const addStudentAttendance = createAsyncThunk(
  "student/addAttendance",
  async (payload, thunkAPI) => {
    // payload: { studentId, subjectId, status, date }
    try {
      const res = await studentService.addAttendance(payload);
      if (!res?.success) throw new Error(res?.message || "Failed to add attendance");
      return { ...res, args: payload };
    } catch (err) {
      const m = err.response?.data?.message || err.message || String(err);
      return thunkAPI.rejectWithValue(m);
    }
  }
);


//Fetch class attendance
export const fetchClassAttendance = createAsyncThunk(
  "student/fetchClassAttendance",
  async (payload, thunkAPI) => {
    try {
      const res = await studentService.getClassAttendance(payload);
      if (!res?.success) throw new Error(res?.message || "Failed to fetch attendance");
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || "Failed to fetch attendance");
    }
  }
);

// Batch add attendance
export const batchAddAttendance = createAsyncThunk(
  "student/batchAddAttendance",
  async ({ classId, subjectId, date, attendance }, thunkAPI) => {
    try {
      const res = await studentService.batchAddAttendance({ classId, subjectId, date, attendance });
      return res;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);


// export const batchAddAttendance = createAsyncThunk(
//   "student/batchAddAttendance",
//   async (payload, thunkAPI) => {
//     try {
//       const res = await studentService.addBatchAttendance(payload);
//       if (!res?.success) throw new Error(res?.message || "Failed to add attendance");
//       return res.message;
//     } catch (err) {
//       return thunkAPI.rejectWithValue(err.message || "Failed to add attendance");
//     }
//   }
// );



export const clearStudentAttendance = createAsyncThunk(
  "student/clearAttendance",
  async (studentId, thunkAPI) => {
    try {
      const res = await studentService.removeStudentAttendance(studentId);
      if (!res?.success) throw new Error(res?.message || "Failed to clear attendance");
      return { ...res, studentId };
    } catch (err) {
      const m = err.response?.data?.message || err.message || String(err);
      return thunkAPI.rejectWithValue(m);
    }
  }
);

export const clearAllStudentsAttendance = createAsyncThunk(
  "student/clearAllAttendance",
  async (_, thunkAPI) => {
    try {
      const res = await studentService.removeAllStudentsAttendance();
      if (!res?.success) throw new Error(res?.message || "Failed to clear all attendance");
      return res; // { success, data }
    } catch (err) {
      const m = err.response?.data?.message || err.message || String(err);
      return thunkAPI.rejectWithValue(m);
    }
  }
);

export const clearStudentAttendanceFromSubject = createAsyncThunk(
  "student/clearAttendanceFromSubject",
  async (payload, thunkAPI) => {
    // payload: { studentId, subjectId }
    try {
      const res = await studentService.removeStudentAttendanceFromSubject(payload);
      if (!res?.success) throw new Error(res?.message || "Failed to clear subject attendance");
      return { ...res, args: payload };
    } catch (err) {
      const m = err.response?.data?.message || err.message || String(err);
      return thunkAPI.rejectWithValue(m);
    }
  }
);

export const clearAllStudentAttendanceFromSubject = createAsyncThunk(
  "student/clearAllFromSubject",
  async (subjectId, thunkAPI) => {
    try {
      const res = await studentService.removeAllStudentAttendanceFromSubject(subjectId);
      if (!res?.success) throw new Error(res?.message || "Failed to clear subject attendance for all");
      return { ...res, subjectId };
    } catch (err) {
      const m = err.response?.data?.message || err.message || String(err);
      return thunkAPI.rejectWithValue(m);
    }
  }
);

const studentSlice = createSlice({
  name: "student",
  initialState,
  reducers: {
    clearStudentState: (s) => {
      s.loading = false;
      s.success = false;
      s.error = false;
      s.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // add profile
      .addCase(addStudentProfile.pending, (s) => {
        s.loading = true;
        s.error = false;
        s.message = "";
      })
      .addCase(addStudentProfile.fulfilled, (s, action) => {
        s.loading = false;
        s.success = true;
        const created = action.payload?.data;
        if (created) {
          s.students.unshift(created);
        }
        s.message = action.payload?.message || "Student profile created";
      })
      .addCase(addStudentProfile.rejected, (s, action) => {
        s.loading = false;
        s.error = true;
        s.message = action.payload || "Failed to create student";
      })


      // fetch all students
      .addCase(fetchAllStudents.pending, (s) => {
        s.loading = true;
        s.error = false;
        s.message = "";
      })
      .addCase(fetchAllStudents.fulfilled, (s, action) => {
        s.loading = false;
        s.success = true;
        s.allStudents = Array.isArray(action.payload?.data) ? action.payload.data : [];
      })
      .addCase(fetchAllStudents.rejected, (s, action) => {
        s.loading = false;
        s.error = true;
        s.message = action.payload || "Failed to load students";
        s.allStudents = [];
      })

      // fetch active students
      .addCase(fetchStudents.pending, (s) => {
        s.loading = true;
        s.error = false;
        s.message = "";
      })
      .addCase(fetchStudents.fulfilled, (s, action) => {
        s.loading = false;
        s.success = true;
        s.students = Array.isArray(action.payload?.data) ? action.payload.data : [];
      })
      .addCase(fetchStudents.rejected, (s, action) => {
        s.loading = false;
        s.error = true;
        s.message = action.payload || "Failed to load students";
        s.students = [];
      })


      // fetch student only
      .addCase(fetchStudentOnly.pending, (s) => {
        s.loading = true;
        s.error = false;
        s.message = "";
      })
      .addCase(fetchStudentOnly.fulfilled, (s, action) => {
        s.loading = false;
        s.success = true;
        s.student = action.payload?.data || null;
        if (!s.student && action.payload?.message) s.message = action.payload.message;
      })
      .addCase(fetchStudentOnly.rejected, (s, action) => {
        s.loading = false;
        s.error = true;
        s.message = action.payload || "Failed to load student";
        s.student = null;
      })

      // fetch one
      .addCase(fetchStudentDetail.pending, (s) => {
        s.loading = true;
        s.error = false;
        s.message = "";
      })
      .addCase(fetchStudentDetail.fulfilled, (s, action) => {
        s.loading = false;
        s.success = true;
        s.student = action.payload?.data || null;
        if (!s.student && action.payload?.message) s.message = action.payload.message;
      })
      .addCase(fetchStudentDetail.rejected, (s, action) => {
        s.loading = false;
        s.error = true;
        s.message = action.payload || "Failed to load student";
        s.student = null;
      })

      // delete one
      .addCase(removeStudent.pending, (s) => {
        s.error = false;
        s.message = "";
      })
      .addCase(removeStudent.fulfilled, (s, action) => {
        s.success = true;
        const id = action.payload?.studentId || action.payload?.idArg || action.meta.arg;
        if (id) {
          s.students = s.students.filter((st) => st._id !== id);    //.filter() creates array with all students who's ._id is not equal to id
          if (s.student?._id === id) s.student = null;
        }
        s.message = action.payload?.message || "Student deleted";
      })
      .addCase(removeStudent.rejected, (s, action) => { s.error = true; s.message = action.payload || "Delete failed"; })

      // delete all
      .addCase(removeAllStudents.pending, (s) => {
        s.error = false;
        s.message = "";
      })
      .addCase(removeAllStudents.fulfilled, (s, action) => {
        s.success = true;
        s.students = [];
        s.student = null;
        s.message = action.payload?.message || "All students deleted";
      })
      .addCase(removeAllStudents.rejected, (s, action) => {
        s.error = true;
        s.message = action.payload || "Delete all failed";
      })

      // delete from class
      .addCase(removeStudentsFromClass.pending, (s) => {
        s.error = false;
        s.message = "";
      })
      .addCase(removeStudentsFromClass.fulfilled, (s, action) => {
        s.success = true;
        const classId = action.payload?.classId || action.payload?.classIdArg || action.meta.arg;
        if (classId) {
          s.students = s.students.filter((st) => String(st.sClass?._id || st.sClass) !== String(classId));
          if (s.student && String(s.student.sClass?._id || s.student.sClass) === String(classId)) s.student = null;
        }
        s.message = action.payload?.message || "Class students deleted";
      })
      .addCase(removeStudentsFromClass.rejected, (s, action) => {
        s.error = true;
        s.message = action.payload || "Delete class students failed";
      })

      // attendance: add/patch
      .addCase(addStudentAttendance.pending, (s) => {
        s.error = false;
        s.message = "";
      })
      .addCase(addStudentAttendance.fulfilled, (s, action) => {
        s.success = true;
        const updated = action.payload?.data;
        if (updated?._id) {
          // update list item
          s.students = s.students.map((st) => (st._id === updated._id ? { ...st, ...updated } : st));
          // update details if open
          if (s.student?._id === updated._id) s.student = { ...s.student, ...updated };
        }
        s.message = action.payload?.message || "Attendance saved";
      })
      .addCase(addStudentAttendance.rejected, (s, action) => {
        s.error = true;
        s.message = action.payload || "Failed to add attendance";
      })


      .addCase(fetchClassAttendance.pending, (s) => {
        s.loading = true;
        s.error = false;
        s.message = "";
      })
      .addCase(fetchClassAttendance.fulfilled, (s, action) => {
        s.loading = false;
        s.success = true;
        s.students = action.payload || [];
        s.message = action.payload?.message;
      })
      .addCase(fetchClassAttendance.rejected, (s, action) => {
        s.loading = false;
        s.error = true;
        s.message = action.payload || "Failed to fetch attendance";
        s.students = [];
      })
      .addCase(batchAddAttendance.pending, (s) => {
        s.loading = true;
        s.error = false;
        s.message = "";
      })
      .addCase(batchAddAttendance.fulfilled, (s, action) => {
        s.loading = false;
        s.success = true;
        s.message = action.payload || "Attendance marked for all students";
        s.message = action.payload?.message || "Students Attendance Submitted";
      })
      .addCase(batchAddAttendance.rejected, (s, action) => {
        s.loading = false;
        s.error = true;
        s.message = action.payload || "Failed to add attendance";
      })


      // clear one student's attendance
      .addCase(clearStudentAttendance.pending, (s) => {
        s.error = false;
        s.message = "";
      })
      .addCase(clearStudentAttendance.fulfilled, (s, action) => {
        s.success = true;
        const updated = action.payload?.data;
        if (updated?._id) {
          s.students = s.students.map((st) => (st._id === updated._id ? { ...st, ...updated } : st));
          if (s.student?._id === updated._id) s.student = { ...s.student, ...updated };
        }
        s.message = action.payload?.message || "Attendance cleared";
      })
      .addCase(clearStudentAttendance.rejected, (s, action) => {
        s.error = true;
        s.message = action.payload || "Failed to clear attendance";
      })

      // clear all students's attendance
      .addCase(clearAllStudentsAttendance.pending, (s) => {
        s.error = false;
        s.message = "";
      })
      .addCase(clearAllStudentsAttendance.fulfilled, (s, action) => {
        s.success = true;
        s.message = action.payload?.message || "All attendance cleared";
      })
      .addCase(clearAllStudentsAttendance.rejected, (s, action) => {
        s.error = true;
        s.message = action.payload || "Failed to clear all attendance";
      })

      // clear subject for one student's attendance
      .addCase(clearStudentAttendanceFromSubject.pending, (s) => {
        s.error = false;
        s.message = "";
      })
      .addCase(clearStudentAttendanceFromSubject.fulfilled, (s, action) => {
        s.success = true;
        const updated = action.payload?.data;
        if (updated?._id) {
          s.students = s.students.map((st) => (st._id === updated._id ? { ...st, ...updated } : st));
          if (s.student?._id === updated._id) s.student = { ...s.student, ...updated };
        }
        s.message = action.payload?.message || "Subject attendance cleared";
      })
      .addCase(clearStudentAttendanceFromSubject.rejected, (s, action) => {
        s.error = true;
        s.message = action.payload || "Failed to clear subject attendance";
      })

      // clear subject for all students's attendance
      .addCase(clearAllStudentAttendanceFromSubject.pending, (s) => {
        s.error = false;
        s.message = "";
      })
      .addCase(clearAllStudentAttendanceFromSubject.fulfilled, (s, action) => {
        s.success = true;
        s.message = action.payload?.message || "Cleared subject attendance for all students";
      })
      .addCase(clearAllStudentAttendanceFromSubject.rejected, (s, action) => {
        s.error = true;
        s.message = action.payload || "Failed to clear subject for all";
      });
  },
});

export const { clearStudentState } = studentSlice.actions;
export default studentSlice.reducer;
