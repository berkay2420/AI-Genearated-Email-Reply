import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Paper,
  Stack,
  Tooltip,
  CssBaseline,
  Grid,
  Box,
  createTheme,
  ThemeProvider
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import Divider from '@mui/material/Divider';

import axios from 'axios';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#0ea5e9' },
    secondary: { main: '#6366f1' },
    background: { default: '#f8fafc', paper: '#ffffff' },
    text: { primary: '#1e293b', secondary: '#475569' },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h3: { fontWeight: 700, fontSize: '2.8rem', letterSpacing: '-0.5px' },
    h5: { fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: { root: { borderRadius: '9999px', textTransform: 'none', fontWeight: 600 } },
    },
    MuiPaper: {
      styleOverrides: { root: { borderRadius: '16px' } },
    },
  },
});

export default function App() {
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('Professional');
  const [language, setLanguage] = useState('English');
  const [generatedReply, setGeneratedReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [savedMails, setSavedMails] = useState([]);
  const [showMailsList, setShowMailsList] = useState(false);
  const [copied, setCopied] = useState(false);

  const tones = ['Professional', 'Friendly', 'Family', 'Casual', 'Urgent'];
  const languages = ['English', 'Turkish', 'Spanish', 'French', 'German'];

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setGeneratedReply('');

    try {
      const response = await axios.post("http://localhost:8080/api/email/generate", {
        emailContent,
        tone,
        language
      });
      setGeneratedReply(typeof response.data === 'string' ? response.data : JSON.stringify(response.data));
    } catch (error) {
      setError("Failed to generate AI reply. Please try again later.");
    } finally {
      setLoading(false);
      setSaved(false);
    }
  };

  const handleSave = async () => {
    setSaved(true);
    console.log("Save clicked");

    try {
      const mailToSave = {
        generatedMail: generatedReply,
        language: language,
        tone: tone,
        createdAt: new Date().toISOString()
      }
      const response = await axios.post("http://localhost:8080/api/email/save-mail", mailToSave)
      setSavedMails(prev => [...prev, response.data]); //copy the previous list and add new item 

      console.log("Mail saved successfully:", response.data);

    } catch (error) {
      setError("Failed to save the mail. Please try again later.");
      
    }
  };

  const handleListMails = async () => {
    setShowMailsList(!showMailsList);
  };


  const handleCopy = () => {
    navigator.clipboard.writeText(generatedReply);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />

      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 }, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box textAlign="center" mb={6}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              background: 'linear-gradient(to right, #0ea5e9, #6366f1)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
            }}
          >
            AI Email Reply Generator
          </Typography>
          <Typography variant="h6" color="text.secondary" fontWeight={400}>
            Craft the perfect email response in seconds. Just paste your email, choose your style, and let AI do the rest.
          </Typography>
        </Box>

        <Grid container spacing={4} justifyContent="center" alignItems="stretch" sx={{ minHeight: '600px' }} >
          {/* Left Panel */}
          <Grid item xs={12} md={6} sx={{ display: 'flex' }} >
            <Paper elevation={3} sx={{ p: 3, border: '1px solid #e2e8f0', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <Stack spacing={3} flex={1}>
                {/* Email input */}
                <Box>
                  <Typography variant="subtitle2" component="label" htmlFor="emailContent" fontWeight={600} gutterBottom>
                    Paste the original email content here
                  </Typography>
                  <TextField
                    id="emailContent"
                    fullWidth
                    multiline
                    rows={6}
                    variant="outlined"
                    value={emailContent}
                    onChange={(e) => setEmailContent(e.target.value)}
                    placeholder="e.g., Dear Team, Can we reschedule tomorrow's meeting?..."
                    sx={{ mt: 1, '& .MuiOutlinedInput-root': { backgroundColor: '#f8fafc' } }}
                  />
                </Box>

                {/* Tone selection */}
                <Box>
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    Select a Tone
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1 }}>
                    {tones.map((t) => (
                      <Button key={t} onClick={() => setTone(t)} variant={tone === t ? 'contained' : 'outlined'} color="primary">
                        {t}
                      </Button>
                    ))}
                  </Stack>
                </Box>

                {/* Language selection */}
                <Box>
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    Select Reply Language
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1 }}>
                    {languages.map((l) => (
                      <Button key={l} onClick={() => setLanguage(l)} variant={language === l ? 'contained' : 'outlined'} color="secondary">
                        {l}
                      </Button>
                    ))}
                  </Stack>
                </Box>

                {/* Submit button */}
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={loading}
                  size="large"
                  startIcon={loading ? null : <AutoAwesomeIcon />}
                  sx={{
                    py: 1.5,
                    fontSize: '1rem',
                    borderRadius: '8px',
                    color: 'white',
                    background: 'linear-gradient(to right, #0ea5e9, #6366f1)',
                    '&:hover': { background: 'linear-gradient(to right, #0369a1, #4f46e5)' },
                  }}
                >
                  {loading ? <CircularProgress size={26} color="inherit" /> : 'Generate Reply'}
                </Button>
                <Button
                  variant="contained"
                  onClick={handleListMails}
                  disabled={loading}
                  size="large"
                  startIcon={loading ? null : <FormatListBulletedIcon />}
                  sx={{
                    py: 1.5,
                    fontSize: '1rem',
                    borderRadius: '8px',
                    color: 'white',
                    background: 'linear-gradient(to right, #0ea5e9, #6366f1)',
                    '&:hover': { background: 'linear-gradient(to right, #0369a1, #4f46e5)' },
                  }}
                >
                  {loading ? <CircularProgress size={26} color="inherit" /> : 'List Saved Mails'}
                </Button>                  



              </Stack>
            </Paper>
          </Grid>

          {/* Right Panel */}
          <Grid item xs={12} md={6} sx={{ display: 'flex', maxWidth: 600 }}>
            <Paper elevation={3} sx={{ p: 3, display: 'flex', flexDirection: 'column', flex: 1, border: '1px solid #e2e8f0' }}>
              {/* Header */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" component="h2">
                  Generated Reply
                </Typography>
                {generatedReply && (

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title={saved ? 'Saved!' : 'Save This Mail'}>
                      <Button
                        onClick={handleSave}
                        variant="outlined"
                        color={saved ? 'success' : 'secondary'}
                        startIcon={saved ? <BookmarkAddedIcon /> : <LibraryAddIcon />}
                        sx={{ borderRadius: '8px' }}
                      >
                        {saved ? 'Saved!' : 'Save This Mail'}
                      </Button>
                    </Tooltip>    

                  <Tooltip title={copied ? 'Copied!' : 'Copy to Clipboard'}>
                    <Button
                      onClick={handleCopy}
                      variant={copied ? 'contained' : 'outlined'}
                      color={copied ? 'success' : 'secondary'}
                      startIcon={copied ? <CheckIcon /> : <ContentCopyIcon />}
                      sx={{ borderRadius: '8px' }}
                    >
                      {copied ? 'Copied' : 'Copy'}
                    </Button>
                  </Tooltip>
                  </Box>
                )}
              </Box>

              {/* Content */}
              <Box
                sx={{
                  flex: 1,               
                  overflowY: 'auto',     
                  minHeight: '0px',      
                  backgroundColor: '#f8fafc',
                  p: 2,
                  borderRadius: 2,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {error && <Typography color="error">{error}</Typography>}
                {!error && (generatedReply || <Typography color="text.secondary">Your AI-generated reply will appear here...</Typography>)}
              </Box>
            </Paper>
          </Grid>

         {savedMails.map((mail, index) => (
          <Grid item xs={12} sx={{ mt: 4 }}>
            <Stack spacing={2}>
              {savedMails.map((mail, index) => (
                <Paper
                  key={index}
                  variant="outlined"
                  sx={{
                    p: 2,
                    width: '100%',      
                    maxWidth: 900,      
                    overflowWrap: 'break-word',  
                    backgroundColor: '#f1f5f9',
                    borderRadius: 2
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Saved: {new Date(mail.createdAt).toLocaleString()}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography
                    variant="body2"
                    sx={{
                      whiteSpace: 'pre-wrap',
                      p: 1.5,
                      borderRadius: 1,
                      backgroundColor: '#e2e8f0'
                    }}
                  >
                    {mail.generatedMail}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Tone: {mail.tone} | Language: {mail.language}
                    </Typography>
                  </Box>
                </Paper>
              ))}
            </Stack>
          </Grid>
        ))}

        </Grid>
      </Container>
    </ThemeProvider>
  );
}
