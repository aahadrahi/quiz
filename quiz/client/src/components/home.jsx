import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {Box, Button,Container,CssBaseline,Typography,ThemeProvider,Stack,} from '@mui/material';
import { createTheme } from '@mui/material/styles'; 
import image from '../images/home.jpg';
const theme = createTheme();
function Home() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [quiz, setquiz] = useState('');
  useEffect(() => {
    axios.get('http://localhost:8081', { withCredentials: true })
      .then(res => {
        if (res.data.valid) {
          setName(res.data.fullname);
          setquiz(res.data.quiz);
        } else {
          navigate('/sign-in');
        }
      })
      .catch(err => console.log(err));
  }, [navigate]);
 

  axios.defaults.withCredentials = true;
  

  const handleLogout = () => {
    axios.post('http://localhost:8081/logout')
      .then(res => navigate('/sign-in'))
      .catch(err => console.log(err));
  };
  const handleQuiz = () => {
    navigate('/quiz')
  };
  const startButton = !quiz && <Button variant="contained" onClick={handleQuiz}>Start Quiz</Button>;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
     
      <main>
        {/* Hero unit */}
        <Box
          sx={{
            bgcolor: 'background.paper',
            pt: 0,
            pb: 70,
            backgroundImage: `url(${image})`,
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <Container maxWidth="sm">
            <Typography
              component="h4"
              variant="h3"
              align="center"
              color="primary.main"
              gutterBottom
              sx={{ pt: 12 }}
            >
           {name}
            </Typography>
            {/* <Typography variant="h5" align="center" color="text.secondary" paragraph>
            This quiz is designed to test your knowledge and skills on various topics. It will include multiple choice questions, true/false statements,                       
            </Typography> */}
            <Stack
             
              direction="row"
              spacing={2}
              justifyContent="center"
            >
              {
               startButton
              }
             
              <Button variant="outlined"onClick={handleLogout}>Logout</Button>
            </Stack>
          </Container>
        </Box>
        </main>
        </ThemeProvider>
  );
}

export default Home;
