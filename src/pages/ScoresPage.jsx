import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Card,
    CardContent,
    Typography,
    Button,
    TextField,
    Grid,
    Box,
    CircularProgress,
    Snackbar,
    Alert,
    Autocomplete,
} from "@mui/material";
import { motion } from "framer-motion";

const ScoresPage = () => {
    const [matches, setMatches] = useState([]);
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [updatedScore, setUpdatedScore] = useState({ scoreTeamA: 0, scoreTeamB: 0 });
    const [loading, setLoading] = useState(false);
    const [newMatch, setNewMatch] = useState({ name: "", date: "" });
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    // Fetch matches on component mount
    useEffect(() => {
        fetchMatches();
    }, []);

    const fetchMatches = () => {
        setLoading(true);
        axios
            .get("/api/livescore/matches")
            .then((response) => setMatches(Array.isArray(response.data) ? response.data : []))
            .catch(() => setSnackbar({ open: true, message: "Error fetching matches", severity: "error" }))
            .finally(() => setLoading(false));
    };

    const fetchMatchDetails = (matchId) => {
        setLoading(true);
        axios
            .get(`/api/livescore/match/${matchId}`)
            .then((response) => setSelectedMatch(response.data))
            .catch(() => setSnackbar({ open: true, message: "Error fetching match details", severity: "error" }))
            .finally(() => setLoading(false));
    };

    const handleScoreUpdate = () => {
        axios
            .put(`/api/livescore/${selectedMatch.id}`, updatedScore)
            .then((response) => {
                setSelectedMatch(response.data);
                setSnackbar({ open: true, message: "Score updated successfully!", severity: "success" });
            })
            .catch(() => setSnackbar({ open: true, message: "Error updating score", severity: "error" }));
    };

    const handleDeleteMatch = (matchId) => {
        axios
            .delete(`/api/livescore/match/${matchId}`)
            .then(() => {
                setMatches(matches.filter((match) => match.id !== matchId));
                setSnackbar({ open: true, message: "Match deleted successfully!", severity: "success" });
            })
            .catch(() => setSnackbar({ open: true, message: "Error deleting match", severity: "error" }));
    };

    const handleAddMatch = () => {
        axios
            .post("/api/livescore/match", newMatch)
            .then((response) => {
                setMatches([...matches, response.data]);
                setNewMatch({ name: "", date: "" });
                setSnackbar({ open: true, message: "Match added successfully!", severity: "success" });
            })
            .catch(() => setSnackbar({ open: true, message: "Error adding match", severity: "error" }));
    };

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4" gutterBottom>
                Scores Page
            </Typography>

            {/* Search Bar */}
            <Autocomplete
                options={matches}
                getOptionLabel={(option) => option.name}
                onChange={(event, value) => {
                    if (value) fetchMatchDetails(value.id);
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Search Matches"
                        placeholder="Select a match"
                        sx={{ marginBottom: 3 }}
                    />
                )}
            />

            <Grid container spacing={3}>
                {/* Matches List */}
                <Grid item xs={12} md={6}>
                    <Typography variant="h5" gutterBottom>
                        Available Matches
                    </Typography>
                    {loading ? (
                        <CircularProgress />
                    ) : (
                        <Grid container spacing={2}>
                            {matches.map((match) => (
                                <Grid item xs={12} key={match.id}>
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Card
                                            onClick={() => fetchMatchDetails(match.id)}
                                            sx={{ cursor: "pointer", backgroundColor: "#f5f5f5" }}
                                        >
                                            <CardContent>
                                                <Typography variant="h6">{match.name}</Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    {match.date}
                                                </Typography>
                                                <Button
                                                    variant="outlined"
                                                    color="error"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteMatch(match.id);
                                                    }}
                                                    sx={{ marginTop: 1 }}
                                                >
                                                    Delete
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Grid>

                {/* Match Details and Score Update */}
                {selectedMatch && (
                    <Grid item xs={12} md={6}>
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Card sx={{ padding: 2 }}>
                                <CardContent>
                                    <Typography variant="h5" gutterBottom>
                                        Match Details
                                    </Typography>
                                    <Typography variant="body1">
                                        <strong>Match:</strong> {selectedMatch.match.name}
                                    </Typography>
                                    <Typography variant="body1">
                                        <strong>Score:</strong> {selectedMatch.scoreTeamA} - {selectedMatch.scoreTeamB}
                                    </Typography>
                                    <Typography variant="body1">
                                        <strong>Status:</strong> {selectedMatch.currentStatus}
                                    </Typography>
                                    <Box sx={{ marginTop: 3 }}>
                                        <Typography variant="h6" gutterBottom>
                                            Update Score
                                        </Typography>
                                        <Grid container spacing={2}>
                                            <Grid item xs={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Team A Score"
                                                    type="number"
                                                    value={updatedScore.scoreTeamA}
                                                    onChange={(e) =>
                                                        setUpdatedScore({ ...updatedScore, scoreTeamA: e.target.value })
                                                    }
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Team B Score"
                                                    type="number"
                                                    value={updatedScore.scoreTeamB}
                                                    onChange={(e) =>
                                                        setUpdatedScore({ ...updatedScore, scoreTeamB: e.target.value })
                                                    }
                                                />
                                            </Grid>
                                        </Grid>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            sx={{ marginTop: 2 }}
                                            onClick={handleScoreUpdate}
                                        >
                                            Update Score
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </Grid>
                )}
            </Grid>

            {/* Add Match */}
            <Box sx={{ marginTop: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Add New Match
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Match Name"
                            value={newMatch.name}
                            onChange={(e) => setNewMatch({ ...newMatch, name: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Match Date"
                            type="date"
                            slotProps={{ inputLabel: { shrink: true } }}
                            value={newMatch.date}
                            onChange={(e) => setNewMatch({ ...newMatch, date: e.target.value })}
                        />
                    </Grid>
                </Grid>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ marginTop: 2 }}
                    onClick={handleAddMatch}
                >
                    Add Match
                </Button>
            </Box>

            {/* Snackbar for Notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ScoresPage;
