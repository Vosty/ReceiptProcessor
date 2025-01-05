const processor = require('./processor')

let dummyReceipt


// Create a dummy receipt that throws no errors
// But is worth zero points
beforeEach(() => {
    dummyReceipt = {
        retailer : "!!!!!",
        total : 0.1,
        items : [],
        purchaseDate : '2024-12-20',
        purchaseTime : '12:00'
    }
})

function makeDummyItem() {
    let item = {
        shortDescription : "!",
        price : 1.0
    }
    return item
}

test('Verify dummy is worth zero points', () => {
    expect(processor.process_receipt(dummyReceipt)).toBe(0)
})

test('1 point for every alpha-num char in retail name', () => {
    dummyReceipt.retailer = "FOUR"
    expect(processor.process_receipt(dummyReceipt)).toBe(4)
})

test('25 points when total is multiple of .25', () => {
    dummyReceipt.total = .75
    expect(processor.process_receipt(dummyReceipt)).toBe(25)
})

test('50 (+25) points when total is round dollar amount', () => {
    dummyReceipt.total = 5.00
    expect(processor.process_receipt(dummyReceipt)).toBe(75)
})

test('50 (+25) points when total is round dollar amount', () => {
    dummyReceipt.total = 5.00
    expect(processor.process_receipt(dummyReceipt)).toBe(75)
})

test('5 points for every 2 items', () => {
    for (let i = 0; i < 4; i++){
        dummyReceipt.items.push(makeDummyItem())
    }
    expect(processor.process_receipt(dummyReceipt)).toBe(10)
})

test('item price times 0.2 points (rounded up) when desc. length is multiple of 3', () => {
    let item = makeDummyItem()
    item.shortDescription = "123"
    item.price = 9.0
    dummyReceipt.items.push(item)
    expect(processor.process_receipt(dummyReceipt)).toBe(2)
})

test('6 points if purchase date is odd', () => {
    dummyReceipt.purchaseDate = '2024-12-19'
    expect(processor.process_receipt(dummyReceipt)).toBe(6)
})

test('10 points if purchase date between 2-4pm', () => {
    dummyReceipt.purchaseTime = '15:00'
    expect(processor.process_receipt(dummyReceipt)).toBe(10)
})

test('no retailer throws error', () => {
    dummyReceipt.retailer = null
    expect(() => processor.process_receipt(dummyReceipt)).toThrow()
})

test('no total throws error', () => {
    dummyReceipt.total = null
    expect(() => processor.process_receipt(dummyReceipt)).toThrow()
})

test('no items throws error', () => {
    dummyReceipt.items = null
    expect(() => processor.process_receipt(dummyReceipt)).toThrow()
})

test('no item description throws error', () => {
    let item = makeDummyItem()
    item.shortDescription = null
    dummyReceipt.items.push(item)
    expect(() => processor.process_receipt(dummyReceipt)).toThrow()
})

test('no item price throws error', () => {
    let item = makeDummyItem()
    item.price = null
    dummyReceipt.items.push(item)
    expect(() => processor.process_receipt(dummyReceipt)).toThrow()
})

test('no purchase date throws error', () => {
    dummyReceipt.purchaseDate = null
    expect(() => processor.process_receipt(dummyReceipt)).toThrow()
})

test('no purchase time throws error', () => {
    dummyReceipt.purchaseTime = null
    expect(() => processor.process_receipt(dummyReceipt)).toThrow()
})

test('demo item 1', () => {
    let demoItem = {
        "retailer": "Target",
        "purchaseDate": "2022-01-01",
        "purchaseTime": "13:01",
        "items": [
          {
            "shortDescription": "Mountain Dew 12PK",
            "price": "6.49"
          },{
            "shortDescription": "Emils Cheese Pizza",
            "price": "12.25"
          },{
            "shortDescription": "Knorr Creamy Chicken",
            "price": "1.26"
          },{
            "shortDescription": "Doritos Nacho Cheese",
            "price": "3.35"
          },{
            "shortDescription": "   Klarbrunn 12-PK 12 FL OZ  ",
            "price": "12.00"
          }
        ],
        "total": "35.35"
      }
    expect(processor.process_receipt(demoItem)).toBe(28)
})

test('demo item 2', () => {
    let demoItem = {
        "retailer": "M&M Corner Market",
        "purchaseDate": "2022-03-20",
        "purchaseTime": "14:33",
        "items": [
          {
            "shortDescription": "Gatorade",
            "price": "2.25"
          },{
            "shortDescription": "Gatorade",
            "price": "2.25"
          },{
            "shortDescription": "Gatorade",
            "price": "2.25"
          },{
            "shortDescription": "Gatorade",
            "price": "2.25"
          }
        ],
        "total": "9.00"
      }
    expect(processor.process_receipt(demoItem)).toBe(109)
})