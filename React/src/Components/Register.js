import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import VisibilityIcon from '@mui/icons-material/Visibility'; 
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Bg from '../Assets/media/bg.jpg'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const defaultTheme = createTheme();

export default function SignUp() {
  const [formData, setFormData] = useState({
    travellerUsername: '',
    travellerEmail: '',
    travellerPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handlePasswordToggle = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = {};

    if (!formData.travellerUsername || formData.travellerUsername.length > 100) {
      validationErrors.travellerUsername = 'Traveller_Username must not exceed 100 characters.';
    }

    if (
      !formData.travellerEmail ||
      !/\S+@\S+\.\S+/.test(formData.travellerEmail)
    ) {
      validationErrors.travellerEmail = 'Invalid email address.';
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/;
    if (
      !formData.travellerPassword ||
      !passwordRegex.test(formData.travellerPassword)
    ) {
      validationErrors.travellerPassword =
        'Password must contain at least one uppercase letter, one lowercase letter, and one special character.';
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      const response = await axios.post('https://localhost:7234/api/Travelers', {
        traveller_Username: formData.travellerUsername,
        traveller_Email: formData.travellerEmail,
        traveller_Password: formData.travellerPassword,
      });

      console.log('Success');
      navigate('/');
    } catch (error) {
      console.error('Error:', error);
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
            background-image: url(${Bg});
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
          MakeMyTrip
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
            User Sign Up
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="travellerUsername"
              label="Username"
              name="travellerUsername"
              autoComplete="off"
              autoFocus
              value={formData.travellerUsername}
              onChange={handleChange}
              error={!!errors.travellerUsername}
              helperText={errors.travellerUsername}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="travellerEmail"
              label="Email Address"
              name="travellerEmail"
              autoComplete="off"
              value={formData.travellerEmail}
              onChange={handleChange}
              error={!!errors.travellerEmail}
              helperText={errors.travellerEmail}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="travellerPassword"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="travellerPassword"
              autoComplete="off"
              value={formData.travellerPassword}
              onChange={handleChange}
              error={!!errors.travellerPassword}
              helperText={errors.travellerPassword}
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
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Sign Up
            </Button>
            <Grid container>
              <Grid item>
                <Link
                  href="#"
                  variant="body2"
                  onClick={() => navigate('/')}
                >
                  {'Already have an account? Sign In'}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
