import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import subjectService from "./subjectService";

const initialState = {
  subjects: [],         // all subjects
  classSubjects: [],    // subjects of a specific class
  freeSubjects: [],     // free subjects in a class (no teacher)
  subject: null,        // subject details
  loading: false,
  success: false,
  error: false,
  message: "",
};

// Add subjects 
export const addSubjects = createAsyncThunk(
  "subject/add",
  async (payload, thunkAPI) => {
    try {
      const res = await subjectService.addSubjects(payload);
      if (!res?.success) throw new Error(res?.message || "Failed to add subjects");
      return res; // { success, data:[...] }
    } catch (err) {
      const m = err.response?.data?.message || err.message || String(err);
      return thunkAPI.rejectWithValue(m);
    }
  }
);

// All subjects
export const fetchAllSubjects = createAsyncThunk(
  "subject/fetchAll",
  async (_, thunkAPI) => {
    try {
      const res = await subjectService.getAllSubjects();
      if (!res?.success) throw new Error(res?.message || "Failed to load subjects");
      return res; // { success, data:[...] }
    } catch (err) {
      const m = err.response?.data?.message || err.message || String(err);
      return thunkAPI.rejectWithValue(m);
    }
  }
);

// Subjects by class
export const fetchClassSubjects = createAsyncThunk(
  "subject/fetchClass",
  async (classId, thunkAPI) => {
    try {
      const res = await subjectService.getClassSubjects(classId);
      // Your controller sometimes returns { success:true, message:"No subjects..." }
      if (!res?.success) throw new Error(res?.message || "Failed to load class subjects");
      return { ...res, classIdArg: classId };
    } catch (err) {
      const m = err.response?.data?.message || err.message || String(err);
      return thunkAPI.rejectWithValue(m);
    }
  }
);

// Free subjects by class
export const fetchFreeSubjects = createAsyncThunk(
  "subject/fetchFree",
  async (classId, thunkAPI) => {
    try {
      const res = await subjectService.getFreeSubjects(classId);
      if (!res?.success) throw new Error(res?.message || "Failed to load free subjects");
      return { ...res, classIdArg: classId };
    } catch (err) {
      const m = err.response?.data?.message || err.message || String(err);
      return thunkAPI.rejectWithValue(m);
    }
  }
);

// Subject details
export const fetchSubjectDetails = createAsyncThunk(
  "subject/fetchOne",
  async (id, thunkAPI) => {
    try {
      const res = await subjectService.getSubjectDetails(id);
      if (!res?.success) throw new Error(res?.message || "Failed to load subject");
      return res; // { success, data:{...} } OR { success:true, message }
    } catch (err) {
      const m = err.response?.data?.message || err.message || String(err);
      return thunkAPI.rejectWithValue(m);
    }
  }
);

// Delete a subject
export const deleteSubject = createAsyncThunk(
  "subject/deleteOne",
  async (id, thunkAPI) => {
    try {
      const res = await subjectService.removeSubject(id);
      if (!res?.success) throw new Error(res?.message || "Delete failed");
      return { ...res, idArg: id };
    } catch (err) {
      const m = err.response?.data?.message || err.message || String(err);
      return thunkAPI.rejectWithValue(m);
    }
  }
);

// Delete ALL subjects
export const deleteAllSubjects = createAsyncThunk(
  "subject/deleteAll",
  async (_, thunkAPI) => {
    try {
      const res = await subjectService.removeAllSubjects();
      if (!res?.success) throw new Error(res?.message || "Delete all failed");
      return res; // { success, data: deleteManyResult }
    } catch (err) {
      const m = err.response?.data?.message || err.message || String(err);
      return thunkAPI.rejectWithValue(m);
    }
  }
);

// Delete all subjects from a class
export const deleteSubjectsFromClass = createAsyncThunk(
  "subject/deleteFromClass",
  async (classId, thunkAPI) => {
    try {
      const res = await subjectService.removeSubjectsFromClass(classId);
      if (!res?.success) throw new Error(res?.message || "Delete class subjects failed");
      return { ...res, classIdArg: classId };
    } catch (err) {
      const m = err.response?.data?.message || err.message || String(err);
      return thunkAPI.rejectWithValue(m);
    }
  }
);

