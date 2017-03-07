# UPS Test Driver
This is a test-runner written in nodeJS that generate heavy loads on a standalone AeroGear-UPS instance by sending push notifications.

## Stress test modes
The ups-test-driver has different ways to stress test the server, all using [unifiedpush-node-sender](https://www.npmjs.com/package/unifiedpush-node-sender). 

#### Single Alias for All Devices
This one is intended to reach all devices with a single request. It will get all apps from UPS using [unifiedpush-admin-client](https://www.npmjs.com/package/unifiedpush-admin-client) and send a notification to a test alias, `TEST_TOKEN`. Hence all devices must register with this alias.
This mode only requires the arguments: `username` and `password`.

#### One Request, One Notification
This one is designed to reach a group of devices within an App, but one request at a time. The information about the devices must be stored in a CSV file and have 3 columns containing: variantID, alias and tokenID. By default the headers are `#VARIANT ID`,`TOKEN ALIAS`, `TOKEN ID`. This data is easily created by [ups-mock-data-loader](https://github.com/aerogear/ups-mock-data-loader).
This mode only requires the arguments: `pushApplicationID`, `masterSecret` and `csv`.

#### One Request, Many Notifications
This one aims to send many different notifications but with a single request. Each notification targets a different alias and has a custom message, but only one request to UPS. The information about the devices must be stored in a CSV as [above](#one-request,-one-notification).
This mode only requires the arguments: `pushApplicationID`, `masterSecret` and `csv`.

## Concurrency
Concurrency can be added in two ways. By using the `-i` flag, it will instantiate more than one test-runner, which is like running the node app many times in different processes.

## Usage
Having [NPM and nodeJS installed](https://nodejs.org/), first download all core dependencies:
```
$ npm install --production
```
Then start the test-runner by running `node index.js` and passing the necessary arguments. To see detailed usage instructions run `node index.js -h`:
```
Usage: node index.js [[user credentials] | [app arguments]] [options]

User credentials:
  -u, --username           AeroGear account username
  -p, --password           AeroGear account password

App arguments:
  -a, --pushApplicationID  The target applications' pushApplicationID
  -m, --masterSecret       The target applications' masterSecret
  -c, --csv                The path to the CSV path containing the alias in 

Options
  -e, --endPoint           The UPS instance url                                     [default: "http://localhost:8080/ag-push"]
  -d, --delay              The delay between each request                           [default: 1000]
  -i, --instances          How many test runners will be instantiated 
                           simultaneously                                           [default: 1]
  -b, --batchMode          Whether or not the notifications will be sent using
                           the 'batch' feature.                                     [default: false]

  -h, --help               Show help                           

Examples:
  node app/index.js -u admin -p 123
  node app/index.js -u admin -p 123 -e http://localhost:8080/ag-push
  node app/index.js -a 123abc456def -m secret -c ./devices.csv
  node app/index.js -a 123abc456def -m secret -c ./devices.csv -d 2000 -i 10

```

## Contributing
Having [NPM and nodeJS installed](https://nodejs.org/), first download all dependencies:
```
$ npm install
```

#### Code Style
Make sure the style guidelines are being followed by running the linter, [ESLint](http://eslint.org/):
```
$ node_modules/.bin/eslint app spec
```

#### Specs
Make sure all specs are met by simply running:
```
$ npm test
```
For each new feature, modification, bug, etc. it is expected to create as many specs as it is necessary.

Specs must be named like the JS class or file they are defining, with `.spec` right before the extension. For example if we were to write the specs for:
```
my-class.js
```
the spec file would be:
```
my-class.spec.js
```
