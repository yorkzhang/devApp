import { configureStore } from '@reduxjs/toolkit'

import loginSlice from './slice/loginSlice'
import userSlice from './slice/userSlice'

export default configureStore({
    reducer:{
        RLogin: loginSlice,
        RUser: userSlice,
    },
})