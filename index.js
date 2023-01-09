const app = require("./server");

const port = 3001 || 8080
app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})