import { Link } from 'react-router-dom';
import React from 'react';
import {Avatar,Box, Button,Paper,CssBaseline,FormHelperText,Grid,TextField,Typography,FormControl,ThemeProvider,Select,MenuItem, InputLabel,InputAdornment,IconButton,} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme } from '@mui/material/styles';
import { useState ,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import image from '../images/login.jpg';  
import Axios from 'axios';

const theme = createTheme();

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [fullname, setFullname] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [fathername, setFathername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState(false);
  const [fullnameError, setFullnameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [fathernameError, setFathernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [registerStatus, setRegisterStatus] = useState("");
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedOptionError, setSelectedOptionError] = useState(false);
  const navigate = useNavigate();
  Axios.defaults.withCredentials=true;
  useEffect(() => {
    Axios.get('http://localhost:8081').then(res => {
   if(res.data.valid){
    navigate('/');
   }
    })
    .catch(err => console.log(err))
  }, [navigate]);


  
  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
    setUsernameError(false);
  };

  const handleFullnameChange = (event) => {
    setFullname(event.target.value);
    setFullnameError(false);
  };


  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setEmailError(false);
  };
  const handleFathernameChange = (event) => {
    setFathername(event.target.value);
    setFathernameError(false);
  };
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setPasswordError(false);
  };
  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
    setSelectedOptionError(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validateUsername(username) && validateEmail(email) && validatePassword(password) && validateFathername(fathername) && validateSelectedOption(selectedOption) && validateFullname(fullname)) {
      Axios.post("http://localhost:8081/sign-up",{
        email: email,
        username: username,
        password: password,
        fathername:fathername,
        class:selectedOption,
        fullname:fullname,
       })
        .then((response) => {
        if(response.data.message){
          setRegisterStatus(response.data.message);
        }else{
        setRegisterStatus("ACCOUNT CREATED SUCCESSFULLY");
        navigate('/');
      }})
     
    } else {
      if (!validateFullname(fullname)) {
        setFullnameError(true);
        return;
      }
      if (!validateUsername(username)) {
        setUsernameError(true);
        return;
      }
      if (!validateFathername(fathername)) {
        setFathernameError(true);
        return;
      }
      if (!validateSelectedOption(selectedOption)) {
        setSelectedOptionError(true);
        return;
      }
      if (!validateEmail(email)) {
        setEmailError(true);
        return;
      }
      if (!validatePassword(password)) {
        setPasswordError(true);
        return;
      }
     
    
     
    }
  };

  const validateUsername = (username) => {
    // Replace this with your own validation logic
   // Matches strings with at least one non-space character
   const regex = /^\S+$/;
  return  regex.test(username) && username.length >= 5;
  };

  const validateFathername = (fathername) => {
    // Replace this with your own validation logic

  return fathername.length >= 3;
  };

  const validateFullname = (fullName) => {
    // Replace this with your own validation logic

  return fullName.length >= 3;
  };
  const validateEmail = (email) => {
    // Replace this with your own validation logic
    const emailRegex = /^\S+@\S+\.\S+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    // Replace this with your own validation logic
    return password.length >= 8;
  };
 

  const validateSelectedOption = (selectedOption) => {
    if (!selectedOption) {
      // If no option is selected, return false
      return false;
    }
  
    const validOptions = [5, 6, 7, 8];
  
    // Check if the selected option is included in the valid options array
    return validOptions.includes(selectedOption);
  };

  return (
    <ThemeProvider theme={theme}>
    <Grid container component="main" sx={{ height: '100vh' }}>
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: `url(${image})`,
          backgroundRepeat: 'no-repeat',
          backgroundColor: (t) =>
            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
            <Grid item xs={6}>
                <TextField
                 
                  autoComplete="given-name"
                  name="fullName"
                  required
                  fullWidth
                  id="fullName"
                  label="Full Name"
                  autoFocus
                  value={fullname}
                  onChange={handleFullnameChange}
                  error={fullnameError}
                  helperText={fullnameError && 'Please enter a valid fullName'}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                 
                  autoComplete="given-name"
                  name="userName"
                  required
                  fullWidth
                  id="userName"
                  label="Username"
                  value={username}
                  onChange={handleUsernameChange}
                  error={usernameError}
                  helperText={usernameError && 'Please enter a valid username'}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                 
                  autoComplete="father-name"
                  name="fatherName"
                  required
                  fullWidth
                  id="fatherName"
                  label="Father Name"
                  value={fathername}
                  onChange={handleFathernameChange}
                  error={fathernameError}
                  helperText={fathernameError && 'Please enter a valid father name'}
            
                />
              </Grid>
              <Grid item xs={6}>
              <FormControl fullWidth  required error={selectedOptionError}>
      <InputLabel id="demo-simple-select-helper-label">Select an Class</InputLabel>
      <Select
        labelId="demo-simple-select-helper-label"
        id="demo-simple-select-helper"
        value={selectedOption}
        onChange={handleOptionChange}
        label="Select an Class"
      

      >
     
          <MenuItem value={5}>Class 5</MenuItem>
          <MenuItem value={6}>Class 6</MenuItem> 
          <MenuItem value={7}>Class 7</MenuItem>
          <MenuItem value={8}>Class 8</MenuItem>
         
      </Select>
      <FormHelperText>{selectedOptionError && 'Please select a class'}</FormHelperText>
      </FormControl>
    </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={handleEmailChange}
                  error={emailError}
                  helperText={emailError && 'Please enter a valid email address'}
                />
              </Grid>
          
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
        
                  id="password"
                  autoComplete="current-password"
                  onChange={handlePasswordChange}
                  error={passwordError}
                  helperText={
                    passwordError &&
                    "Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one digit and without spaces."
                  }
                  type={showPassword ? "text" : "password"}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {showPassword ?<Visibility />:<VisibilityOff /> }
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              {/* <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox value="allowExtraEmails" color="primary" />}
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />
              </Grid> */}

            </Grid>
            <Grid container>
              <Grid item xs>
               {registerStatus}
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
              Already have an account?<Link to="/sign-in" style={{textDecoration: 'none'}} variant="body2">   Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        </Grid>
        </Grid>
    </ThemeProvider>
  );
}