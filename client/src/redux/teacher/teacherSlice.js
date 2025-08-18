import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import teacherService from "./teacherService";

const initialState = {
  teachers: [],      // list
  allTeachers: [],
  teacher: null,     // details
  loading: false,
  success: false,
  error: false,
  message: "",
};

// Add teacher profile (createTeacherProfile)
export const addTeacherProfile = createAsyncThunk(
  "teacher/addProfile",
  async (payload, thunkAPI) => {
    try {
      const res = await teacherService.addTeacherProfile(payload);
      if (!res?.success) throw new Error(res?.message || "Failed to create teacher");
      return res; // { success, data }
    } catch (err) {
      const m = err.response?.data?.message || err.message || String(err);
      return thunkAPI.rejectWithValue(m);
    }
  }
);


// Get all teachers
export const fetchAllTeachers = createAsyncThunk(
  "teacher/fetchAllTeachers",
  async (_, thunkAPI) => {
    try {
      const res = await teacherService.getAllTeachers();
      // Controller may return { success:true, message:"No teachers found" }
      if (!res?.success) throw new Error(res?.message || "Failed to load teachers");
      return res; // { success, data? , message? }
    } catch (err) {
      const m = err.response?.data?.message || err.message || String(err);
      return thunkAPI.rejectWithValue(m);
    }
  }
);


// Get active teachers
export const fetchTeachers = createAsyncThunk(
  "teacher/fetchAll",
  async (_, thunkAPI) => {
    try {
      const res = await teacherService.getTeachers();
      // Controller may return { success:true, message:"No teachers found" }
      if (!res?.success) throw new Error(res?.message || "Failed to load teachers");
      return res; // { success, data? , message? }
    } catch (err) {
      const m = err.response?.data?.message || err.message || String(err);
      return thunkAPI.rejectWithValue(m);
    }
  }
);


// Get teacher detail
export const fetchOneTeacher = createAsyncThunk(
  "teacher/fetchOneTeacher",
  async (id, thunkAPI) => {
    try {
      const res = await teacherService.getOneTeacher(id);
      if (!res?.success) throw new Error(res?.message || "Failed to load teacher");
      return res; // { success, data? , message? }
    } catch (err) {
      const m = err.response?.data?.message || err.message || String(err);
      return thunkAPI.rejectWithValue(m);
    }
  }
);



// Get teacher detail
export const fetchTeacherDetail = createAsyncThunk(
  "teacher/fetchOne",
  async (id, thunkAPI) => {
    try {
      const res = await teacherService.getTeacherDetail(id);
      if (!res?.success) throw new Error(res?.message || "Failed to load teacher");
      return res; // { success, data? , message? }
    } catch (err) {
      const m = err.response?.data?.message || err.message || String(err);
      return thunkAPI.rejectWithValue(m);
    }
  }
);

// Update teacher's subject assignment
export const updateTeacherSubject = createAsyncThunk(
  "teacher/updateSubject",
  async (payload, thunkAPI) => {
    // payload: { subjectId, teacherId, classId? }
    try {
      const res = await teacherService.updateTeacherSubject(payload);
      if (!res?.success) throw new Error(res?.message || "Update failed");
      return { ...res, args: payload };
    } catch (err) {
      const m = err.response?.data?.message || err.message || String(err);
      return thunkAPI.rejectWithValue(m);
    }
  }
);

// Delete one teacher
export const removeTeacher = createAsyncThunk(
  "teacher/deleteOne",
  async (id, thunkAPI) => {
    try {
      const res = await teacherService.deleteTeacher(id);
      if (!res?.success) throw new Error(res?.message || "Delete failed");
      return { ...res, idArg: id };
    } catch (err) {
      const m = err.response?.data?.message || err.message || String(err);
      return thunkAPI.rejectWithValue(m);
    }
  }
);

// Delete all teachers
export const removeAllTeachers = createAsyncThunk(
  "teacher/deleteAll",
  async (_, thunkAPI) => {
    try {
      const res = await teacherService.deleteAllTeachers();
      if (res?.success === false) throw new Error(res?.message || "Delete all failed");
      return res; // { success:true, data } OR maybe only { message } if none
    } catch (err) {
      const m = err.response?.data?.message || err.message || String(err);
      return thunkAPI.rejectWithValue(m);
    }
  }
);

