import React, { useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
    const [inputData, setInputData] = useState('');
    const [responseData, setResponseData] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        let parsedData;
        try {
            parsedData = JSON.parse(inputData); // Ensure it's valid JSON
            if (!Array.isArray(parsedData)) {
                throw new Error("Input must be an array");
            }
        } catch (error) {
            console.error("Invalid JSON format:", error);
            alert("Invalid JSON! Please enter a valid array.");
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/bfhl', { data: parsedData });
            console.log("Response from backend:", response.data); // Debugging line
            setResponseData(response.data);
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to fetch data. Check console for details.");
        }
    };

    const handleSelectChange = (e) => {
        const value = e.target.value;
        setSelectedOptions(prev =>
            prev.includes(value) ? prev.filter(option => option !== value) : [...prev, value]
        );
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>BFHL - Backend For Handling Lists</h1>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={inputData}
                    onChange={(e) => setInputData(e.target.value)}
                    placeholder='Enter JSON array here (e.g., ["A", "B", "1", "2"])'
                    rows="4"
                    style={{ width: '100%', marginBottom: '10px' }}
                />
                <button type='submit'>Submit</button>
            </form>
            <div style={{ margin: '20px 0' }}>
                <label>Select Output to Display:</label>
                <select multiple onChange={handleSelectChange} style={{ width: '100%', marginTop: '10px' }}>
                    <option value="alphabets">Alphabets</option>
                    <option value="numbers">Numbers</option>
                    <option value="highestAlphabet">Highest Alphabet</option>
                </select>
            </div>
            {responseData && (
                <div>
                    <h2>Output:</h2>
                    {selectedOptions.includes("alphabets") && (
                        <div>Alphabets: {responseData.alphabets.join(', ')}</div>
                    )}
                    {selectedOptions.includes("numbers") && (
                        <div>Numbers: {responseData.numbers.join(', ')}</div>
                    )}
                    {selectedOptions.includes("highestAlphabet") && (
                        <div>Highest Alphabet: {responseData.highest_alphabet.join(', ')}</div>
                    )}
                </div>
            )}
        </div>
    );
}

export default App;
