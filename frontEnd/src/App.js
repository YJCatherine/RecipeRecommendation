import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, TextField, Typography, List, ListItem, ListItemText, CircularProgress, Grid } from '@mui/material';
import './App.css';  // 引入CSS文件
import foodImage from './mainpageimage.jpg';

function App() {
    const [question, setQuestion] = useState("");
    const [conversation, setConversation] = useState([
        { role: "assistant", content: "Hi there! What would you like to eat today? Here are some yummy categories to choose from:" }
    ]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [topics] = useState([
        "Appetizers",
        "Main Courses",
        "Desserts",
        "Beverages",
        "Salads",
        "Soups"
    ]);
    const [selectedTopic, setSelectedTopic] = useState("");

    useEffect(() => {
        const savedConversation = localStorage.getItem('conversation');
        if (savedConversation) {
            setConversation(JSON.parse(savedConversation));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('conversation', JSON.stringify(conversation));
    }, [conversation]);

    const askQuestion = async () => {
        setLoading(true);
        setError("");
        const newConversation = [...conversation, { role: "user", content: question }];
        setConversation(newConversation);

        try {
            const res = await axios.post(
                "/api/ask",
                { question: question },
                { headers: { "Content-Type": "application/json" } }
            );
            const assistantResponse = res.data.answer;
            setConversation([...newConversation, { role: "assistant", content: assistantResponse }]);
        } catch (error) {
            console.error("Error asking question:", error.response ? error.response.data : error.message);
            setError("Failed to get a response. Please try again.");
        } finally {
            setLoading(false);
            setQuestion(""); // Clear input field after asking
        }
    };

    const handleTopicSelect = async (topic) => {
        setSelectedTopic(topic);
        const responseMessage = `You have selected ${topic}. Looking for delicious recipes...`;
        setConversation([...conversation, { role: "assistant", content: responseMessage }]);

        try {
            const res = await axios.post('/api/recommend', { topic: topic });
            const recommendations = res.data.answer;
            setConversation(prevConversation => [
                ...prevConversation,
                { role: "assistant", content: recommendations }
            ]);
        } catch (error) {
            console.error("Error fetching recommendations:", error.response ? error.response.data : error.message);
            setError("Failed to get recommendations. Please try again.");
        }
    };

    return (
        <div className="App app-wrap-container">
            <div className="app-top-parts">
                <Typography variant="h4" gutterBottom>
                    FoodieBot
                </Typography>
                <img src={foodImage} alt="Delicious food" />
                <List className="showing-list-wrap">
                    {conversation.map((entry, index) => (
                        <ListItem key={index} className={entry.role === "user" ? "user-message" : "assistant-message"}>
                            <ListItemText primary={entry.content} />
                        </ListItem>
                    ))}
                </List>
            </div>
            <div className="app-bottom-parts">
                {selectedTopic === "" && (
                    <Grid container spacing={2} className="topics-grid">
                        {topics.map((topic, index) => (
                            <Grid item xs={10} sm={5} key={index}>
                                <div
                                    className="topic-buttons"
                                    onClick={() => handleTopicSelect(topic)}
                                >
                                    {topic}
                                </div>
                            </Grid>
                        ))}
                    </Grid>
                )}
                <Box display="flex" alignItems="center" mt={2} className="input-box">
                    <TextField
                        className="input-box-body"
                        label="Ask a question..."
                        variant="outlined"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        disabled={loading}
                    />
                    <div
                        className="input-submit-button"
                        onClick={askQuestion}
                        style={{ marginLeft: '16px' }}
                    >
                        {loading ? <CircularProgress size={24} /> : "Ask"}
                    </div>
                </Box>
                {error && <Typography color="error" style={{ marginTop: '16px' }}>{error}</Typography>}
            </div>
        </div>
    );
}

export default App;
