
import React, { useState } from 'react';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Box, Typography, TextField, Button, FormControl, FormControlLabel, Radio, RadioGroup, FormLabel, Select, MenuItem, } from '@mui/material';

const SignUpForm = () => {
    const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [gender, setGender] = useState('');
    const [age, setAge] = useState('');
    const [country, setCountry] = useState('');

    const handleSignUp = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('/api/auth/signup', {
                nickname,
                email,
                password,
                gender,
                age,
                country,
            });
            if (response.data.message === 'User registered successfully') {
                toast.success('Signed up successfully!', {
                    position: 'top-right',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                setTimeout(() => {
                    window.location.href = '/signin';
                }, 3000);

            }
            console.log(response.data);
        } catch (error) {
            toast.error('Email id already registered', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            console.error(error);
        }
    };


    return (
        <Box onSubmit={handleSignUp}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mt: 8,
                p: 2,
            }}
        >
            <LockOutlinedIcon sx={{ mb: 2 }} />
            <Typography component="h1" variant="h5">
                Sign up
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
                    },
                }}>
                <TextField
                    margin="dense"
                    required
                    fullWidth
                    label="Nickname"
                    autoFocus
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                />
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
                <FormControl component="fieldset" sx={{ mt: 3 }}>
                    <FormLabel component="legend">Gender</FormLabel>
                    <RadioGroup
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        row
                        sx={{
                            fontSize: { xs: '12px', md: '14px' },
                        }}
                    >
                        <FormControlLabel value="male" control={<Radio />} label="Male" />
                        <FormControlLabel value="female" control={<Radio />} label="Female" />
                        <FormControlLabel value="other" control={<Radio />} label="Other" />
                    </RadioGroup>
                </FormControl>
                <TextField
                    margin="dense"
                    required
                    fullWidth
                    label="Age"
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                />
                <FormControl
                    fullWidth
                    required
                    margin='dense'
                >
                    <FormLabel>Country</FormLabel>
                    <Select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                    >
                        <MenuItem value="india">India</MenuItem>
                        <MenuItem value="us">United States</MenuItem>
                        <MenuItem value="uk">United Kingdom</MenuItem>
                        {/* Add more country options */}
                    </Select>
                </FormControl>
                <Button
                    fullWidth
                    color="primary"
                    type='submit'
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                    Sign Up
                </Button>
            </Box>
        </Box>
    );
}
export default SignUpForm;
