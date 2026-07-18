const app = require("./index");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

console.log(process.env.MONGO_URI);

app.listen(PORT, () => {
  console.log(` Server running locally on http://localhost:${PORT}`);
});
