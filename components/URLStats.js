// Component to show stats of all shortened URLs and their clicks
import { useEffect, useState } from "react";
import { Typography, Paper, List, ListItem, ListItemText, Divider } from "@mui/material";

const URLStats = () => {
  const [urls, setUrls] = useState([]);

  // Load all URLs from localStorage on component mount
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("urls") || "{}");
    setUrls(Object.values(stored));
  }, []);

  return (
    <Paper elevation={3} sx={{ padding: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>URL Statistics</Typography>
      <List>
        {urls.map(url => (
          <div key={url.code}>
            <ListItem>
              <ListItemText
                primary={`Short: http://localhost:3000/${url.code}`}
                secondary={`Created: ${url.createdAt}, Expires: ${url.expiresAt}, Clicks: ${url.clicks.length}`}
              />
            </ListItem>
            <List sx={{ pl: 4 }}>
              {url.clicks.map((click, idx) => (
                <ListItem key={idx}>
                  <ListItemText
                    primary={`Time: ${click.timestamp}`}
                    secondary={`Source: ${click.source}, Location: ${click.location}`}
                  />
                </ListItem>
              ))}
            </List>
            <Divider />
          </div>
        ))}
      </List>
    </Paper>
  );
};

export default URLStats;