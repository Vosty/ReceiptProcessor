# Fetch Rewards Receipt Processor

Part of application for Fetch Rewards
Follows specifications at https://github.com/fetch-rewards/receipt-processor-challenge

## Running this project

1. Download this repo (run command `gh repo clone Vosty/ReceiptProcessor` in an empty directory)
     
2. Install node.js (https://nodejs.org/en/download). Make sure node exists on your PATH

3. In the terminal of your choice, go to this repo's main folder

4. Use command `node ./index.js`

By default this application will run on your machine at `localhost:3000`. Test with Postman, curl, or other method of your choosing.


## Reviewing the Code

All of the code I wrote for this project is in the file [index.js](https://github.com/Vosty/ReceiptProcessor/blob/main/index.js)

It is written in javascript primarily using node.js for library and runtime support and the libary expressjs for rest API support.

As the API is defined by a schema I didn't do too much input checking/sanitizing beyond a somewhat bare minumum of checking if the required fields exist. However, it should return the correct status codes as well as a short descriptive message of what went wrong with improper data.

The rest of the code should be well explained by the comments.
