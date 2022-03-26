/* eslint-disable import/no-unresolved */
import React, {
  useState, useRef, useMemo, useEffect,
} from 'react';
import {
  CircularProgress,
  IconButton,
  InputAdornment,
  LinearProgress,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import {
  passwordData,
  checkPassword,
} from 'features/pwstrchecker/pwStrengthCheckerSlice';
import 'app/styles/styles.css';

const _ = require('lodash');

function StrengthChecker() {
  const dispatch = useDispatch();
  const pwData = useSelector((passwordData));
  const [values, setValues] = useState({
    password: '',
    showPassword: false,
  });
  const [initState, setInitState] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const updatedValue = useRef('');
  const isPasswordValueValid = () => !_.isEmpty(updatedValue.current);

  useEffect(() => {
    if (!isPasswordValueValid()) {
      setInitState(true);
      setIsProcessing(false);
    }
  }, [values.password]);

  const handleChange = () => async (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
    updatedValue.current = event.target.value;
    const data = {
      password: updatedValue.current,
    };
    setIsProcessing(true);
    if (isPasswordValueValid()) {
      await dispatch(checkPassword(data));
      setIsProcessing(false);
    }
    setInitState(false);
  };

  const debouncedHandleChange = useMemo(() => _.debounce(handleChange(), 500), []);

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const renderStrengthMeter = () => {
    let { score } = pwData;
    let ret = '';
    score *= 25;
    if (isPasswordValueValid() && !initState) {
      ret = (
        <div id={`str-meter-${score}`} className="my-6">
          <LinearProgress className="p-1 rounded-sm" variant="determinate" value={score} />
        </div>
      );
    }
    return ret;
  };

  const renderPWStrengthPhrase = () => {
    let phrase = '';
    if (isPasswordValueValid() && !initState) {
      switch (pwData.score) {
        case 0:
          phrase = 'Your password is too weak!';
          break;
        case 1:
          phrase = 'Your password is weak!';
          break;
        case 2:
          phrase = 'Your password is fair';
          break;
        case 3:
          phrase = 'Your password is good';
          break;
        case 4:
          phrase = 'Your password is strong!';
          break;
        default:
          break;
      }
    }

    return phrase;
  };

  const renderGuessTimeAndWarnings = () => {
    let phrase = '';
    let warning = '';
    if (!_.isEmpty(pwData.warning)) {
      ({ warning } = pwData);
    }
    if (isPasswordValueValid() && !initState) {
      phrase = `It will take ${pwData.guessTimeString} to guess your password. ${warning}`;
    }
    return phrase;
  };

  const renderSuggestions = () => {
    let suggestions = '';
    if (isPasswordValueValid() && !initState && !_.isEmpty(pwData.suggestions)) {
      ({ suggestions } = pwData);
      suggestions = suggestions.map((suggestion) => `${suggestion} `);
    }
    return suggestions;
  };

  const renderPWStrings = () => {
    let ret = '';
    if (!isProcessing) {
      ret = (
        <div>
          {renderStrengthMeter()}
          <div className="text-center">
            <Typography variant="h5">
              {renderPWStrengthPhrase()}
            </Typography>
          </div>
          <div className="text-center">
            <Typography>
              {renderGuessTimeAndWarnings()}
            </Typography>
          </div>
          <div className="text-center mt-4">
            <Typography variant="h6">
              {renderSuggestions()}
            </Typography>
          </div>
        </div>
      );
    } else {
      ret = (
        <div className="flex justify-center mt-4">
          <CircularProgress />
        </div>
      );
    }
    return ret;
  };

  return (
    <div>
      <Paper elevation={3} className="p-4">
        <div className="flex justify-center mb-6">
          <Typography
            variant="h4"
          >
            Is your password strong enough?
          </Typography>
        </div>
        <div className="flex justify-center">
          <TextField
            fullWidth
            label="Type a password"
            name="password"
            type={values.showPassword ? 'text' : 'password'}
            defaultValue={values.password}
            onChange={debouncedHandleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {values.showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>
        {renderPWStrings()}
      </Paper>
    </div>
  );
}

export default StrengthChecker;
