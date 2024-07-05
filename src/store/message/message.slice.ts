import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { MessageInstance } from 'antd/es/message/interface'

export const messageSlice = createSlice({
  name: 'message',
  initialState: {
    messageInstance: null as MessageInstance|null
  },
  reducers: {
    setMessageInstance: (state, action: PayloadAction<MessageInstance>) => {
      state.messageInstance = action.payload
    },
    success: (state, action: PayloadAction<string|undefined>) => {
      state.messageInstance?.success(action.payload || 'Success')
    },
		error: (state,  action: PayloadAction<string|undefined>) => {
			state.messageInstance?.error(action.payload || 'Error')
		}
  }
})

export const { setMessageInstance, success, error } = messageSlice.actions

export default messageSlice.reducer