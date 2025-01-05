const database = require('./database')


// Sets up clean "database" (map) before each test
beforeEach(() => {
    database.init()
})

test('Entry added to database should be retreivable', () => {
    let testID = "test_ID"
    let testScore = 100
    database.add_score_entry(testID, testScore)
    expect(database.get_score(testID)).toBe(testScore)
})

test('Entry not added to database (bad ID) should throw error', () => {
    let badID = "bad_ID"
    expect(() => database.get_score(badID)).toThrow()
})