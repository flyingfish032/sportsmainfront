import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Grid,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Snackbar,
    Alert,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Avatar,
    CardHeader,
} from "@mui/material";
import { motion } from "framer-motion";

const PlayersPage = () => {
    const [players, setPlayers] = useState([]);
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [currentPlayer, setCurrentPlayer] = useState({
        name: "",
        age: "",
        position: "",
        team: 0,
        avatar: "",
    });
    const [isEditing, setIsEditing] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const fetchPlayers = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/players`);
            setPlayers(response.data);
            setLoading(false);
        } catch (err) {
            setError("Failed to fetch players");
            setLoading(false);
        }
    };

    const fetchTeams = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/teams`);
            setTeams(response.data);
        } catch (err) {
            setError("Failed to fetch teams");
        }
    };

    useEffect(() => {
        fetchPlayers();
        fetchTeams();
    }, []);

    const handleOpenDialog = (
        player = { name: "", age: "", position: "", team: "", avatar: "" }
    ) => {
        setCurrentPlayer(player);
        setIsEditing(!!player.id);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCurrentPlayer({ name: "", age: "", position: "", team: "", avatar: "" });
    };

    const handleSavePlayer = async () => {
        const playerToSave = {
            ...currentPlayer,
            team: currentPlayer.team ? { id: currentPlayer.team } : null,
        };

        try {
            if (isEditing) {
                await axios.put(
                    `http://localhost:8080/api/players/${currentPlayer.id}`,
                    playerToSave
                );
                setSuccessMessage("Player updated successfully!");
            } else {
                await axios.post(`http://localhost:8080/api/players`, playerToSave);
                setSuccessMessage("Player added successfully!");
            }
            fetchPlayers();
            handleCloseDialog();
        } catch (err) {
            setError("Failed to save player");
        }
    };

    const handleDeletePlayer = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/players/${id}`);
            setSuccessMessage("Player deleted successfully!");
            fetchPlayers();
        } catch (err) {
            setError("Failed to delete player");
        }
    };

    const handleCloseSnackbar = () => {
        setSuccessMessage("");
    };

    if (loading) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                }}
            >
                <CircularProgress />
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ textAlign: "center", marginTop: "20px", color: "red" }}>
                {error}
            </div>
        );
    }

    return (
        <div style={{ padding: "20px" }}>
            <Typography variant="h4" align="center" gutterBottom>
                Players Management
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={() => handleOpenDialog()}
            >
                Add Player
            </Button>
            <Grid container spacing={3} style={{ marginTop: "20px" }}>
                {players.map((player) => (
                    <Grid item xs={12} sm={6} md={4} key={player.id}>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <Card
                                style={{
                                    borderRadius: "15px",
                                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                                }}
                            >
                                <CardHeader
                                    avatar={
                                        <Avatar
                                        src={player.avatar || "150https://via.placeholder.com/"} // Default avatar URL
                                        alt={player.name}
                                    />
                                    }
                                    title={player.name || "Unknown Player"}
                                    subheader={`Team: ${player.team?.name || "No Team"}`}
                                />
                                <CardContent>
                                    <Typography variant="body2" color="textSecondary">
                                        Age: {player.age || "N/A"}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Position: {player.position || "Unknown"}
                                    </Typography>
                                    <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            onClick={() => handleOpenDialog(player)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            onClick={() => handleDeletePlayer(player.id)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </Grid>
                ))}
            </Grid>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{isEditing ? "Edit Player" : "Add Player"}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Name"
                        fullWidth
                        margin="normal"
                        value={currentPlayer.name}
                        onChange={(e) =>
                            setCurrentPlayer({ ...currentPlayer, name: e.target.value })
                        }
                    />
                    <TextField
                        label="Age"
                        fullWidth
                        margin="normal"
                        type="number"
                        value={currentPlayer.age}
                        onChange={(e) =>
                            setCurrentPlayer({ ...currentPlayer, age: e.target.value })
                        }
                    />
                    <TextField
                        label="Position"
                        fullWidth
                        margin="normal"
                        value={currentPlayer.position}
                        onChange={(e) =>
                            setCurrentPlayer({ ...currentPlayer, position: e.target.value })
                        }
                    />
                    <TextField
                        label="Avatar URL"
                        fullWidth
                        margin="normal"
                        value={currentPlayer.avatar}
                        onChange={(e) =>
                            setCurrentPlayer({ ...currentPlayer, avatar: e.target.value })
                        }
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="team-select-label">Team</InputLabel>
                        <Select
                            labelId="team-select-label"
                            value={currentPlayer.team}
                            onChange={(e) =>
                                setCurrentPlayer({ ...currentPlayer, team: e.target.value })
                            }
                        >
                            {teams.map((team) => (
                                <MenuItem key={team.id} value={team.id}>
                                    {team.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSavePlayer} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={!!successMessage}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity="success"
                    sx={{ width: "100%" }}
                >
                    {successMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default PlayersPage;