const teacherSlice = createSlice({
  name: "teacher",
  initialState,
  reducers: {
    clearTeacherState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // add profile
      .addCase(addTeacherProfile.pending, (s) => {
        s.loading = true;
        s.error = false;
        s.message = "";
      })
      .addCase(addTeacherProfile.fulfilled, (s, action) => {
        s.loading = false;
        s.success = true;
        const created = action.payload?.data;
        if (created) {
          s.teachers.unshift(created);
        }
        s.message = action.payload?.message || "Teacher profile created";
      })
      .addCase(addTeacherProfile.rejected, (s, action) => {
        s.loading = false;
        s.error = true;
        s.message = action.payload || "Failed to create teacher";
      })


      // fetch all teachers
      .addCase(fetchAllTeachers.pending, (s) => {
        s.loading = true;
        s.error = false;
        s.message = "";
      })
      .addCase(fetchAllTeachers.fulfilled, (s, action) => {
        s.loading = false;
        s.success = true;
        s.allTeachers = Array.isArray(action.payload?.data) ? action.payload.data : [];
        if (!s.teachers.length && action.payload?.message) {
          s.message = action.payload.message; // "No teachers found"
        }
      })
      .addCase(fetchAllTeachers.rejected, (s, action) => {
        s.loading = false;
        s.error = true; s.message = action.payload || "Failed to load teachers";
        s.allTeachers = [];
      })

      // fetch active teachers
      .addCase(fetchTeachers.pending, (s) => {
        s.loading = true;
        s.error = false;
        s.message = "";
      })
      .addCase(fetchTeachers.fulfilled, (s, action) => {
        s.loading = false;
        s.success = true;
        s.teachers = Array.isArray(action.payload?.data) ? action.payload.data : [];
        if (!s.teachers.length && action.payload?.message) {
          s.message = action.payload.message; // "No teachers found"
        }
      })
      .addCase(fetchTeachers.rejected, (s, action) => {
        s.loading = false;
        s.error = true; s.message = action.payload || "Failed to load teachers";
        s.teachers = [];
      })


      // fetch one
      .addCase(fetchOneTeacher.pending, (s) => {
        s.loading = true;
        s.error = false;
        s.message = "";
      })
      .addCase(fetchOneTeacher.fulfilled, (s, action) => {
        s.loading = false;
        s.success = true;
        s.teacher = action.payload?.data || null;
        if (!s.teacher && action.payload?.message) {
          s.message = action.payload.message; // "No teacher found"
        }
      })
      .addCase(fetchOneTeacher.rejected, (s, action) => {
        s.loading = false;
        s.error = true;
        s.message = action.payload || "Failed to load teacher";
        s.teacher = null;
      })


      // fetch one
      .addCase(fetchTeacherDetail.pending, (s) => {
        s.loading = true;
        s.error = false;
        s.message = "";
      })
      .addCase(fetchTeacherDetail.fulfilled, (s, action) => {
        s.loading = false;
        s.success = true;
        s.teacher = action.payload?.data || null;
        if (!s.teacher && action.payload?.message) {
          s.message = action.payload.message; // "No teacher found"
        }
      })
      .addCase(fetchTeacherDetail.rejected, (s, action) => {
        s.loading = false;
        s.error = true;
        s.message = action.payload || "Failed to load teacher";
        s.teacher = null;
      })

      // update subject
      .addCase(updateTeacherSubject.pending, (s) => {
        s.error = false;
        s.message = "";
      })
      .addCase(updateTeacherSubject.fulfilled, (s, action) => {
        s.success = true;
        const updated = action.payload?.data;
        if (updated?._id) {
          s.teachers = s.teachers.map((t) => (t._id === updated._id ? { ...t, ...updated } : t));
          if (s.teacher?._id === updated._id) s.teacher = { ...s.teacher, ...updated };
        }
        s.message = action.payload?.message || "Teacher updated";
      })
      .addCase(updateTeacherSubject.rejected, (s, action) => {
        s.error = true;
        s.message = action.payload || "Update failed";
      })

      // delete one
      .addCase(removeTeacher.pending, (s) => {
        s.error = false;
        s.message = "";
      })
      .addCase(removeTeacher.fulfilled, (s, action) => {
        s.success = true;
        const id = action.payload?.data?._id || action.payload?.idArg || action.meta.arg;
        if (id) {
          s.teachers = s.teachers.filter((t) => t._id !== id);
          if (s.teacher?._id === id) s.teacher = null;
        }
        s.message = action.payload?.message || "Teacher deleted";
      })
      .addCase(removeTeacher.rejected, (s, action) => {
        s.error = true;
        s.message = action.payload || "Delete failed";
      })

      // delete all
      .addCase(removeAllTeachers.pending, (s) => {
        s.error = false; s.message = "";
      })
      .addCase(removeAllTeachers.fulfilled, (s, action) => {
        s.success = true;
        s.teachers = [];
        s.teacher = null;
        s.message = action.payload?.message || "All teachers deleted";
      })
      .addCase(removeAllTeachers.rejected, (s, action) => {
        s.error = true;
        s.message = action.payload || "Delete all failed";
      });
  },
});

export const { clearTeacherState } = teacherSlice.actions;
export default teacherSlice.reducer;
