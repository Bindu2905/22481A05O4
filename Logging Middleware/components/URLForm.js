// Form component to enter long URLs, optional shortcode, and expiry time
import { useState } from "react";
import { TextField, Button, Grid, Typography, Paper } from "@mui/material";
import { isValidUrl, generateShortcode } from "../utils/urlUtils";
import { logEvent } from "../utils/logger";

const URLForm = ({ onShortened }) => {
  const [inputs, setInputs] = useState([{ longUrl: "", validity: "", shortcode: "" }]);

  // Update input fields when user types
  const handleChange = (index, field, value) => {
    const updated = [...inputs];
    updated[index][field] = value;
    setInputs(updated);
  };

  // Add another input field (up to 5 max)
  const addField = () => {
    if (inputs.length < 5) {
      setInputs([...inputs, { longUrl: "", validity: "", shortcode: "" }]);
    }
  };

  // Main function to handle shortening URLs
  const shortenUrls = () => {
    const errors = [];
    const stored = JSON.parse(localStorage.getItem("urls") || "{}");

    const results = inputs.map((input, idx) => {
      const { longUrl, validity, shortcode } = input;

      if (!isValidUrl(longUrl)) {
        errors.push(`URL ${idx + 1} is invalid.`);
        return null;
      }

      const code = shortcode || generateShortcode();
      const isCustom = !!shortcode;

      if (stored[code]) {
        errors.push(`Shortcode ${code} already exists.`);
        return null;
      }

      const validMinutes = parseInt(validity || "30", 10);
      if (isNaN(validMinutes)) {
        errors.push(`Validity for URL ${idx + 1} is not a valid number.`);
        return null;
      }

      const createdAt = new Date();
      const expiresAt = new Date(createdAt.getTime() + validMinutes * 60000);

      const urlData = {
        code,
        longUrl,
        createdAt: createdAt.toISOString(),
        expiresAt: expiresAt.toISOString(),
        clicks: [],
      };

      stored[code] = urlData;

      logEvent("URL_SHORTENED", { code, longUrl, expiresAt: urlData.expiresAt });
      return urlData;
    });

    if (errors.length) {
      alert(errors.join("\n"));
    }

    localStorage.setItem("urls", JSON.stringify(stored));
    onShortened(results.filter(Boolean));
  };

  return (
    <Paper elevation={2} sx={{ padding: 3 }}>
      <Typography variant="h5">Shorten URLs</Typography>
      {inputs.map((input, index) => (
        <Grid container spacing={2} key={index} sx={{ mt: 1 }}>
          <Grid item xs={12} md={5}>
            <TextField
              label="Long URL"
              fullWidth
              value={input.longUrl}
              onChange={(e) => handleChange(index, "longUrl", e.target.value)}
            />
          </Grid>
          <Grid item xs={6} md={2}>
            <TextField
              label="Validity (mins)"
              fullWidth
              value={input.validity}
              onChange={(e) => handleChange(index, "validity", e.target.value)}
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField
              label="Custom Shortcode"
              fullWidth
              value={input.shortcode}
              onChange={(e) => handleChange(index, "shortcode", e.target.value)}
            />
          </Grid>
        </Grid>
      ))}
      <Button onClick={addField} sx={{ mt: 2 }} disabled={inputs.length >= 5}>Add URL</Button>
      <Button onClick={shortenUrls} variant="contained" sx={{ mt: 2, ml: 2 }}>Shorten</Button>
    </Paper>
  );
};

export default URLForm;
