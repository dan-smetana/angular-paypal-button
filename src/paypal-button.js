/*!
 * Copyright (c) 2016 Daniel Shihoon Lee <daniel@shihoonlee.com>
 * Licensed under BSD2
 * (https://github.com/danieslee/angular-paypal-button/blob/master/LICENSE)
 */

angular.module('dsl-paypal-button', []).
provider('PaypalButtonConfig', function () {
  var options = {
    merchantId: '',
    environment: 'sandbox'
  }

  this.setMerchantId = function (merchantId) {
    options.merchantId = merchantId;
  };

  this.setEnvironment = function (environment) {
    options.environment = environment;
  };

  this.$get = function () {
    return options;
  };
}).
directive('paypalButton', ['PaypalButtonConfig', '$compile', '$timeout',
    function (PaypalButtonConfig, $compile, $timeout) {
  var charactersInCommonFromBeginning = function (string1, string2) {
    var i;
    for (i = 0; i < Math.min(string1.length, string2.length); i++) {
      if (string1.charAt(i) != string2.charAt(i)) break;
    }
    return i;
  };

  return {
    restrict: 'E',
    scope: {
      url: '&',
      return: '&',
      cancel: '&',
    },
    link: function (scope, elt, attr) {
      var randomSuffix = Math.random().toString(36).substr(2, 5);
      var buttonId = 'dslPaypalBtn' + randomSuffix;

      var div =
        angular.element('<div ng-if="notPurchased" id="'+buttonId+'"></div>');

      $compile(div)(scope);
      elt.append(div);

      scope.notPurchased = true;

      var getUrlPromise = scope.url;
      var onReturn = scope.return;
      var onCancel = scope.cancel;

      var color = attr.color || 'gold';
      var size = attr.size || 'small';
      var shape = attr.shape || 'pill';

      $timeout(function () {
        var paypal = loadPaypal();
        window.paypalCheckoutReady = function () {
          paypal.checkout.setup(PaypalButtonConfig.merchantId, {
            environment: PaypalButtonConfig.environment,
            container: buttonId,
            color: color,
            size: size,
            shape: shape,
            click: function () {
              paypal.checkout.initXO();

              var returnUrl, cancelUrl;
              getUrlPromise()
                .then(function (hash) {
                  paypal.checkout.startFlow(hash.redirectUrl, {
                    async: true,
                  });

                  returnUrl = hash.returnUrl;
                  cancelUrl = hash.cancelUrl;
                }, function () {
                  paypal.checkout.closeFlow();
                });

              var parseRedirectUrl = function (url) {
                var tokenMatch = url.match(/(&|\?)token=(.*?)(&|$)/);
                var payerIdMatch = url.match(/(&|\?)PayerID=(.*?)(&|$)/);

                var returnUrlMatch =
                  charactersInCommonFromBeginning(url, returnUrl);

                var cancelUrlMatch =
                  charactersInCommonFromBeginning(url, cancelUrl);

                var args = {
                  token: tokenMatch ? tokenMatch[2] : null,
                  payerId: payerIdMatch ? payerIdMatch[2] : null,
                  type: returnUrlMatch > cancelUrlMatch ? 'return' : 'cancel'
                };

                return args;
              };

              var redirected = false;
              var redirectListener = function (args) {
                if (redirected) return;
                redirected = true;

                var redirectUrl = args.returnUrl;
                var parsedUrl = parseRedirectUrl(redirectUrl);

                scope.notPurchased = false;
                scope.$apply();

                if (parsedUrl.type === 'return') onReturn({args: parsedUrl});
                else if (parsedUrl.type === 'cancel') onCancel({args: parsedUrl});
              }

              paypal.checkout.events.addListener('return', redirectListener);
              paypal.checkout.events.addListener('cancel', redirectListener);
            }
          });
        };
      }, 100);
    }
  };
}]);
