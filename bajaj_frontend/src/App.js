import React, { useState } from 'react';
import axios from 'axios';

function App() {
  // State management
  const [jsonData, setJsonData] = useState('');
  const [fileBase64, setFileBase64] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [getData, setGetData] = useState(null); // State for GET request data

  // Handle JSON input change
  const handleJsonInput = (e) => {
    setJsonData(e.target.value);
  };

  // Handle file upload and convert to base64
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      setFileBase64(reader.result.split(',')[1]); // Extract base64 string after comma
    };

    if (file) {
      reader.readAsDataURL(file); // Convert file to base64
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const parsedData = JSON.parse(jsonData);

      // Prepare request payload
      const payload = {
        data: parsedData.data || [],
        file_b64: fileBase64 || null
      };

      // Make POST request to the backend API
      const response = await axios.post('http://localhost:3000/bfhl', payload);
      setResponseData(response.data);
      setIsSubmitted(true);
      setErrorMessage('');
    } catch (error) {
      console.error('Error during submission:', error);
      setErrorMessage(`Invalid JSON input: ${error.message}`);
      setIsSubmitted(false);
    }
  };

  // Handle dropdown selection
  const handleMultiSelectChange = (e) => {
    const selectedValues = Array.from(e.target.selectedOptions, (option) => option.value);
    setSelectedOptions(selectedValues);
  };

  // Render API response
  const renderResponse = () => {
    if (!responseData) return null;

    return (
      <div>
        <h3>Response:</h3>
        <p>User ID: {responseData.user_id}</p>
        <p>Email: {responseData.email}</p>
        <p>Roll Number: {responseData.roll_number}</p>
        <p>Numbers: {responseData.numbers.join(', ')}</p>
        <p>Alphabets: {responseData.alphabets.join(', ')}</p>
        <p>Highest Lowercase Alphabet: {responseData.highest_lowercase_alphabet.join(', ')}</p>
        <p>File Valid: {responseData.file_valid ? 'Yes' : 'No'}</p>
        {responseData.file_valid && (
          <>
            <p>File MIME Type: {responseData.file_mime_type}</p>
            <p>File Size (KB): {responseData.file_size_kb.toFixed(2)} KB</p>
          </>
        )}
      </div>
    );
  };

  // Render selected data based on dropdown options
  const renderSelectedData = () => {
    if (!responseData) return null;

    return (
      <div>
        <h3>Selected Data</h3>
        {selectedOptions.includes("Alphabets") && (
          <p>Alphabets: {responseData.alphabets.join(', ')}</p>
        )}
        {selectedOptions.includes("Numbers") && (
          <p>Numbers: {responseData.numbers.join(', ')}</p>
        )}
        {selectedOptions.includes("Highest Lowercase Alphabet") && (
          <p>Highest Lowercase Alphabet: {responseData.highest_lowercase_alphabet.join(', ')}</p>
        )}
      </div>
    );
  };

  // Handle GET request to /bfhl
  const handleGetRequest = async () => {
    try {
      const response = await axios.get('http://localhost:3000/bfhl'); // GET request to /bfhl
      setGetData(response.data); // Set the GET response data
    } catch (error) {
      console.error('Error during GET request:', error);
      setGetData(null); // Reset on error
    }
  };

  // Render GET request data
  const renderGetData = () => {
    if (!getData) return null;

    return (
      <div>
        <h3>GET Request Data:</h3>
        <pre>{JSON.stringify(getData, null, 2)}</pre>
      </div>
    );
  };

  return (
    <div className="App">
      <h1>JSON Input and File Upload Form</h1>

      {/* JSON Input */}
      <textarea
        rows="5"
        cols="50"
        placeholder='Enter JSON (e.g. { "data": ["A", "1", "b", "2"] })'
        value={jsonData}
        onChange={handleJsonInput}
      />
      <br />

      {/* File Upload */}
      <input type="file" onChange={handleFileChange} />
      <br />

      {/* Submit Button */}
      <button onClick={handleSubmit}>Submit</button>

      {/* Error message display */}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      {/* Render the API response */}
      {renderResponse()}

      {/* Multi-Select Dropdown (Appears after valid JSON submission) */}
      {isSubmitted && (
        <div>
          <h3>Select Options</h3>
          <select multiple={true} onChange={handleMultiSelectChange}>
            <option value="Alphabets">Alphabets</option>
            <option value="Numbers">Numbers</option>
            <option value="Highest Lowercase Alphabet">Highest Lowercase Alphabet</option>
          </select>
        </div>
      )}

      {/* Show selected options data */}
      {selectedOptions.length > 0 && renderSelectedData()}

      {/* Button for GET request */}
      <button onClick={handleGetRequest}>Get Data</button>

      {/* Render GET request data */}
      {renderGetData()}
    </div>
  );
}

export default App;
