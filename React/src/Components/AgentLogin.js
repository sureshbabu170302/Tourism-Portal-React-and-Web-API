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
import AgentBg from '../Assets/media/agentlogin.jpg';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { enc, AES } from 'crypto-js';

const defaultTheme = createTheme();

export default function AgentSignIn() {
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [isValidated, setIsValidated] = useState(false);
    const [token, setToken] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handlePasswordToggle = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    const navigate = useNavigate();

    const handleInputChange = (event) => {
        if (isValidated) {
            setIsValidated(false);
            setErrors({});
        }
    };

    const handleAgentSignIn = async (event) => {
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

        try {
            const response = await axios.post('https://localhost:7234/api/Tokens/TravelAgent', {
                travelAgent_Email: email,
                travelAgent_Password: password,
            });

            const token = response.data;
            setToken(token);
            localStorage.setItem('token', token);
            const encryptedEmail = AES.encrypt(email, 'your-secret-key').toString();
            localStorage.setItem('encrypted_email', encryptedEmail);
            setOpenSnackbar(true);
        } catch (error) {
            console.error('Error while fetching token:', error);
            setIsValidated(false);
            setErrors({ email: 'Invalid credentials', password: 'Invalid credentials' });
        }

        setIsValidated(true);
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
     navigate('/Agent');
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
            background-image: url(${AgentBg});
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
                    MakeMyTrip - Agent Panel
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
                        Agent Sign in
                    </Typography>
                    <Box component="form" onSubmit={handleAgentSignIn} noValidate sx={{ mt: 1 }}>
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
                                <Link
                                    href="#"
                                    variant="body2"
                                    sx={{ backgroundColor: 'yellow' }}
                                    onClick={() => navigate('/AgentSignup')}
                                >
                                    {'Already have an account? Sign In'}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                onExited={() => navigate('/Agent')} 
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <MuiAlert
                    elevation={6}
                    variant="filled"
                    onClose={handleSnackbarClose}
                    severity="success"
                >
                    Login Successful
                </MuiAlert>
            </Snackbar>


        </ThemeProvider>
    );
}
