const express = require('express')
var morgan = require('morgan')
const app = express()

app.use(express.json())
app.use(express.static('dist'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    },
    { 
      "id": "5",
      "name": "Kunal Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get("/api/persons", (request, response) => {
    response.json(persons)
})

app.get("/info", (request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/plain' })
    response.end(`Phonebook has info for ${persons.length} people`)
})

app.get("/api/persons/:id", (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete("/api/persons/:id", (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.post("/api/persons", (request, response) => {
    const person = request.body
    console.log(person);

    if (!person.name || !person.number) {
        const errorResponse = {
            "error": "Name and number are mandatory"
        }
        response.status(400).json(errorResponse)
    }
    const existingPerson = persons.find(exist => exist.name === person.name)
    if (existingPerson) {
        const errorResponse = {
            "error": "name must be unique"
        }
        response.status(400).json(errorResponse)
    }

    person.id = getRandomIntInclusive(6, 100)
    persons = persons.concat(person)

    response.json(person)
})

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min); // Ensure min is an integer
  max = Math.floor(max); // Ensure max is an integer
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})