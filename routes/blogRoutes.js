const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');

const config = require('../config/dev');
const redisCONFIG = config.redisCONFIG;

const Blog = mongoose.model('Blog');

module.exports = app => {
  app.get('/api/blogs/:id', requireLogin, async (req, res) => {
    const blog = await Blog.findOne({
      _user: req.user.id,
      _id: req.params.id
    });

    res.send(blog);
  });

  app.get('/api/blogs', requireLogin, async (req, res) => {
    const redis = require('redis');
    const client = redis.createClient(redisCONFIG);
    const util = require('util');

    // Promisify the 'get' function; returns a promise
    client.get = util.promisify(client.get);
    
    // Has data been cached?
    const cachedBlogs = await client.get(req.user.id);
    
    // If true, return value
    if (cachedBlogs){
      console.log('\n\nSERVING FROM CACHE');
      return res.send(JSON.parse(cachedBlogs));
    }

    // If false, query db and update cache
    const blogs = await Blog.find({ _user: req.user.id });
    console.log('\n\nSERVING FROM MONGO');
    res.send(blogs);
    client.set(req.user.id, JSON.stringify(blogs), 'EX', 60 * 60 * 24);

  });

  app.post('/api/blogs', requireLogin, async (req, res) => {
    const { title, content } = req.body;

    const blog = new Blog({
      title,
      content,
      _user: req.user.id
    });

    try {
      await blog.save();
      res.send(blog);
    } catch (err) {
      res.send(400, err);
    }
  });
};