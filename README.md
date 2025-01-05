# Fetch Rewards Receipt Processor

Part of application for Fetch Rewards
Follows specifications at https://github.com/fetch-rewards/receipt-processor-challenge

## Running this project
1. Download this repo (run command `gh repo clone Vosty/ReceiptProcessor` in an empty directory)

2. Navigate to the repo in your terminal

3. Build the Docker file
```sh
docker build -t receipt-processor .
```

4. Run the Docker file

```sh
docker run -p 3000:3000 receipt-processor
```

By default this application will run on your machine at `localhost:3000`. Test with Postman, curl, or other method of your choosing.


## Reviewing the Code

The main entry point into this project is the file [index.js](https://github.com/Vosty/ReceiptProcessor/blob/main/index.js)

The other main files of interest are [database.js](https://github.com/Vosty/ReceiptProcessor/blob/main/database.js) and [processor.js](https://github.com/Vosty/ReceiptProcessor/blob/main/processor.js). These files have included unit tests (Jest) for your perusing
.
It is written in javascript primarily using node.js for library and runtime support and the libary expressjs for rest API support.

As the API is defined by a schema I didn't do too much input checking/sanitizing beyond a somewhat bare minumum of checking if the required fields exist. However, it should return the correct status codes as well as a short descriptive message of what went wrong with improper data.

The rest of the code should be well explained by the comments.

If you have node installed, you can also run the included unit tests.
Run
```sh
npm test
```
