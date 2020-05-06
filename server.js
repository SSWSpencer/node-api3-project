const express = require('express');
const postRouter = require("./posts/postRouter.js")
const userRouter = require("./users/userRouter.js")
const server = express();




server.use("/", logger)
server.use("/api/posts", postRouter)
server.use("/api/users", userRouter)


server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});


//custom middleware


function logger(req, res, next) {
  const today = new Date().toISOString();
  console.log(`[${today}], ${req.method}, to ${req.url}`)
  next()
}

function validateUserId(userId){
  User.getById(userId)
  .then(userInfo => {
    return function(req, res, next){
      req.user = userInfo;
      next();
    }
  })
  .catch(err=> {
    console.log(err)
    res.status(400).json({message: "invalid user id"})
  })
}



module.exports = server;
