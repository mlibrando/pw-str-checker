/* eslint-disable import/no-unresolved */
/* eslint-disable import/prefer-default-export */
import { configureStore } from '@reduxjs/toolkit';
import passwordReducer from 'features/pwstrchecker/pwStrengthCheckerSlice';

export const store = configureStore({
  reducer: {
    password: passwordReducer,
  },
});
