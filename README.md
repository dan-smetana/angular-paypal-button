# Angular PayPal Button
## About
Due to being heavily dependant on return URLs and originally being constructed to be used strictly with redirects, PayPal can prove to be quite a challenge to implement as a part of a single-page web app. PayPal has since released a piece of JavaScript for their In-Context Checkout, checkout.js, which allows users to make their purchases without leaving the merchant's website.



This project aims to wrap the script, make it easy to use in Angular and allow the use of callbacks, as opposed to redirects, which I believe makes for a much more straightforward developement. This was achieved using an undocumented feature of checkout.js, fixing some bugs related to it and hacking it to allow for the button to be reloaded without refreshing the whole page.

Having more than one buttons displayed at the same time is not currently supported and may lead to undefined behavior.

## Installation
This project can be installed using bower.

```
bower install angular-paypal-button
```

## Live Demonstration
You can play with a live example on [Plunker](http://plnkr.co/edit/10J5le82GJQMI5hUhNyA?p=preview).

## Usage
You first need to configure angular-paypal-button with your Merchant ID and the environment (sandbox or production) in your application's config.

```javascript
angular.module('test-app', ['dsl-paypal-button']).
config(function (PaypalButtonConfigProvider) {
  PaypalButtonConfigProvider.setMerchantId('6XF3MPZBZV6HU');
  PaypalButtonConfigProvider.setEnvironment('sandbox');
});
```

You can then proceed onto generating a button as follows:

```html
<paypal-button url="paypalUrl()" return="onReturn(args)" cancel="onCancel(args)"
               color="blue" size="medium" shape="rect"></paypal-button>
```

The first argument returns a promise returning either the PayPal transaction token, or a URL containing it. This is typically generated on your server using PayPal's REST-ful API. You also need to return the return and cancel URLs as send to PayPal by your server as not even the PayPal script has any idea which is which.


A server provided by PayPal was used for this demonstration, following their own [example](http://plnkr.co/edit/2GGEyNEFUPCZ7jIIGk9X?p=preview). This can be implemented in Angular as follows:

```javascript
$scope.paypalUrl = function () {
  var q = $q.defer();

  $http.get('http://166.78.8.98/cgi-bin/aries.cgi', {
     params: {
       sandbox: 1,
       direct: 1,
       returnurl: 'http://166.78.8.98/cgi-bin/return.htm',
       cancelurl: 'http://166.78.8.98/cgi-bin/cancel.htm',
       ajax: 1,
       onlytoken: 1
     }
   }).
   then(function (response) {
     q.resolve({
       redirectUrl: response.data,
       returnUrl: 'http://166.78.8.98/cgi-bin/return.htm',
       cancelUrl: 'http://166.78.8.98/cgi-bin/cancel.htm',
     });
   }).catch(function () {
     q.reject();
   });

 return q.promise;
};
```

The callback functions passed in the 'return' and 'cancel' arguments are to be used in place of the traditional return URLs. Please keep in mind that especially on small mobile devices the browser may still be redirected to PayPal and as a result your user could find themselves on the original return URL upon completing/canceling their purchase. This is not handled in the above example.

The function specified in the 'return' argument is called when the user successfully logs in and confirms their purchase. The function specified in the 'cancel' argument is called when the user cancels their purchase. Both functions are passed an 'args' hash containing the token and a payerId in the case of a successfull purchase (return).

The button dissappears when the purchase is either completed or canceled since the PayPal script is designed to redirect the user away from the current page at this point and as such using it more than once might lead to undefined behavior.

In the above demonstration a simple message is displayed in place of the button; in reality you'd want to send the data to your server and complete the payment.

```javascript
$scope.onReturn = function (args) {
  $scope.afterPurchase = true;
  $scope.afterPurchaseMsg = 'The item was successfully purchased.\n'; +
      'token: ' + args.token + ', payerId: ' + args.payerId;
};

$scope.onCancel = function (args) {
  $scope.afterPurchase = true;
  $scope.afterPurchaseMsg = 'The purchase was canceled.\n' +
     'token: ' + args.token;
};
```

The last three arguments related to the button's appearance are to be used in accordance with [PayPal's official documentation](https://developer.paypal.com/docs/classic/express-checkout/in-context/integration/#paypal-button-brand-guidelines).

## License
Copyright © 2016 Daniel Shihoon Lee

You can use this project under the terms and conditions of the 2-clause BSD license included with the distribution. This project includes checkout.js by PayPal, Inc. licensed under the Apache License version 2.0; all of my modifications to it are released under the terms of the 2-clause BSD license.

PayPal is a registered trademark of PayPal, Inc. The PayPal logo is a trademark of PayPal, Inc. Other trademarks and brands are the property of their respective owners.
