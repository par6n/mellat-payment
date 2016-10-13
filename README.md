# Mellat Checkout Gateway, for Node.JS
> Startups are growing fast in Iran, and one of the most popular technologies for startups is Node.JS.

This package takes advantage of ES6 classes and promises, brings an ultimate and modern tool for adding Mellat bank checkout to your Node.JS apps. It's compatible with all frameworks, including but not limited to: Express, HapiJS, NodeJS internal webserver, etc.
Also, [a very simple example is uploaded](https://github.com/EhsaanF/mellat-payment-example).

## Installation
You need node >= 4.0 and npm to install this package. Run this command on your project directory:

`$ npm install mellat-payment --save`

Then, you need to call `require( 'mellat-payment' )`:

`const Mellat = require( 'mellat-payment' );`

## Usage
### Request a payment
`Mellat.Request( terminal: String, username: String, password: String, amount: Number, returnPage:String )` ⇒ **Promise**

Requests a payment session from the bank.

Returns an object containing `RefId` and `ResCode` on success, `errorCode` (String) from bank on disagreement or `e` (Object) on failure.

### Verify a payment
`Mellat.Verify( terminal: String, username: String, password: String, saleOrderId: String, resCode: String, saleRefId: String )` ⇒ **Promise**

Verifies given invoice from the bank, if verification was OK, it inquiries and settles the payment automatically, either it reverses the payment.
[See the example](https://github.com/EhsaanF/mellat-payment-example) if you don't know where saleOrderId, resCode and saleRefId comes from.

Returns an object containig `err` property. If `err` was set to `false`, it means the transaction verified, inquiried and settled, otherwise `reason` property will be included, containing the description of the error.

### Other methods
Other methods (`Inquiry`, `Settle` and `Reverse`) aren't needed, they're called automatically by `Verify` method.

## License
This project is licensed under **MIT License**.
