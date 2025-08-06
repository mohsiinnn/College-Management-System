import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authService from "./authService";

const user = JSON.parse(localStorage.getItem('user'));

const initialState = {
    user: user ? user : null,
    loading: false,
    success: false,
    error: false,
    message: ""
}


//Register user
export const registerUser = createAsyncThunk("auth/registerUser",
    async (formData, thunkAPI) => {
        try {
            const response = await authService.register(formData)
            if (!response.success) {
                throw new Error(response.message || "Registration failed");
            }
            return response
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
            return thunkAPI.rejectWithValue(message)
        }
    }
)

// Login user
export const loginUser = createAsyncThunk("auth/loginUser",
    async (formData, thunkAPI) => {
        try {
            const response = await authService.login(formData)
            if (!response.success) {
                throw new Error(response.message || "Login failed");
            }
            return response;
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
            return thunkAPI.rejectWithValue(message)
        }
    }
)

//Logout user
export const logoutUser = createAsyncThunk("auth/logoutUser",
    async (_, thunkAPI) => {
        try {
            return await authService.logout()
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
            return thunkAPI.rejectWithValue(message)
        }
    }
)

// Send verify OTP
export const sendVerifyOtp = createAsyncThunk("auth/sendVerifyOtp",
    async (_, thunkAPI) => {
        try {
            return await authService.sendVerifyOtp()
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
            return thunkAPI.rejectWithValue(message)
        }
    }
)

// Verify account
export const verifyAccount = createAsyncThunk("auth/verifyAccount",
    async (formData, thunkAPI) => {
        try {
            const response = await authService.verifyAccount(formData)
            if (!response.success) {
                throw new Error(response.message || "Somthing failed");
            }
            return response
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
            return thunkAPI.rejectWithValue(message)
        }
    }
)

// Send reset OTP
export const sendResetOtp = createAsyncThunk("auth/sendResetOtp",
    async (formData, thunkAPI) => {
        try {
            return await authService.sendResetOtp(formData)
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
            return thunkAPI.rejectWithValue(message)
        }
    }
)

// Reset password
export const resetPassword = createAsyncThunk(
    "auth/resetPassword",
    async (formData, thunkAPI) => {
        try {
            return await authService.resetPassword(formData);
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
            return thunkAPI.rejectWithValue(message)
        }
    }
);


//NOW MAKING SLICE
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        clearAuthState: (state) => {
            state.loading = false;
            state.success = false;
            state.error = false;
            state.message = ""
        }
    },
    extraReducers: (builder) => {
        const pendingCase = (state) => {
            state.loading = true
        };
        const fulfilledCase = (state, action) => {
            state.loading = false;
            state.success = true
            state.user = action.payload.user
        };
        const rejectedCase = (state, action) => {
            state.loading = false
            state.error = true
            state.message = action.payload
            state.user = null
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