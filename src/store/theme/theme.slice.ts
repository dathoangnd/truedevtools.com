import { createSlice } from '@reduxjs/toolkit'
import { ITheme } from './theme.types'

export const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    theme: localStorage.tdTheme === 'dark' ? 'dark' : 'light' as ITheme
  },
  reducers: {
    toggleTheme: (state) => {
      let theme: ITheme = 'light'
      if (state.theme === 'light') {
        theme = 'dark'
      }

      state.theme = theme
      localStorage.tdTheme = theme
    }
  }
})

export const { toggleTheme } = themeSlice.actions

export default themeSlice.reducer