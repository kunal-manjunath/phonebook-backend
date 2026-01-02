require('dotenv').config()
const express = require('express')
const Person = require('./models/person')
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

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

app.get("/api/persons", (request, response) => {
    Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get("/info", (request, response) => {
  Person.find({}).then(persons => {
    response.writeHead(200, { 'Content-Type': 'text/plain' })
    response.end(`Phonebook has info for ${persons.length} people`)
  })
})

app.get("/api/persons/:id", (request, response, next) => {
    const id = request.params.id
    const person = Person.findById(id).then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete("/api/persons/:id", (request, response) => {
    const id = request.params.id
    Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post("/api/persons", (request, response) => {
    const body = request.body
    console.log(body);

    if (!body.name || !body.number) {
        const errorResponse = {
            "error": "Name and number are mandatory"
        }
        response.status(400).json(errorResponse)
    }
    //TODO: Find a person with existing name
    const person = new Person({
      name: body.name,
      number: body.number,
    })

    person.save().then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => {
      console.log(error._message);
      
      const errorResponse = {
            "error": error._message
        }
      response.status(500).json(errorResponse)
    })
})

app.put("/api/persons/:id", (request,response,next) => {
  const { name, number } = request.body
  
  Person.findById(request.params.id)
  .then(person => {
    if (!person) {
      return response.status(404).end()
    }

    person.number = number

    return person.save().then(updatedPerson => {
      response.json(updatedPerson)
    })
  })
  .catch(error => next(error))
})

app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})