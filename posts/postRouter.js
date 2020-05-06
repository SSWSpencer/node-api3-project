const express = require('express');

const Post = require("./postDb.js")

const router = express.Router();
router.use(express.json());


router.get('/', (req, res) => {
  Post.get()
    .then(posts => {
      res.status(200).json({posts})
    })
    .catch(err =>{
      console.log(err);
      res.status(400).json({error: "failed to retrieve posts"})
    }
    )
});

router.get('/:id', validatePostId, (req, res) => {
  Post.getById(req.params.id)
  .then(post=>{
    res.status(200).json(post);
  })
  .catch(err => {
    res.status(500).json({error: "could not find a post with the specified id"})
  })
});

router.delete('/:id', validatePostId, (req, res) => {
  Post.remove(req.params.id)
      .then(removed => {
        res.status(200).json({removed})
      })
      .catch(err=>{
        console.log(err)
        res.status(500).json({error: "there was an error removing the post"})
      })
});

router.put('/:id', validatePostId, validatePost, (req, res) => {
  Post.update(req.params.id, req.body)
  .then(post =>{
    res.status(200).json(post)
  })
  .catch(err =>{
    console.log(err);
    res.status(500).json({error: "there was an error updating the post"})
  })
});

// custom middleware

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

function validatePostId(req, res, next) {
  Post.getById(req.params.id)
  .then(post=>{
    if(!post){
      res.status(404).json({error: "the post with the specified id does not exist"})
    }
    else{
      next();
    }
  })
  .catch(err => {
    res.status(500).json({error: "could not find a post with the specified id"})
  })
}

module.exports = router;
