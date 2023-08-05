import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AdminBg from '../Assets/media/AdminBg.jpg';

const defaultTheme = createTheme();

export default function AdminSignIn() {
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isValidated, setIsValidated] = useState(false);

  const handlePasswordToggle = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get('email');
    const password = data.get('password');
    const validationErrors = {};

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      validationErrors.email = 'Please enter a valid email address';
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/;
    if (!password || !passwordRegex.test(password)) {
      validationErrors.password =
        'Password must contain at least one uppercase letter, one lowercase letter, and one special character.';
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setIsValidated(false);
      return;
    }

    console.log({ email, password });
    setIsValidated(true);
  };

  const handleInputChange = (event) => {
    if (isValidated) {
      setIsValidated(false);
      setErrors({});
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <style>
        {`
          html,
          body {
            height: 100%;
            margin: 0;
            background-image: url(${AdminBg});
            background-size: cover;
          }
        `}
      </style>
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography component="h1" variant="h3" sx={{ mt: 5 }}>
          MakeMyTrip - Admin Panel
        </Typography>
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Admin Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              error={isValidated && !!errors.email}
              helperText={
                isValidated ? (
                  <span style={{ color: 'red' }}>{errors.email || ''}</span>
                ) : (
                  errors.email
                )
              }
              sx={{
                '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                  borderColor: isValidated && !errors.email ? 'green' : 'red',
                },
              }}
              onChange={handleInputChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              error={isValidated && !!errors.password}
              helperText={
                isValidated ? (
                  <span style={{ color: 'red' }}>{errors.password || ''}</span>
                ) : (
                  errors.password
                )
              }
              sx={{
                '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline': {
                  borderColor: isValidated && !errors.password ? 'green' : 'red',
                },
              }}
              onChange={handleInputChange}
              InputProps={{
                endAdornment: (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'pointer',
                    }}
                    onClick={handlePasswordToggle}
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </Box>
                ),
              }}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Sign In
            </Button>
            <Grid container>
              <Grid item>
                <Link href="#" variant="body2" sx={{ backgroundColor: 'violet' }}>
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
