// Fetch Rewards Receipt Processor

// Libraries
const EXPRESS = require('express')
const UUID = require('uuid')
const APP = EXPRESS()

// Some Constants
const PORT = process.env.PORT || 3000

const DATE_PLACEHOLDER = '2024-01-19'
const TWO_PM = new Date(DATE_PLACEHOLDER + ' ' + '14:00')
const FOUR_PM = new Date(DATE_PLACEHOLDER + ' ' + '16:00')


// The map where we will store our scores
const SCORE_MAP = new Map()




// String clean-up function
function remove_non_alphanumeric_characters(input) {
    return input.replace(/[^a-zA-Z0-9]/g, '')
}

// Function which scores our receipt based on the
// rules dictated in 
// https://github.com/fetch-rewards/receipt-processor-challenge?tab=readme-ov-file
function score_receipt(receipt) {
    let score = 0

    // One point for every alphanumeric character in the retailer name
    if (!receipt.retailer) throw new Error('No retailer found')
    score += remove_non_alphanumeric_characters(receipt.retailer).length

    // 50 points if the total is a round dollar amound with no cents
    if (!receipt.total) throw new Error ('No total found')
    if (Math.round(receipt.total) == receipt.total) score += 50

    // 25 points if the total is a multiple of 0.25
    if (Math.round(receipt.total * 100.00) % 25 == 0) score += 25

    // 2 points for every 2 items on the receipt
    if (!receipt.items) throw new Error('No items found')
    if (Array.isArray(receipt.items)) {
        score += Math.trunc(receipt.items.length / 2.0) * 5

        // If the trimmed length of the item descriptions is a mutliple of 3
        // multiply the price by 0.2 and round up to the nearest integer for points
        for (item of receipt.items) {
            if (!item.shortDescription) throw new Error('No item description found for 1 or more items')
            if (!item.price) throw new Error('No price found for 1 or more items')
            if (item.shortDescription.length && item.shortDescription.trim().length % 3 == 0) {
                score += Math.ceil(item.price * 0.2)
            }
        }
    }

    // 6 points if the day in the purchase is odd
    if (!receipt.purchaseDate) throw new Error('No purchase date found')
    let date = new Date(receipt.purchaseDate)
    if (date.getUTCDate() % 2 == 1) score += 6


    // 10 points if the time of purchase is after 2:00pm and before 4:00pm
    if (!receipt.purchaseTime) throw new Error('No purchase time found')
    let time = new Date(DATE_PLACEHOLDER + ' ' + receipt.purchaseTime)
    if (time > TWO_PM && time < FOUR_PM) score += 10

    return score

}

// Function for storing our score to our 'database'
// Basically a wrapper around our map for now
function store_score(uuid, score) {
    SCORE_MAP.set(uuid, score)
}

// Function for getting our score from our 'database'
// Throws error if no score found
function retrieve_score(uuid) {
    let score = SCORE_MAP.get(uuid)
    if (score) {
        return score
    } else {
        throw new Error('No score for a receipt with that UUID found')
    }
}



// --API Functions--

APP.use(EXPRESS.json())

// Start our server at localhost:{PORT} (default is 3000)
APP.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})


// Endpoint for receiving receipts.
// Grades them, and returns a UUID after the scoring is complete
APP.post('/receipts/process', (request, response) => {
    let score, uuid
    try {
        score = score_receipt(request.body)

        uuid = UUID.v4()
        store_score(uuid, score)
    
        let json = { "id": uuid }
        response.json(json)

    } catch (err) {
        console.error(err)
        response.status(400).send(err.message)
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
        response.status(404).send(err.message)
    }
})