// The crux of our app. The processor
// Takes a receipt and scores it


// String clean-up function
function remove_non_alphanumeric_characters(input) {
    return input.replace(/[^a-zA-Z0-9]/g, '')
}

// +1 point for every alphanumeric character in the retailer name
function score_retailer(retailer) {
    return remove_non_alphanumeric_characters(retailer).length
}

// +50 points if the total is a round dollar amound with no cents
// +25 points if the total is a multiple of 0.25
function score_total(total) {
    let score = 0
    if (Math.round(total) == total) score += 50
    if (Math.round(total * 100.00) % 25 == 0) score += 25
    return score
}

// +2 points for every 2 items on the receipt
// If the trimmed length of the item descriptions is a mutliple of 3
// multiply the price by 0.2 and round up to the nearest integer for points
function score_items(items) {
    let score = 0
    if (Array.isArray(items)) {
        score += Math.trunc(items.length / 2.0) * 5

        for (item of items) {
            if (!item.shortDescription) throw new Error('No item description found for 1 or more items')
            if (!item.price) throw new Error('No price found for 1 or more items')
            if (item.shortDescription.length && item.shortDescription.trim().length % 3 == 0) {
                score += Math.ceil(item.price * 0.2)
            }
        }
    }
    return score
}

// +6 points if the day in the purchase is odd
function score_date(purchaseDate) {
    let date = new Date(purchaseDate)
    if (date.getUTCDate() % 2 == 1) return 6
    return 0
}

// 10 points if the time of purchase is after 2:00pm and before 4:00pm
function score_time(purchaseTime) {
    // Helper vars
    const DATE_PLACEHOLDER = '2024-12-19'
    const TWO_PM = new Date(DATE_PLACEHOLDER + ' ' + '14:00')
    const FOUR_PM = new Date(DATE_PLACEHOLDER + ' ' + '16:00')

    let time = new Date(DATE_PLACEHOLDER + ' ' + purchaseTime)
    if (time > TWO_PM && time < FOUR_PM) return 10
    return 0
}




module.exports = {
    process_receipt : (receipt) => {
        let score = 0

        if (!receipt.retailer) throw new Error('No retailer found')
        score += score_retailer(receipt.retailer)
    
        if (!receipt.total) throw new Error ('No total found')
        score += score_total(receipt.total)
        
        if (!receipt.items) throw new Error('No items found')
        score += score_items(receipt.items)

        if (!receipt.purchaseDate) throw new Error('No purchase date found')
        score += score_date(receipt.purchaseDate)

        if (!receipt.purchaseTime) throw new Error('No purchase time found')
        score += score_time(receipt.purchaseTime)
    
        return score
    }
}