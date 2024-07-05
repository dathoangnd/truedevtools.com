import { useDispatch } from 'react-redux'
import type { IDispatch } from './'

// Use this instead of useDispatch to support Redux Thunk
export const useAppDispatch = useDispatch.withTypes<IDispatch>()