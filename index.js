import redis from 'redis'
import express from 'express'
import fetch from 'node-fetch'
import dotenv from 'dotenv'

dotenv.config()
const PORT = process.env.PORT
const REDIS_PORT = process.env.REDIS_PORT

const client = redis.createClient(REDIS_PORT)

const app = express()

// Set response
function setResponse(useraname, repos) {
  return `<h2>${useraname} has ${repos} Github repos</h2>` 
}

// Make requst to Github for data

async function getRepos(req, res, next) {
  try {
    console.log('Fetching data....');
    const {username} = req.params;
    const response = await fetch(`https://api.github.com/users/${username}`)
    const data = await response.json()

    const repos = data.public_repos;

    //Set data to Redis
    client.setex(username, 3600, repos)
    res.send(setResponse(username, repos));
  } catch (error) {
    console.error(err)
    res.status(500)
  } finally {
    await client.quit();
  }
}

// cache middleware
function cache(req, res, next) {
  const {username} = req.params
  client.get(username, (err, data) => {
    if(err) throw err;

    if(data !== null) {
      res.send(setResponse(username, data))
    }else {
      next()
    }
 })
}

app.get('/repos/:username', cache, getRepos);

app.listen(PORT, () => {
  console.log(`App is listening on http://localhost:${PORT}`);
})