const redis = require('redis');
const express = require('express')


const PORT = process.env.PORT
const REDIS_PORT = process.env.REDIS_PORT

const client = redis.createClient(PORT)

const app = express()

app.listen(PORT, () => {
  console.log(`App is listening on http://localhost:${PORT}`);
})