import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import classService from "./classService";

const initialState = {
  classes: [],        // list of classes
  currentClass: null, // details for one class
  loading: false,
  success: false,
  error: false,
  message: "",
};

// GET all
export const fetchClasses = createAsyncThunk(
  "class/fetchAll",
  async (_, thunkAPI) => {
    try {
      const res = await classService.getAllClasses();
      if (!res?.success) throw new Error(res?.message || "Failed to load classes");
      return res; // { success, userData: [...] } (your controller)
    } catch (err) {
      const m = err.response?.data?.message || err.message || String(err);
      return thunkAPI.rejectWithValue(m);
    }
  }
);

// GET by id
export const fetchClassById = createAsyncThunk(
  "class/fetchById",
  async (id, thunkAPI) => {
    try {
      const res = await classService.getClassById(id);
      if (!res?.success) throw new Error(res?.message || "Failed to load class");
      return res; // { success, userData: {...} } (your controller)
    } catch (err) {
      const m = err.response?.data?.message || err.message || String(err);
      return thunkAPI.rejectWithValue(m);
    }
  }
);

// CREATE
export const createClass = createAsyncThunk(
  "class/create",
  async (payload, thunkAPI) => {
    try {
      const res = await classService.createClass(payload);
      if (!res?.success) throw new Error(res?.message || "Create failed");
      return res; // { success, data: {...} } (your controller)
    } catch (err) {
      const m = err.response?.data?.message || err.message || String(err);
      return thunkAPI.rejectWithValue(m);
    }
  }
);

// DELETE ALL STUDENTS in a class
export const removeClassStudents = createAsyncThunk(
  "class/removeClassStudents",
  async (id, thunkAPI) => {
    try {
      const res = await classService.deleteClassStudents(id);
      if (!res?.success) throw new Error(res?.message || "Operation failed");
      return { ...res, idArg: id }; // keep id for reducers
    } catch (err) {
      const m = err.response?.data?.message || err.message || String(err);
      return thunkAPI.rejectWithValue(m);
    }
  }
);

// DELETE CLASS
export const deleteClass = createAsyncThunk(
  "class/delete",
  async (id, thunkAPI) => {
    try {
      const res = await classService.deleteClass(id);
      if (!res?.success) throw new Error(res?.message || "Delete failed");
      return { ...res, idArg: id }; // keep id just in case
    } catch (err) {
      const m = err.response?.data?.message || err.message || String(err);
      return thunkAPI.rejectWithValue(m);
    }
  }
);

const classSlice = createSlice({
  name: "class",
  initialState,
  reducers: {
    clearClassState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch all
      .addCase(fetchClasses.pending, (s) => {
        s.loading = true; s.error = false; s.message = "";
      })
      .addCase(fetchClasses.fulfilled, (s, action) => {
        s.loading = false; s.success = true;
        // your controller uses userData for the array
        const list = Array.isArray(action.payload?.userData)
          ? action.payload.userData
          : Array.isArray(action.payload?.classes) // fallback if you rename later
          ? action.payload.classes
          : [];
        s.classes = list;
      })
      .addCase(fetchClasses.rejected, (s, action) => {
        s.loading = false; s.error = true; s.message = action.payload || "Failed to load classes";
        s.classes = [];
      })

      // fetch by id
      .addCase(fetchClassById.pending, (s) => {
        s.loading = true; s.error = false; s.message = "";
      })
      .addCase(fetchClassById.fulfilled, (s, action) => {
        s.loading = false; s.success = true;
        // your controller uses userData for the single class
        s.currentClass = action.payload?.userData || action.payload?.class || null;
      })
      .addCase(fetchClassById.rejected, (s, action) => {
        s.loading = false; s.error = true; s.message = action.payload || "Failed to load class";
        s.currentClass = null;
      })

      // create
      .addCase(createClass.pending, (s) => {
        s.error = false; s.message = "";
      })
      .addCase(createClass.fulfilled, (s, action) => {
        s.success = true;
        const created = action.payload?.data || action.payload?.class;
        if (created) s.classes.unshift(created);
        s.message = action.payload?.message || "Class created";
      })
      .addCase(createClass.rejected, (s, action) => {
        s.error = true; s.message = action.payload || "Create failed";
      })

      // remove all students
      .addCase(removeClassStudents.pending, (s) => {
        s.error = false; s.message = "";
      })
      .addCase(removeClassStudents.fulfilled, (s, action) => {
        s.success = true;
        // controller returns { success, data: <deleteManyResult> }
        // Optimistic: wipe `student` array for that class locally (if we have it)
        const id = action.payload?.idArg || action.meta.arg;
        if (id) {
          s.classes = s.classes.map((c) =>
            c._id === id ? { ...c, student: [] } : c
          );
          if (s.currentClass?._id === id) {
            s.currentClass = { ...s.currentClass, student: [] };
          }
        }
        s.message = action.payload?.message || "Class students deleted";
      })
      .addCase(removeClassStudents.rejected, (s, action) => {
        s.error = true; s.message = action.payload || "Operation failed";
      })

      // delete class
      .addCase(deleteClass.pending, (s) => {
        s.error = false; s.message = "";
      })
      .addCase(deleteClass.fulfilled, (s, action) => {
        s.success = true;
        // controller returns { success, data: deletedClass }
        const id =
          action.payload?.data?._id ||
          action.payload?.idArg ||
          action.meta.arg;
        if (id) s.classes = s.classes.filter((c) => c._id !== id);
        if (s.currentClass?._id === id) s.currentClass = null;
        s.message = action.payload?.message || "Class deleted";
      })
      .addCase(deleteClass.rejected, (s, action) => {
        s.error = true; s.message = action.payload || "Delete failed";
      });
  },
});

export const { clearClassState } = classSlice.actions;
export default classSlice.reducer;
