import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

axios.defaults.withCredentials = true;
const API_URL = import.meta.env.VITE_BACKEND_URL;


//Register user
export const registerUser = createAsyncThunk("auth/registerUser",
    async (formData, { rejectWithValue }) => {
        try {
            const res = await axios.post(`${API_URL}/api/auth/register`, formData)
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Registration failed");
        }
    }
)

// Login user
export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (formData, { rejectWithValue }) => {
        try {
            const res = await axios.post(`${API_URL}/api/auth/login`, formData);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Login failed");
        }
    }
);


//Logout user
export const logoutUser = createAsyncThunk("auth/logoutUser",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.post(`${API_URL}/api/auth/logout`);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Logout failed");
        }
    }
);

// Send verify OTP
export const sendVerifyOtp = createAsyncThunk(
    "auth/sendVerifyOtp",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.post(`${API_URL}/api/auth/send-verify-otp`);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "OTP sending failed");
        }
    }
);

// Verify account
export const verifyAccount = createAsyncThunk(
    "auth/verifyAccount",
    async (otpData, { rejectWithValue }) => {
        try {
            const res = await axios.post(`${API_URL}/api/auth/verify-account`, otpData);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Verification failed");
        }
    }
);

// Send reset OTP
export const sendResetOtp = createAsyncThunk(
    "auth/sendResetOtp",
    async (emailData, { rejectWithValue }) => {
        try {
            const res = await axios.post(`${API_URL}/api/auth/send-reset-otp`, emailData);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "OTP sending failed");
        }
    }
);

// Reset password
export const resetPassword = createAsyncThunk(
    "auth/resetPassword",
    async (passwordData, { rejectWithValue }) => {
        try {
            const res = await axios.post(`${API_URL}/api/auth/reset-password`, passwordData);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Password reset failed");
        }
    }
);


//NOW MAKING SLICE
const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        loading: false,
        error: null,
        successMessage: null
    },
    reducers: {
        clearAuthState: (state) => {
            state.error = null;
            state.successMessage = null;
        }
    },
    extraReducers: (builder) => {
        const pendingCase = (state) => {
            state.loading = true;
            state.error = null;
            state.successMessage = null;
        };
        const fulfilledCase = (state, action) => {
            state.loading = false;
            state.user = action.payload.user || null;
            state.successMessage = action.payload.message || null;
        };
        const rejectedCase = (state, action) => {
            state.loading = false;
            state.error = action.payload;
        };


        //Regiister
        builder.addCase(registerUser.pending, pendingCase)
        builder.addCase(registerUser.fulfilled, fulfilledCase)
        builder.addCase(registerUser.rejected, rejectedCase)

        //Login
        builder     //we can also wrtie this and this is a good approach
            .addCase(loginUser.pending, pendingCase)
            .addCase(loginUser.fulfilled, fulfilledCase)
            .addCase(loginUser.rejected, rejectedCase);

        // Logout
        builder
            .addCase(logoutUser.pending, pendingCase)
            .addCase(logoutUser.fulfilled, fulfilledCase)
            .addCase(logoutUser.rejected, rejectedCase);

        // Send Verify OTP
        builder
            .addCase(sendVerifyOtp.pending, pendingCase)
            .addCase(sendVerifyOtp.fulfilled, fulfilledCase)
            .addCase(sendVerifyOtp.rejected, rejectedCase);

        // Verify Account
        builder
            .addCase(verifyAccount.pending, pendingCase)
            .addCase(verifyAccount.fulfilled, fulfilledCase)
            .addCase(verifyAccount.rejected, rejectedCase);

        // Send Reset OTP
        builder
            .addCase(sendResetOtp.pending, pendingCase)
            .addCase(sendResetOtp.fulfilled, fulfilledCase)
            .addCase(sendResetOtp.rejected, rejectedCase);

        //Reset password
        builder
            .addCase(resetPassword.pending, pendingCase)
            .addCase(resetPassword.fulfilled, fulfilledCase)
            .addCase(resetPassword.rejected, rejectedCase);
    }
})

export const { clearAuthState } = authSlice.actions;
export default authSlice.reducer;