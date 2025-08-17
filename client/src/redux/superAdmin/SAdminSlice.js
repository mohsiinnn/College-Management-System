import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import SAdminService from "./SAdminServices";


// const users = JSON.parse(localStorage.getItem('users'));

const initialState = {
    admins: [],
    users: [],
    loading: false,
    success: false,
    error: false,
    message: ""
}


//Get Admins
export const fetchAllAdmins = createAsyncThunk("admin/fetchAllAdmins",
    async (_, thunkAPI) => {
        try {
            const response = await SAdminService.getAdmins()
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


//Register user
export const fetchPendingAdmin = createAsyncThunk("admin/fetchPendingAdmin",
    async (_, thunkAPI) => {
        try {
            const response = await SAdminService.allPendingAdmins()
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
export const approveAdmin = createAsyncThunk("admin/approveAdmin",
    async (userId, thunkAPI) => {
        try {
            const response = await SAdminService.approveAdmin(userId)
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

export const rejectAdmin = createAsyncThunk("admin/rejectAdmin",
    async (userId, thunkAPI) => {
        try {
            const response = await SAdminService.rejectAdmin(userId)
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


const SAdminSlice = createSlice({
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
            .addCase(fetchAllAdmins.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(fetchAllAdmins.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                const list = Array.isArray(action.payload?.user)
                    ? action.payload.user
                    : Array.isArray(action.payload)
                        ? action.payload
                        : [];
                state.admins = list;
            })
            .addCase(fetchAllAdmins.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                state.message = action.payload;
                state.admins = []
            });


        builder
            .addCase(fetchPendingAdmin.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(fetchPendingAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                const list = Array.isArray(action.payload?.user)
                    ? action.payload.user
                    : Array.isArray(action.payload)
                        ? action.payload
                        : [];
                state.users = list;
            })
            .addCase(fetchPendingAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
                state.message = action.payload;
                state.users = []
            });

        builder
            .addCase(approveAdmin.pending, (state) => {
                state.error = false
            })
            .addCase(approveAdmin.fulfilled, (state, action) => {
                state.success = true;
                const id =
                    action.payload?.userId ||
                    action.payload?.user?._id ||
                    action.payload?.userIdArg || // from our payload
                    action.meta.arg; // original arg, always available
                state.users = state.users.filter((u) => u._id !== id);
                state.message = action.payload?.message || "User approved";

            })
            .addCase(approveAdmin.rejected, (state, action) => {
                state.error = true
                state.message = action.payload
            });

        builder
            .addCase(rejectAdmin.pending, (state) => {
                state.error = false
                state.message = ''
            })
            .addCase(rejectAdmin.fulfilled, (state, action) => {
                state.success = true;
                const id =
                    action.payload?.userId ||
                    action.payload?.user?._id ||
                    action.payload?.userIdArg ||
                    action.meta.arg;
                state.users = state.users.filter((u) => u._id !== id);
                state.message = action.payload?.message || "User rejected";
            })
            .addCase(rejectAdmin.rejected, (state, action) => {
                state.error = true;
                state.message = action.payload || "Reject failed";
            });

    }
})

export const { clearAdminState } = SAdminSlice.actions
export default SAdminSlice.reducer
