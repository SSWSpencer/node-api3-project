const express = require('express');
const User = require("./userDb.js")
const Post = require("../posts/postDb")
const router = express.Router();
router.use(express.json());



router.post('/', validateUser, (req, res) => {
  User.insert(req.body)
  .then(user=>{
    res.status(201).json(user)
  })
  .catch(err=>{
    console.log(err);
    res.status(500).json({error: "could not add new user"})
  })
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  const newPost = {
    text: req.body.text,
    user_id: req.params.id
  }
  Post.insert(newPost)
  .then(post=>{
    res.status(201).json(post);
  })
  .catch(err =>{
    console.log(err)
    res.status(500).json({error: "could not add post"})
  })
});

router.get('/', (req, res) => {
  User.get()
  .then(users =>{
    res.status(200).json(users)
  })
  .catch(err =>{
    res.status(400).json({error: "could not retrieve the users"})
  })
});

router.get('/:id', validateUserId, (req, res) => {
  User.getById(req.params.id)
  .then(user=>{
    res.status(200).json({user})
  })
  .catch(err=>{
    res.status(500).json({error: "could not find the user"})
  })
});

router.get('/:id/posts', validateUserId, (req, res) => {
  User.getUserPosts(req.params.id)
  .then(posts=>{
    res.status(200).json(posts)
  })
  .catch(err=>{
    console.log(err)
    res.status(500).json({error: "could not find the user's posts"})
  })
});

router.delete('/:id', validateUserId, (req, res) => {
  User.remove(req.params.id)
  .then(user =>{
    res.status(200).json(user)
  })
  .catch(err=>{
    console.log(err);
    res.status(500).json({error: "could not delete the user"})
  })
});

router.put('/:id', validateUserId, validateUser, (req, res) => {
  User.update(req.params.id, req.body)
  .then(user=>{
    res.status(200).json(user)
  })
  .catch(err=>{
    console.log(err);
    res.status(500).json({error: "could not update the user information"})
  })
});

//custom middleware

function validateUserId(req, res, next) {
  User.getById(req.params.id)
  .then(user=>{
    if(!user){
      res.status(404).json({error: "the user with the specified id does not exist"})
    }
    else{
      next();
    }
  })
  .catch(err => {
    res.status(500).json({error: "could not find a user with the specified id"})
  })
}

function validateUser(req, res, next){
  if(!req.body){
    res.status(400).json({message: "missing user data"})
  }
  else{
    if(!req.body.name){
      res.status(400).json({message: "missing required name field"})
    }
    else{
      next();
    }
  }
}

function validatePost(req, res, next){
  if(!req.body){
    res.status(400).json({message: "missing post data"})
  }
  else{
    if(!req.body.text){
      res.status(400).json({message: "missing required text field"})
    }
    else{
      next();
    }
  }
}

module.exports = router;
