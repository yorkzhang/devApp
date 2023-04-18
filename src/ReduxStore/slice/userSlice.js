import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

export const userSlice = createSlice({
    name:'RUser',
    initialState:{
        userInfo: { CustomerTenantId:'', UserGroup:'' , CompanyOrgId:''}
    },
    reducers:{
        UserInfo: (state, action) =>{
            state.userInfo.CustomerTenantId = action.payload.CustomerTenantId
            state.userInfo.UserGroup = action.payload.UserGroup
            state.userInfo.CompanyOrgId = action.payload.CompanyOrgId
            state.userInfo.CompanyUserID = action.payload.CompanyUserID
        }
    },
})

export const selectUser = (state) => state.RUser;
export const { UserInfo } = userSlice.actions;
export default userSlice.reducer