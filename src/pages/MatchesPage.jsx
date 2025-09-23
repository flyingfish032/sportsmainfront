import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Button,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import { motion } from "framer-motion";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const MatchesPage = () => {
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [players, setPlayers] = useState([]);
  const [teamA, setTeamA] = useState([]);
  const [teamB, setTeamB] = useState([]);
  const [teamAName, setTeamAName] = useState("");
  const [teamBName, setTeamBName] = useState("");
  const [newMatch, setNewMatch] = useState({
    title: "",
    matchDate: "",
    venue: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchMatches();
    fetchTeams();
    fetchPlayers();
  }, []);

  const fetchMatches = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/matches");
      setMatches(response.data);
    } catch (error) {
      console.error("Error fetching matches:", error);
    }
  };

  const fetchTeams = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/teams");
      setTeams(response.data);
    } catch (error) {
      console.error("Error fetching teams:", error);
    }
  };

  const fetchPlayers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/players");
      setPlayers(response.data);
    } catch (error) {
      console.error("Error fetching players:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMatch({ ...newMatch, [name]: value });
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceList =
      source.droppableId === "players"
        ? [...players]
        : source.droppableId === "teamA"
        ? [...teamA]
        : [...teamB];

    const destinationList =
      destination.droppableId === "players"
        ? [...players]
        : destination.droppableId === "teamA"
        ? [...teamA]
        : [...teamB];

    const [movedItem] = sourceList.splice(source.index, 1);
    destinationList.splice(destination.index, 0, movedItem);

    if (source.droppableId === "players") setPlayers(sourceList);
    if (source.droppableId === "teamA") setTeamA(sourceList);
    if (source.droppableId === "teamB") setTeamB(sourceList);

    if (destination.droppableId === "players") setPlayers(destinationList);
    if (destination.droppableId === "teamA") setTeamA(destinationList);
    if (destination.droppableId === "teamB") setTeamB(destinationList);
  };

  const createMatch = async () => {
    if (teamA.length < 11 || teamB.length < 11) {
      alert("Both teams must have at least 11 players.");
      return;
    }

    try {
      await axios.post("http://localhost:8080/api/matches", {
        title: newMatch.title,
        matchDate: newMatch.matchDate,
        venue: newMatch.venue,
        teamAId: newMatch.teamA,
        teamBId: teamBName,
        teamAPlayers: teamA.map((player) => player.id),
        teamBPlayers: teamB.map((player) => player.id),
      });
      fetchMatches();
      setNewMatch({ title: "", matchDate: "", venue: "" });
      setTeamA([]);
      setTeamB([]);
    } catch (error) {
      console.error("Error creating match:", error);
    }
  };

  const handleMatchClick = (matchId) => {
    navigate(`/score/${matchId}`);
  };

  return (
    <Box sx={{ padding: 4 }}>
      {/* Existing Matches */}
      <Box sx={{ marginBottom: 4 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: "bold", color: "#1976d2" }}
        >
          Existing Matches
        </Typography>
        <Grid container spacing={3}>
          {matches.map((match) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={match.id}
              component={motion.div}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                sx={{
                  boxShadow: 4,
                  borderRadius: 3,
                  overflow: "hidden",
                  cursor: "pointer",
                  "&:hover": { boxShadow: 8, transform: "scale(1.02)" },
                  transition: "transform 0.3s ease",
                }}
                onClick={() => handleMatchClick(match.id)}
              >
                <CardContent
                  sx={{
                    backgroundColor: "#e3f2fd",
                    textAlign: "center",
                    padding: 3,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", color: "#0d47a1" }}
                  >
                    {match.teamAName || "Team A"} vs{" "}
                    {match.teamBName || "Team B"}
                  </Typography>
                
                </CardContent>
                <CardActions
                  sx={{
                    justifyContent: "center",
                    backgroundColor: "#bbdefb",
                    padding: 1,
                  }}
                >
                  <Typography variant="body2" color="textSecondary">
                  Venue: {match.venue || "TBD"}
                  </Typography>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Create New Match */}
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{
          marginBottom: 4,
          padding: 4,
          border: "1px solid #ccc",
          borderRadius: 3,
          boxShadow: 4,
          backgroundColor: "#f9f9f9",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: "bold", color: "#1976d2" }}
        >
          Create New Match
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <input
              type="text"
              placeholder="Match Title"
              name="title"
              value={newMatch.title}
              onChange={handleInputChange}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                marginBottom: "16px",
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <input
              type="date"
              name="matchDate"
              value={newMatch.matchDate}
              onChange={handleInputChange}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                marginBottom: "16px",
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <input
              type="text"
              placeholder="Venue"
              name="venue"
              value={newMatch.venue}
              onChange={handleInputChange}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                marginBottom: "16px",
              }}
            />
          </Grid>
        </Grid>

        <DragDropContext onDragEnd={onDragEnd}>
          <Grid container spacing={3}>
            {/* Players Pool */}
            <Grid item xs={12} sm={4}>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", color: "#1976d2" }}
              >
                Available Players
              </Typography>
              <Droppable droppableId="players">
                {(provided) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    sx={{
                      padding: 2,
                      minHeight: 300,
                      border: "1px solid #ccc",
                      borderRadius: 2,
                      backgroundColor: "#f5f5f5",
                    }}
                  >
                    {players.map((player, index) => (
                      <Draggable
                        key={player.id}
                        draggableId={player.id.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <Box
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            sx={{
                              padding: 1,
                              marginBottom: 1,
                              backgroundColor: "#ffffff",
                              borderRadius: 1,
                              boxShadow: 2,
                              textAlign: "center",
                            }}
                          >
                            {player.name}
                          </Box>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </Grid>

            {/* Team A */}
            <Grid item xs={12} sm={4}>
              <select
                value={teamAName}
                onChange={(e) => setTeamAName(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  marginBottom: "16px",
                }}
              >
                <option value="" disabled>
                  Select Team A
                </option>
                {teams.map((team) => (
                  <option key={team.id} value={team.name}>
                    {team.name}
                  </option>
                ))}
              </select>
              <Droppable droppableId="teamA">
                {(provided) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    sx={{
                      padding: 2,
                      minHeight: 300,
                      border: "1px solid #ccc",
                      borderRadius: 2,
                      backgroundColor: "#e3f2fd",
                    }}
                  >
                    {teamA.map((player, index) => (
                      <Draggable
                        key={player.id}
                        draggableId={player.id.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <Box
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            sx={{
                              padding: 1,
                              marginBottom: 1,
                              backgroundColor: "#bbdefb",
                              borderRadius: 1,
                              boxShadow: 2,
                              textAlign: "center",
                            }}
                          >
                            {player.name}
                          </Box>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </Grid>

            {/* Team B */}
            <Grid item xs={12} sm={4}>
              <select
                value={teamBName}
                onChange={(e) => setTeamBName(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  marginBottom: "16px",
                }}
              >
                <option value="" disabled>
                  Select Team B
                </option>
                {teams.map((team) => (
                  <option key={team.id} value={team.name}>
                    {team.name}
                  </option>
                ))}
              </select>
              <Droppable droppableId="teamB">
                {(provided) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    sx={{
                      padding: 2,
                      minHeight: 300,
                      border: "1px solid #ccc",
                      borderRadius: 2,
                      backgroundColor: "#fff8e1",
                    }}
                  >
                    {teamB.map((player, index) => (
                      <Draggable
                        key={player.id}
                        draggableId={player.id.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <Box
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            sx={{
                              padding: 1,
                              marginBottom: 1,
                              backgroundColor: "#ffe082",
                              borderRadius: 1,
                              boxShadow: 2,
                              textAlign: "center",
                            }}
                          >
                            {player.name}
                          </Box>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </Grid>
          </Grid>
        </DragDropContext>

        <Button
          onClick={createMatch}
          disabled={teamA.length < 11 || teamB.length < 11}
          sx={{
            marginTop: 3,
            padding: "10px 20px",
            borderRadius: "8px",
            backgroundColor: "#1976d2",
            color: "#fff",
            "&:hover": { backgroundColor: "#1565c0" },
          }}
          variant="contained"
        >
          Create Match
        </Button>
      </Box>
    </Box>
  );
};

export default MatchesPage;