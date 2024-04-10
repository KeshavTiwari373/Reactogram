const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const PostModel = mongoose.model('PostModel');
const protectedRoute = require('../middleware/protectedResource');

// all users posts
router.get("/allposts", (req, res) => {
    PostModel.find()
        .populate("author", "_id fullName profileImg")
        .then((dbPost) => {
            res.status(200).json({ posts: dbPost })
        })
        .catch((error) => {
            console.log(error);
        })
});

// all posts only from loggedIn user
router.get("/myallposts", protectedRoute, (req, res) => {
    PostModel.find({ author: req.user._id })
        .populate("author", "_id fullName profileImg")
        .then((dbPost) => {
            res.status(200).json({ posts: dbPost })
        })
        .catch((error) => {
            console.log(error);
        })
});

router.post("/createpost", protectedRoute, (req, res) => {
    const { description, location, image } = req.body;
    if (!description || !location || !image) {
        return res.status(400).json({ error: "One or more fields are empty" });
    }
    req.user.password = undefined;
    const postObj = new PostModel({ description: description, location: location, image: image, author: req.user });
    postObj.save()
        .then((newPost) => {
            res.status(201).json({ post: newPost });
        })
        .catch((error) => {
            console.log(error);
        })
});

router.delete("/deletepost/:postId", protectedRoute, async (req, res) => {
    try {
        const postFound = await PostModel.findOne({ _id: req.params.postId })
            .populate("author", "_id");

        if (!postFound) {
            return res.status(404).json({ error: "Post not found" }); // Use 404 for not found
        }

        if (postFound.author._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: "Unauthorized to delete post" }); // Unauthorized
        }

        await postFound.deleteOne();
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.put("/like", protectedRoute, async (req, res) => {
    try {
        const updatedPost = await PostModel.findByIdAndUpdate(
            req.body.postId,
            { $push: { likes: req.user._id } },
            { new: true }
        ).populate("author", "_id fullName");

        if (!updatedPost) {
            return res.status(404).json({ error: "Post not found" });
        }

        res.json(updatedPost);
    } catch (error) {
        console.error(error); // Log the error for debugging
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

router.put("/unlike", protectedRoute, async (req, res) => {
    try {
        const updatedPost = await PostModel.findByIdAndUpdate(
            req.body.postId,
            { $pull: { likes: req.user._id } },
            { new: true }
        ).populate("author", "_id fullName");

        if (!updatedPost) {
            return res.status(404).json({ error: "Post not found" });
        }

        res.json(updatedPost);
    } catch (error) {
        console.error(error); // Log the error for debugging
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

router.put("/comment", protectedRoute, async (req, res) => {
    try {
        const comment = { commentText: req.body.commentText, commentedBy: req.user._id };
        const commentPost = await PostModel.findByIdAndUpdate(
            req.body.postId,
            { $push: { comments: comment } },
            { new: true }
        ).populate("comments.commentedBy", "_id fullName") // comment owner
            .populate("author", "_id fullName"); // post owner

        if (!commentPost) {
            return res.status(404).json({ error: "Post not found" });
        }

        res.json(commentPost);
    } catch (error) {
        console.error(error); // Log the error for debugging
        return res.status(500).json({ error: "Internal Server Error" });
    }
});


module.exports = router;