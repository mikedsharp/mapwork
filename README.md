# MapWork - A Browser-based 2D Tile Map Edtior

## Installation

1. Clone the repo
2. do an `npm install` (make sure you have node installed, I would advise using the current LTS version of node or later)
3. That's it!

## Run locally

Running locally will allow you to run MapWork as a
server that you can interact with on localhost. running locally also gives you sourcemaps that let you debug the code as it has been written, so you can find issues and add new features more easily.

1. type `npm run dev`
2. go to http://localhost:1234 in you browser (This project favours Brave or Chrome, but as things stand you should be good to run this in browsers as far back as IE10)

## Building

It is also possible to create a production-ready build of MapWork that you can either run locally with a http server of your choice, or you could deploy the artifacts to an S3 bucket or some other form of web hosting.

1. type `npm run build`
2. The project will build and your artifacts will be in the projects `dist` folder

## Testing

This project uses Jest for unit testing, I've dedicated quite a lot of time to adding tests around this project (and commit to continuning to do this as development continues)

### Running tests

Just type `npm run test` to get started, this should run all of the test suites and let know whether everything is working correctly 🛠️

### To write tests

1. locate the source file you wish to write tests for (i.e. the file that contains the functions you want to unit test)
2. make a new file with the same name as the chosen source file, but then add `.test` to the name

- e.g. a test file covering the `mapwork.camera.js` source file would be named `mapwork.camera.test.js`

3. Start writing your tests! If you are unsure of the syntax I recommend checking out some of the existing `.test` files and [checking out Jests documentation](https://jestjs.io/docs/en/expect)
