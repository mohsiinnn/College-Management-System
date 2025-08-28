import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "./userService";



const initialState = {
    dashboardData: null,
    success: false,
    error: false,
    loading: false,
    message: ""
}

export const adminDashboard = createAsyncThunk("user/adminDashboard",
    async (_, thunkAPI) => {
        try {
            const response = await userService.admin()
            if (!response.success) {
                throw new Error(response.message || "Registration failed");
            }

            return response;

        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const studentDashboard = createAsyncThunk("user/studentDashboard",
    async (_, thunkAPI) => {
        try {
            const response = await userService.student()
            if (!response.success) {
                throw new Error(response.message || "Registration failed");
            }
            return response;
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const teacherDashboard = createAsyncThunk("user/teacherDashboard",
    async (_, thunkAPI) => {
        try {
            const response = await userService.teacher()
            if (!response.success) {
                throw new Error(response.message || "Registration failed");
            }
            return response;
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
            return thunkAPI.rejectWithValue(message)
        }
    }
)

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        clearUserState: (state) => {
            state.loading = false;
            state.success = false;
            state.error = false;
            state.message = ""
        }
    },
    extraReducers: (builder) => {
        const pendingCase = (state) => {
            state.loading = true
        }
        const fulfilledCase = (state, action) => {
            state.loading = false;
            state.success = true;
            state.dashboardData = action.payload
        }
        const rejectedCase = (state, action) => {
            state.loading = false;
            state.error = true;
            state.message = action.payload;
            state.dashboardData = null
        }

        builder
            .addCase(adminDashboard.pending, pendingCase)
            .addCase(adminDashboard.fulfilled, fulfilledCase)
            .addCase(adminDashboard.rejected, rejectedCase);

        builder
            .addCase(studentDashboard.pending, pendingCase)
            .addCase(studentDashboard.fulfilled, fulfilledCase)
            .addCase(studentDashboard.rejected, rejectedCase);

        builder
            .addCase(teacherDashboard.pending, pendingCase)
            .addCase(teacherDashboard.fulfilled, fulfilledCase)
            .addCase(teacherDashboard.rejected, rejectedCase);

    }
})

export const { clearUserState } = userSlice.actions
export default userSlice.reducer
