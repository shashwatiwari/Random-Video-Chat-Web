import React, { useState } from 'react';
import { TextField, Button, FormControlLabel, Typography, Radio, RadioGroup, FormLabel, Box, FormControl } from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';

const GuestLogin = () => {
    const [nickname, setNickname] = useState('');
    const [gender, setGender] = useState('');
    const [age, setAge] = useState('');
    const [country, setCountry] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        if (nickname && gender && age && country) {
            window.location.href = '/mainpage';
        }
    };
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mt: 8,
            }}
        >
            <PersonIcon fontSize="large" />
            <Typography component="h1" variant="h5">
                Enter as Guest
            </Typography>

            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    mt: 1,
                    background: '#fef8f8ec',
                    p: '10px',
                    borderRadius: '10px',
                }}
            >
                <TextField
                    margin="dense"
                    required
                    fullWidth
                    label="Nickname"
                    autoFocus
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    sx={{
                        fontSize: { xs: '14px', md: '16px' },
                    }}
                />
                <TextField
                    margin="dense"
                    padding="-10px"
                    required
                    fullWidth
                    label="Age"
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    sx={{
                        fontSize: { xs: '14px', md: '16px' },
                    }}
                />

                <FormControl component="fieldset" sx={{ mt: 3 }}>
                    <FormLabel component="legend">Gender</FormLabel>
                    <RadioGroup
                        row
                        sx={{
                            fontSize: { xs: '12px', md: '14px' },
                        }}
                        required
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
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
                    label="Country Name"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    sx={{
                        fontSize: { xs: '14px', md: '16px' },
                    }}
                />
                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                    Enter
                </Button>
            </Box>
        </Box>
    );
};

export default GuestLogin;
