// src/components/Navbar.jsx
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, useTheme, useMediaQuery } from '@mui/material';
import { styled } from '@mui/system';

const AnimatedButton = styled(Button)(({ theme }) => {
    const currentTheme = useTheme();
    return {
        transition: 'transform 0.3s ease, background-color 0.3s ease',
        '&:hover': {
            transform: 'scale(1.1)',
            backgroundColor: currentTheme.palette.action.hover,
        },
    };
});

const Navbar = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <AppBar position="static" sx={{ marginBottom: 2 }}>
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    🏆 League Pro 
                </Typography>
                {!isMobile && (
                    <>
                       
                        <AnimatedButton color="inherit" component={Link} to="/leagues">Leagues</AnimatedButton>
                        <AnimatedButton color="inherit" component={Link} to="/matches">Matches</AnimatedButton>
                        <AnimatedButton color="inherit" component={Link} to="/players">Players</AnimatedButton>
                        <AnimatedButton color="inherit" component={Link} to="/teams">Teams</AnimatedButton>
                        <AnimatedButton color="inherit" component={Link} to="/scores">Scores</AnimatedButton>
                        <AnimatedButton color="inherit" component={Link} to="/login">Logout</AnimatedButton>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
