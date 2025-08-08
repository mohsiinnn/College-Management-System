import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import adminService from "./adminService";


// const users = JSON.parse(localStorage.getItem('users'));

const initialState = {
    users: [],
    loading: false,
    success: false,
    error: false,
    message: ""
}

//Register user
export const fetchPendingApprovals = createAsyncThunk("admin/fetchPendingApprovals",
    async (_, thunkAPI) => {
        try {
            const response = await adminService.allPendingApprovals()
            if (!response.success) {
                throw new Error(response.message || "Failed to load");
            }
            return response
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
            return thunkAPI.rejectWithValue(message)
        }
    }
)

//Approve user
export const approveUser = createAsyncThunk("admin/approveUser",
    async (userId, thunkAPI) => {
        try {
            const response = await adminService.approveUser(userId)
            if (!response.success) {
                throw new Error(response.message || "Approve failed");
            }
            return { ...response, userIdArg: userId }
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const rejectUser = createAsyncThunk("admin/rejectUser",
    async (userId, thunkAPI) => {
        try {
            const response = await adminService.rejectUser(userId)
            if (!response.success) {
                throw new Error(response.message || "Something went wrong");
            }
            return { ...response, userIdArg: userId }
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
            return thunkAPI.rejectWithValue(message)
        }
    }
)

const adminSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        clearAdminState: (state) => {
            state.loading = false;
            state.success = false;
            state.error = false;
            state.message = ""
        }
    },
    extraReducers: (builder) => {

        builder
            .addCase(fetchPendingApprovals.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(fetchPendingApprovals.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                const list = Array.isArray(action.payload?.user)
                    ? action.payload.user
                    : Array.isArray(action.payload)
                        ? action.payload
                        : [];
                state.users = list;
            })
            .addCase(fetchPendingApprovals.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                state.message = action.payload;
                state.users = []
            });

        builder
            .addCase(approveUser.pending, (state) => {
                state.error = false
            })
            .addCase(approveUser.fulfilled, (state, action) => {
                state.success = true;
                const id =
                    action.payload?.userId ||
                    action.payload?.user?._id ||
                    action.payload?.userIdArg || // from our payload
                    action.meta.arg; // original arg, always available
                state.users = state.users.filter((u) => u._id !== id);
                state.message = action.payload?.message || "User approved";

            })
            .addCase(approveUser.rejected, (state, action) => {
                state.error = true
                state.message = action.payload
            });

        builder
            .addCase(rejectUser.pending, (state) => {
                state.error = false
                state.message = ''
            })
            .addCase(rejectUser.fulfilled, (state, action) => {
                state.success = true;
                const id =
                    action.payload?.userId ||
                    action.payload?.user?._id ||
                    action.payload?.userIdArg ||
                    action.meta.arg;
                state.users = state.users.filter((u) => u._id !== id);
                state.message = action.payload?.message || "User rejected";
            })
            .addCase(rejectUser.rejected, (state, action) => {
                state.error = true;
                state.message = action.payload || "Reject failed";
            });

    }
})

export const { clearAdminState } = adminSlice.actions
export default adminSlice.reducer