const subjectSlice = createSlice({
  name: "subject",
  initialState,
  reducers: {
    clearSubjectState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // addSubjects
      .addCase(addSubjects.pending, (s) => {
        s.loading = true; 
        s.error = false; 
        s.message = "";
      })
      .addCase(addSubjects.fulfilled, (s, action) => {
        s.loading = false; 
        s.success = true;
        const inserted = Array.isArray(action.payload?.data) ? action.payload.data : [];
        // optimistic: append to `subjects`
        if (inserted.length) s.subjects = [...inserted, ...s.subjects];
        s.message = action.payload?.message || "Subjects added";
      })
      .addCase(addSubjects.rejected, (s, action) => {
        s.loading = false; 
        s.error = true; 
        s.message = action.payload || "Failed to add subjects";
      })

      // fetchAll
      .addCase(fetchAllSubjects.pending, (s) => {
        s.loading = true; 
        s.error = false; 
        s.message = "";
      })
      .addCase(fetchAllSubjects.fulfilled, (s, action) => {
        s.loading = false; 
        s.success = true;
        s.subjects = Array.isArray(action.payload?.data) ? action.payload.data : [];
      })
      .addCase(fetchAllSubjects.rejected, (s, action) => {
        s.loading = false; 
        s.error = true; s.message = action.payload || "Failed to load subjects";
        s.subjects = [];
      })

      // class subjects
      .addCase(fetchClassSubjects.pending, (s) => {
        s.loading = true; 
        s.error = false; 
        s.message = "";
      })
      .addCase(fetchClassSubjects.fulfilled, (s, action) => {
        s.loading = false; 
        s.success = true;
        // controller may return { success:true, message:"No subjects..." }
        s.classSubjects = Array.isArray(action.payload?.data) ? action.payload.data : [];
        if (!s.classSubjects.length && action.payload?.message) {
          s.message = action.payload.message;
        }
      })
      .addCase(fetchClassSubjects.rejected, (s, action) => {
        s.loading = false; 
        s.error = true; 
        s.message = action.payload || "Failed to load class subjects";
        s.classSubjects = [];
      })

      // free subjects
      .addCase(fetchFreeSubjects.pending, (s) => {
        s.loading = true; 
        s.error = false; 
        s.message = "";
      })
      .addCase(fetchFreeSubjects.fulfilled, (s, action) => {
        s.loading = false; 
        s.success = true;
        s.freeSubjects = Array.isArray(action.payload?.data) ? action.payload.data : [];
        if (!s.freeSubjects.length && action.payload?.message) {
          s.message = action.payload.message;
        }
      })
      .addCase(fetchFreeSubjects.rejected, (s, action) => {
        s.loading = false; 
        s.error = true; 
        s.message = action.payload || "Failed to load free subjects";
        s.freeSubjects = [];
      })

      // subject details
      .addCase(fetchSubjectDetails.pending, (s) => {
        s.loading = true; 
        s.error = false; 
        s.message = "";
      })
      .addCase(fetchSubjectDetails.fulfilled, (s, action) => {
        s.loading = false; 
        s.success = true;
        s.subject = action.payload?.data || null;
        if (!s.subject && action.payload?.message) {
          s.message = action.payload.message;
        }
      })
      .addCase(fetchSubjectDetails.rejected, (s, action) => {
        s.loading = false; 
        s.error = true; 
        s.message = action.payload || "Failed to load subject";
        s.subject = null;
      })

      // delete one subject
      .addCase(deleteSubject.pending, (s) => {
        s.error = false; 
        s.message = "";
      })
      .addCase(deleteSubject.fulfilled, (s, action) => {
        s.success = true;
        const id = action.payload?.data?._id || action.payload?.idArg || action.meta.arg;
        if (id) {
          s.subjects = s.subjects.filter((subj) => subj._id !== id);
          s.classSubjects = s.classSubjects.filter((subj) => subj._id !== id);
          s.freeSubjects = s.freeSubjects.filter((subj) => subj._id !== id);
          if (s.subject?._id === id) s.subject = null;
        }
        s.message = action.payload?.message || "Subject deleted";
      })
      .addCase(deleteSubject.rejected, (s, action) => {
        s.error = true; 
        s.message = action.payload || "Delete failed";
      })

      // delete all subjects
      .addCase(deleteAllSubjects.pending, (s) => {
        s.error = false; 
        s.message = "";
      })
      .addCase(deleteAllSubjects.fulfilled, (s, action) => {
        s.success = true;
        s.subjects = [];
        s.classSubjects = [];
        s.freeSubjects = [];
        s.subject = null;
        s.message = action.payload?.message || "All subjects deleted";
      })
      .addCase(deleteAllSubjects.rejected, (s, action) => {
        s.error = true; 
        s.message = action.payload || "Delete all failed";
      })

      // delete subjects from class
      .addCase(deleteSubjectsFromClass.pending, (s) => {
        s.error = false; 
        s.message = "";
      })
      .addCase(deleteSubjectsFromClass.fulfilled, (s, action) => {
        s.success = true;
        const classId = action.payload?.classId || action.payload?.classIdArg || action.meta.arg;
        // wipe classSubjects view and any subjects in `subjects` that belong to this class if you want:
        s.classSubjects = [];
        if (Array.isArray(s.subjects) && classId) {
          s.subjects = s.subjects.filter((subj) => String(subj.className?._id || subj.className) !== String(classId));
        }
        s.message = action.payload?.message || "Class subjects deleted";
      })
      .addCase(deleteSubjectsFromClass.rejected, (s, action) => {
        s.error = true; 
        s.message = action.payload || "Delete class subjects failed";
      });
  },
});

export const { clearSubjectState } = subjectSlice.actions;
export default subjectSlice.reducer;
