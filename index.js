const express = require('express')

const server = express()

server.use(express.json())

var requestCounter = 0;

server.use((req, res, next) => {
  requestCounter++;

  console.log(`Request counter is at: ${requestCounter}`)
  next()
})

const projects = []

const checkIfProjectExists = (req, res, next) => {
  const index = projects.findIndex(obj => obj.id == req.params.id)

  if (index == -1) {
    res.status(404)
    return res.json({})
  }

  req.body.index = index

  next()
}

server.post('/projects', (req, res) => {
  const {
    id,
    title
  } = req.body

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project)

  res.json(project)
})

server.get('/projects', (req, res) => {
  res.json(projects)
})

server.get('/projects/:id', checkIfProjectExists, (req, res) => {
  const { index } = req.body

  return res.json(projects[index])
})

server.put('/projects/:id', checkIfProjectExists, (req, res) => {
  const { index } = req.body

  projects[index].title = req.body.title

  res.json(projects[index])
})

server.delete('/projects/:id', checkIfProjectExists, (req, res) => {
  const { index } = req.body

  projects.splice(index, 1)

  res.json({})
})

server.post('/projects/:id/tasks', checkIfProjectExists, (req, res) => {
  const { index } = req.body

  projects[index].tasks.push(req.body.title)

  res.json(projects[index])
})

server.listen(8080, () => {
  console.log('Server running at 8080')
})