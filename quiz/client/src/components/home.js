import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {Box, Button,Container,CssBaseline,Typography,ThemeProvider,Stack,} from '@mui/material';
import { createTheme } from '@mui/material/styles'; 
const theme = createTheme();
function Home() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  useEffect(() => {
    axios.get('http://localhost:8081', { withCredentials: true })
      .then(res => {
        if (res.data.valid) {
          setName(res.data.fullname);
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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
     
      <main>
        {/* Hero unit */}
        <Box
          sx={{
            bgcolor: 'background.paper',
            pt: 8,
            pb: 6,
          }}
        >
          <Container maxWidth="sm">
            <Typography
              component="h3"
              variant="h3"
              align="center"
              color="text.primary"
              gutterBottom
            >
             Test Your Skills {name}
            </Typography>
            <Typography variant="h5" align="center" color="text.secondary" paragraph>
            This quiz is designed to test your knowledge and skills on various topics. It will include multiple choice questions, true/false statements,                       
            </Typography>
            <Stack
              sx={{ pt: 4 }}
              direction="row"
              spacing={2}
              justifyContent="center"
            >
              <Button variant="contained" onClick={handleQuiz}>Start Quiz</Button>
              <Button variant="outlined"onClick={handleLogout}>Logout</Button>
            </Stack>
          </Container>
        </Box>
        </main>
        </ThemeProvider>
  );
}

export default Home;
