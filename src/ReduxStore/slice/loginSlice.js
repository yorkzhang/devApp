import { createSlice } from '@reduxjs/toolkit'

export const loginSlice= createSlice({
    name:'RLogin',
    initialState:{
        userId:''
    },
    reducers:{
        redexUserId: (state, action) =>{
            state.userId = action.payload
        }
    },
});

export const selectLogin = (state) => state.RLogin;
export const { redexUserId } = loginSlice.actions;
export default loginSlice.reducer