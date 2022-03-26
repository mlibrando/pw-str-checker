/* eslint-disable no-param-reassign */
/* eslint-disable import/no-unresolved */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { postPassword } from 'app/main/utils/password/pwStrengthCheckerApiCall';

const _ = require('lodash');

const initialState = {
  score: 0,
  guessTimeSeconds: 0,
  guessTimeString: '',
  warning: '',
  suggestions: [],
};

export const checkPassword = createAsyncThunk(
  'password/checker',
  async (data) => {
    const response = await postPassword(data);
    return response;
  },
);

export const pwStrengthCheckerSlice = createSlice({
  name: 'password',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkPassword.fulfilled, (state, action) => {
        let suggestion = [];
        if (!_.isEmpty(action.payload.suggestions)) {
          suggestion = action.payload.suggestions.map((element) => element);
        }
        state.score = action.payload.score;
        state.guessTimeSeconds = action.payload.guessTimeSeconds;
        state.guessTimeString = action.payload.guessTimeString;
        state.warning = action.payload.warning;
        state.suggestions = suggestion;
      });
  },

});

export const passwordData = (state) => state.password;

export default pwStrengthCheckerSlice.reducer;
