import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


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