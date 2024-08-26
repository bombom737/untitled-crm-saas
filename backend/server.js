import express from "express";
import path from "path";

const app = express();
const PORT = 3000;

// Serve static files from the 'dist' or equivalent directory where your build files are located
app.use(express.static(path.resolve(__dirname, 'dist')));

// Serve the index.html file for any other route
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

//UNFINISHED REST API CODE!! Need to finish react code first