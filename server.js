const express = require("express");
const logger = require("morgan");
const path = require("path");
const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(logger("tiny"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
