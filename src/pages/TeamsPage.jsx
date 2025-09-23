import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";

const TeamsPage = () => {
    const [teams, setTeams] = useState([]);
    const [players, setPlayers] = useState([]);
    const [newTeam, setNewTeam] = useState("");
    const [selectedPlayer, setSelectedPlayer] = useState("");
    const [editingIndex, setEditingIndex] = useState(null);
    const [editingName, setEditingName] = useState("");

    useEffect(() => {
        // Fetch teams from the backend
        axios.get("http://localhost:8080/api/teams")
            .then((response) => setTeams(response.data))
            .catch((error) => console.error("Error fetching teams:", error));

        // Fetch players from the backend
        axios.get("http://localhost:8080/api/players")
            .then((response) => setPlayers(response.data))
            .catch((error) => console.error("Error fetching players:", error));
    }, []);

    const isPlayerInTeam = (playerName) => {
        return teams.some((team) =>
            team.players.some((player) => player.name === playerName)
        );
    };

    const addTeam = () => {
        if (!newTeam.trim()) {
            alert("Team name cannot be empty.");
            return;
        }
        if (!selectedPlayer) {
            alert("Please select a player.");
            return;
        }

        if (isPlayerInTeam(selectedPlayer)) {
            const confirm = window.confirm(
                `${selectedPlayer} is already in a team. Do you want to move them to this team?`
            );
            if (!confirm) return;
        }

        const teamData = {
            name: newTeam,
            players: [{ name: selectedPlayer }],
        };

        // Save the team to the backend
        axios.post("http://localhost:8080/api/teams", teamData)
            .then((response) => {
                setTeams([...teams, response.data]);
                setNewTeam("");
                setSelectedPlayer("");
            })
            .catch((error) => console.error("Error adding team:", error));
    };

    const deleteTeam = (id) => {
        // Delete the team from the backend
        axios.delete(`http://localhost:8080/api/teams/${id}`)
            .then(() => {
                setTeams(teams.filter((team) => team.id !== id));
            })
            .catch((error) => console.error("Error deleting team:", error));
    };

    const startEditing = (index) => {
        setEditingIndex(index);
        setEditingName(teams[index].name);
    };

    const saveEdit = () => {
        const updatedTeam = { ...teams[editingIndex], name: editingName };

        // Update the team in the backend
        axios.put(`http://localhost:8080/api/teams/${updatedTeam.id}`, updatedTeam)
            .then((response) => {
                const updatedTeams = [...teams];
                updatedTeams[editingIndex] = response.data;
                setTeams(updatedTeams);
                setEditingIndex(null);
                setEditingName("");
            })
            .catch((error) => console.error("Error updating team:", error));
    };

    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h1 style={{ textAlign: "center" }}>Teams Management</h1>
            <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
                <input
                    type="text"
                    placeholder="Enter team name"
                    value={newTeam}
                    onChange={(e) => setNewTeam(e.target.value)}
                    style={{
                        padding: "10px",
                        borderRadius: "5px",
                        border: "1px solid #ccc",
                        flex: 1,
                    }}
                />
                <select
                    value={selectedPlayer}
                    onChange={(e) => setSelectedPlayer(e.target.value)}
                    style={{
                        padding: "10px",
                        borderRadius: "5px",
                        border: "1px solid #ccc",
                        flex: 1,
                    }}
                >
                    <option value="">Select a player</option>
                    {players.map((player) => (
                        <option key={player.id} value={player.name}>
                            {player.name}
                        </option>
                    ))}
                </select>
                <button
                    onClick={addTeam}
                    style={{
                        padding: "10px 20px",
                        backgroundColor: "#007bff",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                    }}
                >
                    Add Team
                </button>
            </div>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                {teams.length === 0 ? (
                    <p style={{ textAlign: "center", color: "#888" }}>No teams added yet.</p>
                ) : (
                    <ul style={{ listStyle: "none", padding: 0 }}>
                        {teams.map((team, index) => (
                            <motion.li
                                key={team.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    padding: "10px",
                                    marginBottom: "10px",
                                    backgroundColor: "#f9f9f9",
                                    borderRadius: "5px",
                                    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                                }}
                            >
                                {editingIndex === index ? (
                                    <input
                                        type="text"
                                        value={editingName}
                                        onChange={(e) => setEditingName(e.target.value)}
                                        style={{
                                            flex: 1,
                                            padding: "5px",
                                            marginRight: "10px",
                                            border: "1px solid #ccc",
                                            borderRadius: "5px",
                                        }}
                                    />
                                ) : (
                                    <span>{team.name}</span>
                                )}
                                <div style={{ display: "flex", gap: "10px" }}>
                                    {editingIndex === index ? (
                                        <button
                                            onClick={saveEdit}
                                            style={{
                                                padding: "5px 10px",
                                                backgroundColor: "#28a745",
                                                color: "#fff",
                                                border: "none",
                                                borderRadius: "5px",
                                                cursor: "pointer",
                                            }}
                                        >
                                            Save
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => startEditing(index)}
                                            style={{
                                                background: "none",
                                                border: "none",
                                                cursor: "pointer",
                                                color: "#007bff",
                                            }}
                                        >
                                            <FaEdit />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => deleteTeam(team.id)}
                                        style={{
                                            background: "none",
                                            border: "none",
                                            cursor: "pointer",
                                            color: "#dc3545",
                                        }}
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </motion.li>
                        ))}
                    </ul>
                )}
            </motion.div>
        </div>
    );
};

export default TeamsPage;
