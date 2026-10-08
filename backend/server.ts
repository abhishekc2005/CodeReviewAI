require("dotenv").config();

import app from "./src/app";
import connectDB from "./src/config/db";

const PORT = Number(process.env.PORT) || 3000;

// Connect MongoDB before starting Express server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
