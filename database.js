// Our "database"
// Basically a wrapper for a map
// Imagine if it was more complex though!

var SCORES

module.exports = {

    init : () => {
        SCORES = new Map()
    },

    add_score_entry : (uuid, score) => {
        SCORES.set(uuid, score)
    },

    get_score : (uuid) => {
        if (!SCORES.has(uuid)){
            throw new Error('No score for a receipt with that UUID found')
        }
        return SCORES.get(uuid)
    }
}