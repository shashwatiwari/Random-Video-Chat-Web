
import React, { useState } from 'react';
import { TextField, Button, FormControl, FormControlLabel, Checkbox, Link, Typography, Box, Grid, Radio, RadioGroup } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import axios from 'axios';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [jobs, setJobs] = useState('');
    const [error, setError] = useState('');
    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`http://localhost:5000/api/auth/signin`, {
                email,
                password
            });

            const { token } = response.data;

            localStorage.setItem('token', token);

            if (response.data.message === 'Login successful') {
                window.location.href = '/mainpage';
            }
            console.log(response.data);
        } catch (error) {
            setError('Invalid credentials. Please try again.');
            console.error(error);
        }
    };


    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mt: 8,
                p: 5,
            }}
        >
            <LockOutlinedIcon sx={{ mb: 2 }} />
            <Typography component="h1" variant="h5">
                Sign in
            </Typography>
            <Box component="form"
                sx={{
                    mt: 1,
                    background: '#fef8f8ec',
                    padding: '10px',
                    borderRadius: '10px',
                    width: {
                        xs: '100%',
                        sm: '30%',
                        // md: '60%'
                    },
                }}>
                <TextField
                    margin="dense"
                    required
                    fullWidth
                    label="Username or Email"
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    margin="dense"
                    required
                    fullWidth
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <FormControl component="fieldset" sx={{ mt: 1 }}>
                    <RadioGroup
                        row
                        sx={{
                            fontSize: { xs: '12px', md: '14px' },
                        }}
                        required
                        value={jobs}
                        onChange={(e) => setJobs(e.target.value)}
                    >
                        <FormControlLabel value="recruiter" control={<Radio />} label="Recruiter" />
                        <FormControlLabel value="jobseeker" control={<Radio />} label="JobSeeker" />
                    </RadioGroup>
                </FormControl>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={rememberMe}
                            onChange={() => setRememberMe((prev) => !prev)}
                            color="primary"
                        />
                    }
                    label="Remember me"
                />
                {error && <Typography color="error">{error}</Typography>}
                <Button
                    fullWidth
                    variant="contained"
                    sx={{ mt: 2, mb: 2 }}
                    onClick={handleLogin}
                >
                    Sign In
                </Button>
                <Grid container justifyContent="flex-end" sx={{ textAlign: 'center', display: 'block' }}>
                    <Grid item>
                        <Link href="#" variant="body2">
                            Forgot Password?
                        </Link>
                    </Grid>
                </Grid>
                <Grid container justifyContent="flex-end" sx={{ textAlign: 'center', display: 'block', mb: '1' }}>
                    <Grid item>
                        {/* <Link to="" onClick={scrollToTop}>Home</Link> */}
                        <Link to="/signup" href="/signup" variant="body2">
                            Don't have an account? Sign Up
                        </Link>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default LoginForm;
