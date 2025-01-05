// Fetch Rewards Receipt Processor

// Libraries
const EXPRESS = require('express')
const UUID = require('uuid')

// Other Files
const database = require('./database')
const processor = require('./processor')

// Our REST Application
const APP = EXPRESS()

// Constants
const PORT = process.env.PORT || 3000


// Helper Functions

// Wrapper function for storing our score to our 'database'
function store_score(uuid, score) {
    database.add_score_entry(uuid, score)
}

// Wrapper function for getting our score from our 'database'
function retrieve_score(uuid) {
    // Throws error if no score found
    return database.get_score(uuid)
}






// PROGRAM EXECUTION STARTS HERE
database.init()
APP.use(EXPRESS.json())

// Start our server at localhost:{PORT} (default is 3000)
APP.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})

// --API Functions--

// Endpoint for receiving receipts.
// Grades them, and returns a UUID after the scoring is complete
APP.post('/receipts/process', (request, response) => {
    let score, uuid
    try {
        score = processor.process_receipt(request.body)

        uuid = UUID.v4()
        store_score(uuid, score)
    
        let json = { "id": uuid }
        response.json(json)

    } catch (err) {
        console.error(err)
        response.status(400).send("The receipt is invalid.")
    }
})


// Endpoint for retreiving scores for the user
APP.get('/receipts/:id/points', (request, response) => {
    let uuid = request.params.id
    try {
        let score = retrieve_score(uuid)
        let json = { "points": score}
        response.json(json)
    } catch (err) {
        console.error(err)
        response.status(404).send("No receipt found for that ID.")
    }
})