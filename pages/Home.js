// Home page component with form and output of shortened URLs
import URLForm from "../components/URLForm";
import { useState } from "react";
import { Box, Typography, List, ListItem, Link } from "@mui/material";

const Home = () => {
  const [shortened, setShortened] = useState([]);

  return (
    <Box sx={{ p: 4 }}>
      <URLForm onShortened={setShortened} />
      {shortened.length > 0 && (
        <>
          <Typography variant="h6" sx={{ mt: 3 }}>Shortened URLs</Typography>
          <List>
            {shortened.map(url => (
              <ListItem key={url.code}>
                <Link href={`/${url.code}`}>{`http://localhost:3000/${url.code}`}</Link>
                &nbsp;→&nbsp;{url.longUrl}
              </ListItem>
            ))}
          </List>
        </>
      )}
    </Box>
  );
};

export default Home;
