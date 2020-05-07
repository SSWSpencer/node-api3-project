const server = require('./server.js')

const port = process.env.PORT || 4422;

server.listen(port, () => {
    console.log("\n *Server Running on http://localhost:4422 \n")
})