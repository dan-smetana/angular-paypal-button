/*!
 * Modifications copyright (c) 2016 Daniel Shihoon Lee <daniel@shihoonlee.com>
 * Licensed under BSD2
 * (https://github.com/danieslee/angular-paypal-button/blob/master/LICENSE)
 */

/*!
 * paypalincontextjs
 * @version 3.10.6
 * @timestamp 06-08-2016
 *
 * Copyright PayPal
 *
 * Licensed under the Apache License, Version 2.0
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * To debug, please use the unminified version of this script
 * at https://www.paypalobjects.com/api/checkout.src.js
 */

var loadPaypal;

/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var postRobot = __webpack_require__(2);
	var constants = __webpack_require__(3);
	var cookies = __webpack_require__(4);
	var css = __webpack_require__(5);
	var device = __webpack_require__(6);
	var dom = __webpack_require__(7);
	var events = __webpack_require__(9);
	var buttonGenerator = __webpack_require__(10);
	var guid = __webpack_require__(14);
	var IframeFactory = __webpack_require__(15);
	var lightbox = __webpack_require__(17);
	var Mask = __webpack_require__(19);
	var redirect = __webpack_require__(11);
	var XoEmitter = __webpack_require__(20);
	var Blocker = __webpack_require__(26);
	var _log = __webpack_require__(13);
	var ready = __webpack_require__(27);
	var removePanels = __webpack_require__(18);
	var loadScript = __webpack_require__(28);
	var getECToken = __webpack_require__(29);
	var ownPropertyShim = __webpack_require__(30); // ie hacks for same-origin
	
	__webpack_require__(31);
	
	loadPaypal = function () {
	    /** PRIVATE **/
	
	    var paypal = paypal || {};
	
	    if (window.paypal && window.paypal.checkout) {
	        //_log(constants.ERROR_MESSAGES.PAYPAL_GLOBAL_OVERRIDE);
	        //return;

        window.paypal = null;
        postRobot.reset();
	    }
	
	    (function () {
	
	        function addToNamespace(obj) {
	            var namespace = window.PAYPAL || {};
	            namespace.apps = namespace.apps || {};
	            namespace.apps.Checkout = namespace.apps.Checkout || {};
	
	            for (var prop in obj) {
	                namespace.apps.Checkout[prop] = obj[prop];
	            }
	
	            // (Backwards compatibility) Setting up aliases for convenience
	            namespace.checkout = namespace.apps.Checkout;
	
	            // Export "PAYPAL" and "paypal" as globals
	            window.PAYPAL = window.paypal = namespace;
	        }
	
	        /**
	         * Creates an instance of the in-context MiniBrowser UI
	         * @param {Object} userConfig Overrides to the default configuration
	         */
	        paypal.checkout = (function () {
	            var xoEmitter = new XoEmitter();
	            var app = {},
	
	                config = {
	                    name: constants.MINI_BROWSER_NAME, // This is eventually changed to something like: PPFrame1a2b3c4d5e, etc.
	                    css: 'body.PPFrame {        overflow: hidden;}#PPFrame {        z-index: 1000000001;        top: 0;        left: 0;}#PPFrame .ppICMask {        z-index: 1000000000;        position: absolute;        top: 0;        left: 0;        background-color: black;        background-image: radial-gradient(circle farthest-corner, #000000, #4A4A4A);        opacity: 0.80;        filter: alpha(opacity=80);        cursor: pointer;}#PPFrame .ppmodal {        font-family: "HelveticaNeue", "HelveticaNeue-Light", "Helvetica Neue Light", helvetica, arial, sans-serif;        font-size: 14px;        text-align: center;        color: #fff;        z-index: 1000000002;        -webkit-box-sizing: border-box;        -moz-box-sizing: border-box;        -ms-box-sizing: border-box;        box-sizing: border-box;        width: 350px;        top: 50%;        left: 50%;        position: fixed;        margin-left: -165px;        margin-top: -80px;        cursor: pointer;}#PPFrame .loading .spinner {        height: 30px;        width: 30px;        position:absolute;        left: 48%;        top: 50%;        margin: -15px auto auto -15px;        opacity: 1;        filter: alpha(opacity=100);        background-color: rgba(255, 255, 255, 0.701961);        -webkit-animation: rotation .7s infinite linear;        -moz-animation: rotation .7s infinite linear;        -o-animation: rotation .7s infinite linear;        animation: rotation .7s infinite linear;        border-left: 8px solid rgba(0,0,0,.20);        border-right: 8px solid rgba(0,0,0,.20);        border-bottom: 8px solid rgba(0,0,0,.20);        border-top: 8px solid rgba(33,128,192,1);        border-radius: 100%;}@-webkit-keyframes rotation {        from {                -webkit-transform: rotate(0deg);        }        to {                -webkit-transform: rotate(359deg);        }}@-moz-keyframes rotation {        from {                -moz-transform: rotate(0deg);        }        to {                -moz-transform: rotate(359deg);        }}@-o-keyframes rotation {        from {                -o-transform: rotate(0deg);        }        to {                -o-transform: rotate(359deg);        }}@keyframes rotation {        from {                transform: rotate(0deg);        }        to {                transform: rotate(359deg);        }}#PPFrame .loading.noanimation .spinner {        height: 48px;        width: 48px;        border: none;        background: url(https://www.paypalobjects.com/webstatic/checkout/hermes/icon_loader_med.gif) no-repeat center center;}#PPFrame .ppmodal.loading {        min-height: 160px;}#PPFrame .ppmodal .pplogo {  background: url("https://www.paypalobjects.com/images/checkout/incontext/incontext_mask_sprite.png") no-repeat -18px -16px;	width: 132px;	height: 36px;  cursor: pointer;  margin: 26px 0 0 109px;}@media only screen and (-webkit-min-device-pixel-ratio: 2), not all, not all, only screen and (min-resolution: 2dppx), only screen and (min-resolution: 192dpi) {  #PPFrame .ppmodal .pplogo {    background-image: url("https://www.paypalobjects.com/images/checkout/incontext/incontext_mask_sprite_2x.png");    background-size: 200px 200px;  }}.ppmodal .closeButton {        position: absolute;        top: 0;        right: 0;        display: inline-block;        text-indent: -999em;        cursor: pointer;        background: url("https://www.paypalobjects.com/images/checkout/incontext/incontext_mask_sprite.png") no-repeat -16px -60px;	      width: 18px;	      height: 18px;}.ppmodal .closeButton:focus, .ppmodal .closeButton:hover {  background: url("https://www.paypalobjects.com/images/checkout/incontext/incontext_mask_sprite.png") no-repeat -46px -60px;}.ppmodal .closeButton:focus {  outline: 1px solid #ffffff;}@media only screen and (-webkit-min-device-pixel-ratio: 2), not all, not all, only screen and (min-resolution: 2dppx), only screen and (min-resolution: 192dpi) { .ppmodal .closeButton, .ppmodal .closeButton:focus, .ppmodal .closeButton:hover {   background-image: url("https://www.paypalobjects.com/images/checkout/incontext/incontext_mask_sprite_2x.png");   background-size: 200px 200px; }}#PPFrame .ppmodal .text {        font-size: 14px;}#PPFrame .ppmodal a.button {        display: block;        cursor: pointer;        margin-top: 20px;        color: #0088cc;}.ppmodal a.ppbutton {        display: block;        margin: auto;        cursor: pointer;        margin-top: 20px;        color: #ffffff;        font-size: 15px;        font-weight: bold;        text-decoration: none;      }.ppmodal a.ppbutton span {  background: url("https://www.paypalobjects.com/images/checkout/incontext/incontext_mask_sprite.png") no-repeat -15px -89px;  width: 7px;  height: 12px;  display: inline-block;}.ppmodal a.ppbutton:focus, .ppmodal a.ppbutton:hover {  color: #e6e6e6;  text-decoration: underline;}.ppmodal a.ppbutton:focus {    outline: none;}#PPFrame .ppmodal #ppmsg {  font-size: 15px;  line-height: 1.35;  padding: 25px 0;}a.ppbutton:hover span, a.ppbutton:focus span {  background: url("https://www.paypalobjects.com/images/checkout/incontext/incontext_mask_sprite.png") no-repeat -45px -89px;	}@media only screen and (-webkit-min-device-pixel-ratio: 2), not all, not all, only screen and (min-resolution: 2dppx), only screen and (min-resolution: 192dpi) {  .frontArrow {    background-image: url("https://www.paypalobjects.com/images/checkout/incontext/incontext_mask_sprite_2x.png");    background-size: 200px 200px;  }  }/* Lightbox */#PPFrame .PPIC-panel {  z-index: 1000000002;  position: fixed;  border: none;  width: 420px;  height: 250px;  margin-top: -125px;  margin-left: -210px;  left: 50%;  overflow: visible;  top: 50%;  -webkit-transition: all 0.6s ease;  -moz-transition: all 0.6s ease;  -ms-transition: all 0.6s ease;  -o-transition: all 0.6 ease;  transition: all 0.6s ease;  opacity: 0;  overflow: hidden;  border-radius: 8px;  background: white;}#PPFrame .PPIC-panel.bounceInUp {  opacity: 1;}#PPFrame .PPIC-panel iframe {  width: 420px;  height: 250px;  border: 0;  border-radius: 8px;  -webkit-transition: all 0.6s ease;  -moz-transition: all 0.6s ease;  -ms-transition: all 0.6s ease;  -o-transition: all 0.6 ease;  transition: all 0.6s ease;}#PPPanel {  display: none;}#PPPanel.PPIC-panel {  display: block;}#PPFrame .mask {  z-index: 1000000000;  position: fixed;  top: 0;  left: 0;  right: 0;  bottom: 0;  height: 100%;  background: black;  background: -webkit-radial-gradient(50% 50%, ellipse closest-corner, rgba(0,0,0,0.6) 1%, rgba(0,0,0,0.8) 100%);  background: -moz-radial-gradient(50% 50%, ellipse closest-corner, rgba(0,0,0,0.6) 1%, rgba(0,0,0,0.8) 100%);  background: -ms-radial-gradient(50% 50%, ellipse closest-corner, rgba(0,0,0,0.6) 1%, rgba(0,0,0,0.8) 100%);  background: radial-gradient(50% 50%, ellipse closest-corner, rgba(0,0,0,0.6) 1%, rgba(0,0,0,0.8) 100%);  filter: alpha(opacity = 30);  -webkit-transition: 1000ms opacity;  -moz-transition: 1000ms opacity;  transition: 1000ms opacity;  opacity: 1;  -webkit-transform: translate3d(0, 0, 0);  -moz-transform: translate3d(0, 0, 0);  -ms-transform: translate3d(0, 0, 0);  -o-transform: translate3d(0, 0, 0);  transform: translate3d(0, 0, 0);}#PPFrame.active .mask {  opacity: 1;}/*! * animate.css -http://daneden.me/animate * Version - 3.5.1 * Licensed under the MIT license - http://opensource.org/licenses/MIT * * Copyright (c) 2016 Daniel Eden */.animated {  -webkit-animation-duration: 1s;  animation-duration: 1s;  -webkit-animation-fill-mode: both;  animation-fill-mode: both;}@-webkit-keyframes bounceInUp {  from, 60%, 75%, 90%, to {    -webkit-animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);    animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);  }  from {    opacity: 0;    -webkit-transform: translate3d(0, 3000px, 0);    transform: translate3d(0, 3000px, 0);  }  60% {    opacity: 1;    -webkit-transform: translate3d(0, -20px, 0);    transform: translate3d(0, -20px, 0);  }  75% {    -webkit-transform: translate3d(0, 10px, 0);    transform: translate3d(0, 10px, 0);  }  90% {    -webkit-transform: translate3d(0, -5px, 0);    transform: translate3d(0, -5px, 0);  }  to {    -webkit-transform: translate3d(0, 0, 0);    transform: translate3d(0, 0, 0);  }}@keyframes bounceInUp {  from, 60%, 75%, 90%, to {    -webkit-animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);    animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);  }  from {    opacity: 0;    -webkit-transform: translate3d(0, 3000px, 0);    transform: translate3d(0, 3000px, 0);  }  60% {    opacity: 1;    -webkit-transform: translate3d(0, -20px, 0);    transform: translate3d(0, -20px, 0);  }  75% {    -webkit-transform: translate3d(0, 10px, 0);    transform: translate3d(0, 10px, 0);  }  90% {    -webkit-transform: translate3d(0, -5px, 0);    transform: translate3d(0, -5px, 0);  }  to {    -webkit-transform: translate3d(0, 0, 0);    transform: translate3d(0, 0, 0);  }}.bounceInUp {  -webkit-animation-name: bounceInUp;  animation-name: bounceInUp;}@-webkit-keyframes bounceOutDown {  20% {    -webkit-transform: translate3d(0, 10px, 0);    transform: translate3d(0, 10px, 0);  }  40%, 45% {    opacity: 1;    -webkit-transform: translate3d(0, -20px, 0);    transform: translate3d(0, -20px, 0);  }  to {    opacity: 0;    -webkit-transform: translate3d(0, 2000px, 0);    transform: translate3d(0, 2000px, 0);  }}@keyframes bounceOutDown {  20% {    -webkit-transform: translate3d(0, 10px, 0);    transform: translate3d(0, 10px, 0);  }  40%, 45% {    opacity: 1;    -webkit-transform: translate3d(0, -20px, 0);    transform: translate3d(0, -20px, 0);  }  to {    opacity: 0;    -webkit-transform: translate3d(0, 2000px, 0);    transform: translate3d(0, 2000px, 0);  }}.bounceOutDown {  -webkit-animation-name: bounceOutDown;  animation-name: bounceOutDown;}',
	                    secureWindow: constants.CONTENT_SECURE_WINDOW, // This can be modified by the parent app
	                    continueLink: constants.CONTINUE_LINK,
	                    locale: constants.DEFAULT_LOCALE, // This can be modified by the parent app
	                    trigger: null,
	                    isSmartPhone: false,
	                    isWebView: false,
	                    merchantID: null,
	                    showMiniB: true,
	                    sandBox: false,
	                    devMode: false,
	                    version: '3.0',
	                    log: true,
	                    cookiedExp: cookies.getItem('PPXOEXP'),
	                    debug: cookies.getItem('PPDEBUG'),
	                    domain: cookies.getItem('PPDOMAIN'),
	                    urlPrefix: cookies.getItem('PPURLPREFIX'),
	                    oldIe: navigator.userAgent.match(/MSIE [87]\./i),
	                    // IE can only postmessage from window to iframe
	                    needsIframeBridge: !!navigator.userAgent.match(/MSIE|trident|edge/i),
	                    prefetchLoaded: false,
	                    cookieCheckLoaded: false,
	                    currentAgent: device.getAgent(),
	                    merchantConfig: null,
	                    guid: null,
	                    enableOneTouch: true,
	                    bodyStyle: null,
	                    oneTouchEnabled: false,
	                    thirdPartyCookiesEnabled: false,
	                    forceLightboxDisabled: false,
	                    lightboxOpened: false,
	                    popupOpened: false
	                },
	                requireBtnJs = false,
	                btnList = [],
	                isOpen = false,
	                errMsg = '', // eslint-disable-line no-unused-vars
	                ecToken = null,
	                jsBtnConfigs = [],
	                setupCalled = false,
	                oneTouchShowed = false,
	                blocker = null,
	                mask = null,
	                merchantServiceUrl = null;
	
	            app.urlPrefix = '';
	
	            /**
	             * Tracking various events
	             * @param {object} msg to send via beacon
	             * @returns {null}
	             */
	            function _track(msg, isError) {
	                var url = config.sandBox ? constants.SANDBOX_URL_ROOT : constants.LIVE_URL_ROOT,
	                    msgStr;
	
	                if (config.log && typeof msg === 'object') {
	                    msg.merchantSite = document.domain;
	                    msg.version = config.version;
	                    msg.token = ecToken;
	                    msg.guid = config.guid;
	                    msg.oneTouchShowed = oneTouchShowed.toString();
	                    msg.jsBtnConfig = jsBtnConfigs;
	                    msg.status += jsBtnConfigs.length > 0 ? '_JS' : '';
	                    msg.status += oneTouchShowed ? '_ONETOUCH' : '';
	
	                    msgStr = JSON.stringify(msg);
	                    msgStr = encodeURIComponent(msgStr);
	                    url = url + '/webapps/' + (config.merchantConfig.app || 'hermes') + '/api/log?event=' + msg.status
	                        + '&state=merchant_incontext&token=' + (ecToken ? ecToken : 'undefined') // token='undefined' for FEEL logging
	                        + '&level=' + (isError ? 'error' : 'info')
	                        + '&cb=' + Date.now()
	                        + '&msg=' + msgStr;
	
	                    var beacon = new Image();
	                    beacon.src = url;
	
	                    if (config.debug) {
	                        _log(decodeURIComponent(msgStr));
	                    }
	                }
	            }
	
	            function callNewSetup() {
	                var oldButtonEl = document.querySelectorAll('[data-paypal-button]'),
	                    sandboxEl = document.querySelectorAll('[data-paypal-sandbox]'),
	                    merchantIdEl = document.querySelectorAll('[data-paypal-id]');
	
	                // Don't construct setup call if merchant doesn't have any old configuration
	                if (oldButtonEl.length || sandboxEl.length || merchantIdEl.length) {
	
	                    var oldButtons = oldButtonEl.length ? oldButtonEl : [],
	                        environment = sandboxEl.length ? 'sandbox' : 'production',
	                        merchantId = merchantIdEl.length ? merchantIdEl[0].getAttribute('data-paypal-id') : document.domain;
	
	                    paypal.checkout.setup(merchantId, {
	                        environment: environment,
	                        button: oldButtons
	                    });
	
	                    _track({status: 'IC_CUSTOM_BUTTON_SCAN'});
	
	                }
	            }
	
	            // Function call for data-paypal-button
	            if (typeof window.paypalCheckoutReady !== 'function') {
	                ready(callNewSetup);
	            }
	
	            /**
	             * Custom event which does some cleanup: all UI DOM nodes and custom events
	             * are removed from the current page
	             *
	             * @param {Event} e The event object
	             */
	            function _destroy(event) {
	                _clearBodyIframeClass(config.name);
	                var wrapper = document.getElementById(config.name);
	                if (app.heartbeat) {
	                    // To avoid double refresh triggering from timeout loop
	                    clearTimeout(app.heartbeat);
	                }
	                
	                if (app.windowAccessCrash) {
	                    // don't destroy if the window crashed out
	                    return;
	                }
	
	                // If the lightbox is open, transition it out and remove it.
	                if (config.lightboxOpened && !config.popupOpened) {
	                    lightbox.destroy(app, config, function () {
	
	                        _removeEvents();
	                        isOpen = false;
	
	                        if (app.win && app.win.close) {
	                            app.win.close();
	                        }
	
	                        if (config.returnUrl) {
	                            _track({
	                                status: 'IC_DESTROY_TO_RETURN_URL'
	                            });
	                            if (config.fromStartFlow) {
	                                if (isOpen) {
	                                    removePanels(config);
	                                }
	                            }

                              if (config.async) {
                                xoEmitter.emit('return', {
                                  returnUrl: config.returnUrl
                                });
                                return;
                              }

	                            if (!config.async) {
	                                return redirect(config.returnUrl);
	                            }
	
	                        } else {
	                            _track({
	                                status: 'IC_DESTROY_TO_CANCEL_URL'
	                            });
	
	                            // From startFlow or single page apps with # cancel urls
	                            if (config.fromStartFlow || window.location.href.split('#')[0] === config.cancelUrl.split('#')[0]) {
	                                removePanels(config);
	                            }
	
                              if (config.async) {
                                xoEmitter.emit('cancel', {
                                  returnUrl: config.cancelUrl
                                });
                                return;
                              }

	                            if (!config.async) {
	                                return redirect(config.cancelUrl);
	                            }
	                        }
	                    });
	                    return;
	                }
	
	                if (isOpen && wrapper && wrapper.parentNode) {
	                    // Update the content from the post message response
	                    // var msg = document.querySelector('#PPFrame .message');
	                    var msg = document.querySelector('#' + config.name + ' .message');
	                    if (msg && config.cancelUrl) {
	                        msg.innerHTML = constants.CONTENT_LOADING;
	
	                        if (!config.returnUrl) {
	                            _track({
	                                status: 'IC_DESTROY_TO_CANCEL_URL'
	                            });
	
	                            // From startFlow or single page apps with # cancel urls
	                            var probablySinglePageApp = (window.location.href.split('#')[0] === config.cancelUrl.split('#')[0]);
	                            if (config.fromStartFlow || probablySinglePageApp) {
	                                removePanels(config);
	                            }

                              if (config.async) {
                                xoEmitter.emit('cancel', {
                                  returnUrl: config.cancelUrl
                                });
                                return;
                              }

	                            if (!config.async) {
	                                return redirect(config.cancelUrl);
	                            }
	                        }
	
	                        // if no cancel or return url is passed in
	                    } else if (!config.returnUrl) {
	                        removePanels(config);
	                        _track({
	                            status: 'IC_DESTROY_NO_CANCEL_RETURN_URL'
	                        });
	                    }
	                }
	
	                _removeEvents();
	                removePanels(config);
	
	                isOpen = false;
	
	                if (app.win && app.win.close) {
	                    app.win.close();
	                }
	
	                if (config.returnUrl) {
	                    _track({
	                        status: 'IC_DESTROY_TO_RETURN_URL'
	                    });
	                    if (config.fromStartFlow && isOpen) {
	                        removePanels(config);
	                    }
	                    if (config.async) {
	                        xoEmitter.emit('return', {
	                            returnUrl: config.returnUrl
	                        });
	                        return;
	                    }
	
	                    mask.hide();
	
	                    if (!config.async) {
	                        return redirect(config.returnUrl);
	                    }
	                }
	            }
	
	            /**
	             * Remove all the events for an instance
	             */
	            function _removeEvents() {
	                if (window.orientation) {
	                    events.removeEvent(window, 'orientationchange', mask.create);
	                }
	                blocker.unblock();
	                events.removeEvent(window, 'resize', mask.create);
	                events.removeEvent(window, 'unload', _destroy);
	                events.removeEvent(window, 'keyup', lightbox.toggle(_destroy));
	            }
	
	            function getCheckoutDimensions() {
	                var left;
	                var top;
	                var width = constants.MINI_BROWSER_WIDTH;
	                var height = constants.MINI_BROWSER_HEIGHT;
	
	                if (window.outerWidth) {
	                    left = Math.round((window.outerWidth - width) / 2) + window.screenX;
	                    top = Math.round((window.outerHeight - height) / 2) + window.screenY;
	                } else if (window.screen.width) {
	                    left = Math.round((window.screen.width - width) / 2);
	                    top = Math.round((window.screen.height - height) / 2);
	                }
	
	                return {
	                    left: left,
	                    top: top,
	                    width: width,
	                    height: height
	                };
	            }
	
	            function _openMiniBrowser() {
	                var loading = document.querySelector('#' + config.name + ' .ppmodal.loading');
	                var dimensions = getCheckoutDimensions();
	                var winOpened = false;
	                var win;
	
	                win = app.win = window.open('about:blank', config.name, 'top=' + dimensions.top + ', left=' + dimensions.left + ', width=' + dimensions.width + ', height=' + dimensions.height + ', location=1, status=1, toolbar=0, menubar=0, resizable=1, scrollbars=1');
	
	                // (Backwards compatibility) Adding "win" to the global namespace for merchants from the past using internal APIS :|
	                addToNamespace({
	                    win: win
	                });
	
	                // Popup blocked case
	                if (!win) {
	                    _track({
	                        status: 'IC_CLICK_OPEN_MB_FAILED'
	                    }, true);
	                    if (config.async) {
	                        xoEmitter.emit('failure', {
	                            error: constants.ERROR_MESSAGES.CANNOT_WRITE_TO_MINI_BROWSER
	                        });
	                    }
	                    return window;
	                    // for sync ajax case
	                } else if (ecToken) {
	                    _track({
	                        status: 'IC_CLICK_OPEN_MB_SUCCESS_SYNC_AJAX'
	                    });
	                    if (config.async) {
	                        xoEmitter.emit('success', {
	                            token: ecToken
	                        });
	                    }
	                }
	
	                if (win && win.focus) {
	                    win.focus();
	                }
	
	                if (loading) {
	                    loading.className = 'ppmodal';
	                }
	
	                // Show the loading screen on the opened popup window till merchant does a 302 after setEC call
	                try {
	                    dom.injectLoadingInterstitial(win.document);
	                    if (config.async) {
	                        xoEmitter.emit('success', {
	                            token: ecToken
	                        });
	                    }
	                } catch (err) {
	                    // For IE9 and IE10 win.document gets permission denied if win.domain is reset to a new domain
	                    try {
	                        // this is hacky and should be replaced by something better asap
	                        var docDomHax = 'javascript' + ':' + 'void((function(){document.open();document.domain="' + document.domain + '";})())';
	                        win.location = docDomHax;
	                        dom.injectLoadingInterstitial(win.document);
	                        if (config.async) {
	                            xoEmitter.emit('success', {
	                                token: ecToken
	                            });
	                        }
	                    } catch (e) {
	                        _log(constants.ERROR_MESSAGES.CANNOT_WRITE_TO_MINI_BROWSER);
	
	                        // since we could not communicate with the window, we will close it
	                        // otherwise it will sit there staring our user with it's about:blank stare
	                        // don't fire destroy when we close the window
	                        clearInterval(app.intVal);
	                        // incase destroy is queued we don't want it to go anywhere.
	                        // @todo: this could be abstracted into some kind of manager since
	                        // there are other exit conditions now stacking up. 
	                        app.windowAccessCrash = true;
	                        win.close();
	                        if (config.async) {
	                            xoEmitter.emit('failure', {
	                                error: constants.ERROR_MESSAGES.CANNOT_WRITE_TO_MINI_BROWSER
	                            });
	                        }
	                    }
	                }
	
	                winOpened = true;
	
	                if (winOpened) {
	
	                    var initUrl = win.location.href;
	
	                    app.heartbeat = setTimeout(function pollMiniBrowser() {
	                        if (win) {
	                            // Polling minibrowser to detect if window is close, if closed redirect the parent window to return/cancel url
	                            try {
	                                if (win.closed) {
	                                    winOpened = false;
	                                    config.popupOpened = false;
	                                    if (app.heartbeat) {
	                                        clearTimeout(app.heartbeat);
	                                        app.heartbeat = undefined;
	                                        return _destroy();
	                                    }
	                                }
	                                else {
	                                    // when mb is opened, check whether merchant site page is loaded in mb
	                                    try {
	                                        var currentUrl = win.location.href;
	                                        // Skip checking if current url is undefined, empty string '', or 'about:blank'
	                                        var isDifferentInitUrl = !!currentUrl && (initUrl !== currentUrl) && (currentUrl.indexOf('about:blank') === -1);
	                                        // Skip checking if merchant service url is not defined in html (mostly ajax case)
	                                        var isNotMerchantServiceUrlWhenPassed = (!merchantServiceUrl || currentUrl.indexOf(merchantServiceUrl) !== 0);
	                                        // In case that paypal.com is the merchant or somehow the current page is the paypal checkout page
	                                        var isPayPalCheckoutPage = (/paypal\.com(.)+token=/gi).test(currentUrl);
	
	                                        if (isDifferentInitUrl && isNotMerchantServiceUrlWhenPassed && !isPayPalCheckoutPage) {
	                                            // merchant (not initial or service to call setec) page is loaded in mb
	                                            _track({
	                                                status: 'IC_MERCHANT_PAGE_LOADED_IN_MINIBROWSER'
	                                            });
	                                            winOpened = false;
	                                            _destroy();
	                                            if (config.async) {
	                                                xoEmitter.emit('failure', {
	                                                    error: 'IC_MERCHANT_PAGE_LOADED_IN_MINIBROWSER'
	                                                });
	                                            }
	
	                                            redirect(currentUrl);
	
	                                            return;
	                                        }
	                                    } catch (e) {
	                                        // showing non merchant site page, reset initUrl in case the new merchant page url
	                                        // loaded in mb is the same as the initial one
	                                        initUrl = null;
	                                    }
	                                    if (app.heartbeat) {
	                                        clearTimeout(app.heartbeat);
	                                        app.heartbeat = setTimeout(pollMiniBrowser, 500);
	                                    }
	                                }
	
	                            } catch (err) {
	                                // ie error
	                                _track({
	                                    status: 'IC_WINDOW_ACCESS_DENIED'
	                                }, true);
	                            }
	                        }
	
	                    }, 500);
	                }
	
	                return win;
	            }
	
	            /**
	             * Sets up the events for an instance
	             */
	            function _bindEvents() {
	                var masque = document.getElementById('ppICMask');
	                var maskMessaging = document.getElementById('ppICModal');
	                var closeButton = document.getElementById('closeButton');
	                var continueButton = document.getElementById('ppICContinue');
	
	                var isButtonKey = function (event) {
	                    return (event.keyCode === 13 || event.keyCode === 32);
	                };
	
	                var _hustleAndFlow = function (event) {
	                    // focus on click, or if continue button, focus on spacebar/enter keys
	                    if (event.target !== continueButton || isButtonKey(event)) {
	                        _focus();
	                        paypal.checkout.startFlow();
	                    }
	                };
	
	                var _keyboardDestroy = function (event) {
	                    if (isButtonKey(event)) {
	                        _destroy();
	                    }
	                };
	
	                blocker = new Blocker(document.getElementById('ppICModal'), 'ppbutton', 'closeButton');
	
	                if (masque) {
	                    blocker.block();
	                    events.addEvent(masque, 'click', _hustleAndFlow, this);
	                }
	
	                if (maskMessaging) {
	                    events.addEvent(maskMessaging, 'click', _hustleAndFlow, this);
	                    events.addEvent(continueButton, 'keyup', _hustleAndFlow, this);
	                }
	
	                if (closeButton) {
	                    events.addEvent(closeButton, 'click', _destroy, this);
	                    events.addEvent(closeButton, 'keyup', _keyboardDestroy, this);
	                }
	
	                if (window.orientation) {
	                    events.addEvent(window, 'orientationchange', mask.create, this);
	                }
	                events.addEvent(window, 'resize', mask.create, this);
	                events.addEvent(window, 'unload', _destroy, this);
	                events.addEvent(window, 'keyup', lightbox.toggle(_destroy), this);
	            }
	
	            /**
	             * Renders and displays the UI
	             *
	             * @return {object} The new popup window object the flow will appear in.
	             */
	            function _render() {
	
	                try {
	
	                    var elem = window.event ?
	                        window.event.currentTarget || window.event.target || window.event.srcElement : this;
	
	                    if (window.event) {
	                        // if user is holding shift, control, or command, let the link do its thing
	                        if (event.ctrlKey || event.shiftKey || event.metaKey) {
	                            _track({
	                                status: 'IC_RENDER_META_KEYPRESS'
	                            });
	                            return null;
	                        }
	                    }
	
	                    // PXP decision return not to show in-context flow
	                    if (config.showMiniB === false) {
	                        return null;
	                    }
	
	                    if (elem && elem.form) {
	                        elem.form.target = config.name;
	                        merchantServiceUrl = elem.form.action;
	                    } else if (elem && elem.tagName && elem.tagName.toLowerCase() === 'a') {
	                        elem.target = config.name;
	                        merchantServiceUrl = elem.href;
	                    } else if (elem && elem.tagName && (elem.tagName.toLowerCase() === 'img' || elem.tagName.toLowerCase() === 'button') && elem.parentNode.tagName.toLowerCase() === 'a') {
	                        elem.parentNode.target = config.name;
	                        merchantServiceUrl = elem.parentNode.href;
	                    } else if (elem && elem.tagName && elem.tagName.toLowerCase() === 'button' && elem.parentNode.parentNode.tagName.toLowerCase() === 'a') {
	                        elem.parentNode.parentNode.target = config.name;
	                        merchantServiceUrl = elem.parentNode.parentNode.href;
	                    } else if (this && this.hasOwnProperty('target') && typeof this.target !== 'undefined') {   // not sure what this use case is
	                        this.target = config.name;
	                        merchantServiceUrl = this.action || this.href;
	                    }
	
	                    // Add PayPal specific css on the merchant site
	                    css.add(config);
	
	                    // If PayPal mask is not present only
	                    if (lightbox.isEnabled(config)) {
	                        app.lightbox = lightbox.build(config);
	                        setTimeout(function () {
	                            app.lightbox.panel.className += ' bounceInUp';
	
	                            config.lightboxOpened = true;
	                            config.popupOpened = false;
	                        }, 300);
	                    } else if (!document.querySelectorAll('#' + config.name).length) {
	                        dom.injectIncontext(null, config);
	
	                        _clearBodyIframeClass(config.name);
	
	                        mask.create();
	                        // _bindEvents();
	
	                        config.lightboxOpened = false;
	                        config.popupOpened = true;
	                    }
	
	                    _bindEvents();
	
	                    isOpen = true;
	
	                    return _openMiniBrowser();
	                } catch (err) {
	                    _track({
	                        status: 'IC_RENDER_ERROR',
	                        error_msg: err
	                    }, true);
	                    errMsg = err;
	                }
	            }
	
	            function _focus() {
	                if (app.win && app.win.focus) {
	                    app.win.focus();
	                }
	
	                postRobot.send(app.win || config.name + 'frame', 'focus', function (err) {
	                    if (err) {
	                        if (app.win && app.win.focus) {
	                            app.win.focus();
	                        }
	                    }
	                });
	            }
	
	            function _clickHandler(event, clickFn, condFn) {
	                if (condFn && !condFn()) {
	                    return null;
	                }
	
	                if (clickFn) {
	                    clickFn(event);
	                } else {
	                    _render.call(this, event);
	                }
	            }
	
	            /*
	             * Adds click event listeners
	             */
	            function _setTrigger(el, clickFn, condiFn) {
	                events.addEvent(el, 'click', function (event) {
	                    _clickHandler.call(this, event, clickFn, condiFn);
	                }, this);
	            }
	
	            /*
	             * Finds elements with data-paypal-button data attributes and adds click event listeners
	             */
	            function _setTriggers() {
	                var i = btnList.length;
	
	                while (i--) {
	                    var btnObj = btnList[i];
	                    _setTrigger(btnObj.element, btnObj.clickFn, btnObj.condFn);
	                }
	            }
	
	            function _setupPostRobotHandler() {
	                // Pass down config into the iframe when requested
	                postRobot.on('init', function (err, data) {
	                    if (!err) {
	                        var secureWindowMessage = data && data.secureWindowmsg;
	                        var messageContainer = document.querySelector('#' + config.name + ' .message');
	
	                        if (secureWindowMessage) {
	                            config.secureWindow = secureWindowMessage;
	
	                            if (messageContainer) {
	                                messageContainer.innerHTML = secureWindowMessage;
	                                messageContainer.getElementsByClassName('ppbutton')[0].tabIndex = 1;
	                            }
	                        }
	
	                        var dimensions = getCheckoutDimensions();
	
	                        return {
	                            id: config.guid,
	                            dimensions: {
	                                top: dimensions.top,
	                                left: dimensions.left,
	                                width: dimensions.width,
	                                height: dimensions.height
	                            }
	                        };
	                    }
	                });
	
	                // User closed browser -- clean up, hide overlay, and go to cancel url
	                postRobot.on('cancel', function (err, data) {
	                    if (!err) {
	                        _sendCloseEvent(config.name);
	                    }
	                });
	
	                // User completed checkout, so destroy the popup/lightbox and redirect to the return url
	                postRobot.on('return', function (err, data) {
	                    if (!err) {
	                        _sendCloseEvent(config.name);
	                    }
	                });
	
	                // Popup was opened -- show overlay
	                postRobot.on('popup_opened', function (err, data) {
	                    if (!err) {
	                        var masque = document.getElementsByClassName('mask')[0];
	
	                        // 1. Render the mask w/ messaging
	                        dom.injectIncontext(null, config);
	
	                        // 2. Hide the lightbox
	                        document.getElementById('PPPanel').className = '';
	
	                        // 3. Hide the lightbox mask
	                        if (masque) {
	                            masque.parentNode.removeChild(masque);
	                        }
	
	                        // 4. Bind events (click events to re-focus, etc.)
	                        _bindEvents();
	
	                        // 5. Stateful flag for "is the popup opened", used all over the place
	                        isOpen = true;
	
	                        // 6. Stateful flags for "is the lightbox enabled", we're forcing the popup from here on...
	                        config.oneTouchEnabled = false;
	                        config.popupOpened = true;
	                    }
	                });
	            }
	
	            function _setupPostMessageHandler() {
	                var eventMethod = window.addEventListener ? 'addEventListener' : 'attachEvent';
	                var messageEvent = eventMethod === 'attachEvent' ? 'onmessage' : 'message';
	                var eventer = window[eventMethod];
	
	                var msg = document.querySelector('#' + config.name + ' .message');
	                var data;
	
	                // Browsers that support postMessage
	                if (window.postMessage) {
	                    eventer(messageEvent, function (event) {
	
	                        // Domain check to accept post messages from PayPal domain only or in dev mode
	                        if (event.origin.match(/paypalobjects\.com/i) || event.origin.match(/paypal\.com/i) || config.devMode || event.origin.match(/localhost:8100/i)) {
	                            try {
	                                data = JSON.parse(event.data);
	                            } catch (e) {
	                                data = event.data;
	                            }
	
	                            // Normalizing URLs
	                            config.returnUrl = (data.returnUrl || config.returnUrl || '').replace(/&amp;/g, '&');
	                            config.landingUrl = (data.landingUrl || config.landingUrl || '').replace(/&amp;/g, '&');
	                            config.cancelUrl = (data.cancelUrl || config.cancelUrl || '').replace(/&amp;/g, '&');
	
	                            // Specific operations
	                            var operation = data.operation;
	
	                            // If a browser supports third-party cookies.
	                            if (operation === 'cookie_check' && data.enabled) {
	                                config.thirdPartyCookiesEnabled = true;
	                            }
	
	                            // For lightbox resizing
	                            if (operation === 'lightbox_resize') {
	                                app.lightbox.iframe.style.height = data.height + 'px';
	                                app.lightbox.iframe.style.width = data.width + 'px';
	                                app.lightbox.panel.style.height = data.height + 'px';
	                                app.lightbox.panel.style.width = data.width + 'px';
	                                app.lightbox.panel.style.marginTop = -(data.height / 2) + 'px';
	                            }
	
	                            if (data.popupHtml) {
	                                var taglineSpans = document.getElementsByClassName(constants.JS_BUTTON_TAGLINE_SPAN_STYLE);
	
	                                for (var i = 0; i < taglineSpans.length; i++) {
	                                    taglineSpans[i].innerHTML = data.popupHtml;
	                                }
	
	                                // track one touch rendering event
	                                if (taglineSpans.length > 0) {
	                                    oneTouchShowed = true;
	                                    // Special tracking for one touch
	                                    _track({ 'status': 'IC_RENDER' });
	                                }
	                            }
	
	                            // Inject CSS in the <head>
	                            if (data.popupCss) {
	                                var styleEl = document.createElement('style');
	
	                                styleEl.type = 'text/css';
	
	                                if (styleEl.stylesheet) {
	                                    styleEl.stylesheet.cssText = data.popupCss;
	                                } else {
	                                    styleEl.appendChild(document.createTextNode(data.popupCss));
	                                }
	
	                                document.getElementsByTagName('head')[0].appendChild(styleEl);
	                            }
	
	                            // An app wants to destroy the mini-browser or lightbox and if (url == originalCancelUrl) redirect to returnUrl
	                            if (data.updateParent && config.returnUrl) {
	
	                                if (msg) {
	                                    msg.innerHTML = constants.CONTENT_LOADING;
	                                }
	
	                                data.cancelUrl = null;
	
	                                if (config.lightboxOpened && config.popupOpened) {
	                                    _sendCloseEvent(config.name);
	                                } else {
	                                    _destroy();
	                                }
	                            }
	
	                            // If an EC token wasn't distinctly set, grab it from the landingUrl
	                            if (!ecToken && config.landingUrl) {
	                                ecToken = getECToken(config.landingUrl);
	
	                                // logging for non-ajax case
	                                _track({
	                                    status: 'IC_CLICK_OPEN_MB_SUCCESS_NON_AJAX'
	                                });
	                            }
	
	                            config.content = config.content || {};
	                        }
	                    });
	                } else {
	                    _log(constants.ERROR_MESSAGES.POSTMESSAGE_INVALID_ORIGIN);
	                }
	            }
	
	            function getUrlPrefix() {
	                if (config.urlPrefix) {
	                    return config.urlPrefix;
	                } else if (config.sandBox) {
	                    return constants.SANDBOX_URL_PREFIX;
	                } else {
	                    return constants.LIVE_URL_PREFIX;
	                }
	            }
	
	            /**
	             * Detects if the browser is MiniBrowser eligible.
	             * @param {none}
	             * @returns {boolean} true if eligible
	             */
	            function _isICEligible() {
	                var userAgent = navigator.userAgent.toLowerCase();
	
	                config.isSmartPhone = device.isDevice(userAgent);
	                config.isWebView = device.isWebView(userAgent);
	
	                if (typeof config.currentAgent === 'object' && config.currentAgent.length === 2) {
	                    if (parseFloat(config.currentAgent[1]) < constants.SUPPORTED_AGENTS[config.currentAgent[0]]) {
	                        _track({
	                            status: 'IC_ELIGIBLITY_BROWSER_NOT_SUPPORTED',
	                            browser: config.currentAgent[0],
	                            browserversion: config.currentAgent[1]
	                        });
	                        return false;
	                    }
	                }
	
	                return !(config.isSmartPhone || config.isWebView || config.oldIe);
	            }
	
	            /**
	             * Renders the initial checkout flow on the page
	             * Basically an init function
	             */
	            function _init() {
	
	                window.name = window.name === config.name ? '' : window.name;
	
	                var gOldOnError = window.onerror;
	                // Override previous handler.
	                window.onerror = function errorHandler(errorMsg, url, lineNumber, columnNumber, err) {
	                    var message = (err && err.message) ? err.message : errorMsg;
	                    if (config.debug === 'true') {
	                        _track({
	                            status: 'IC_WINDOW_ERROR',
	                            errmsg: message,
	                            url: url
	                        }, true);
	                    }
	
	                    if (gOldOnError) {
	                        return gOldOnError(errorMsg, url, lineNumber, columnNumber, err);
	                    }
	                    return false;
	                };
	
	                // Add event listeners to PayPal trigger elements
	                _setTriggers();
	
	                // Do nothing if the device/browser is not eligible for in-context experience
	                if (!_isICEligible()) {
	                    config.showMiniB = false;
	                    return;
	                }
	
	                var iframes = new IframeFactory(_track);
	
	                if (config.needsIframeBridge) {
	                    // SetUp PayPal Bridge
	                    iframes.bridge(config);
	                }
	
	                // Setup a handler for all postMessage events for all incontext use cases
	                _setupPostMessageHandler();
	
	                // Setup handlers for post robot lifecycle events (init, popup opened, return, closed, etc.)
	                _setupPostRobotHandler();
	
	                // Determine if a user is eligible for the lightbox (fully logged in or onetouch enabled)
	                lightbox.isEligible(config);
	
	                // Determine if third-party cookies are enabled (for lightbox)
	                iframes.thirdParty(config);
	
	                // Setup prefetch iframe
	                iframes.prefetch(config);
	            }
	
	            /**
	             *   Create Javascript buttons if needed based on merchant's setup and then initialize
	             */
	            function _initWithButtonGeneration() {
	                btnList = buttonGenerator(config, jsBtnConfigs, btnList);
	
	                _track({
	                    status: 'IC_SETUP',
	                    'button-type': config.button ? 'STATIC' : 'JS',
	                    'button-number': btnList.length
	                });
	
	                _init();
	
	                // to ensure users not able to click static buttons before script is loaded
	                var hideBtns = document.querySelectorAll('.' + constants.STATIC_BUTTON_HIDDEN_STYLE);
	                var hideBtnsLength = hideBtns.length;
	                for (var k = 0; k < hideBtnsLength; k++) {
	                    hideBtns[k].className = hideBtns[k].className.replace(constants.STATIC_BUTTON_HIDDEN_STYLE, '');
	                }
	            }
	
	            function _requireLoadButtonJS() {
	                if (window.paypal.button && window.paypal.button.create) { // eslint-disable-line no-undef
	                    return false;
	                }
	
	                var merchantConfig = config.merchantConfig,
	                    btnListConfig = merchantConfig.buttons;
	
	                if (btnListConfig && btnListConfig.length) {
	                    for (var i in btnListConfig) {
	                        if (btnListConfig[i].container) {
	                            return true;
	                        }
	                    }
	                } else if (merchantConfig && merchantConfig.container) {
	                    return true;
	                }
	
	                return false;
	            }
	
	            function _checkConditionAndLog(testValue, errorValue, errorStatus) {
	                var verdict = (testValue === errorValue);
	                if (verdict) {
	                    _log(constants.ERROR_MESSAGES[errorStatus]);
	                    _track({
	                        status: errorStatus,
	                        error_msg: constants.ERROR_MESSAGES[errorStatus]
	                    });
	                }
	                return verdict;
	            }
	
	            /**
	             * Clear body class of the merchant website when user closes lightbox/miniBrowser / returns back to the merchant
	             * @param {string} className which is equal to the Mini browser name, e.g PPFrameac5f5777
	             */
	            function _clearBodyIframeClass(className) {
	                document.body.className = document.body.className.replace(className, '');
	            }
	
	            /**
	             * Send close event to an iframe when user closes lightbox/miniBrowser / returns back to the merchant
	             * Note: miniBrowser doesn't send a close message back to the parent,
	             * so no need of postRobot.on('close'). Also miniBrowser sends back an error if CAN_CLOSE_SELF set to false,
	             * but all we need is just destroy the window.
	             * @param {string} Mini browser name, e.g PPFrameac5f5777
	             */
	            function _sendCloseEvent(name) {
	                postRobot.send(name + 'frame', 'close', function () {
	                    _destroy();
	                });
	            }
	
	            /** PUBLIC **/
	            // paypal.checkout.setup(merchant, {
	            //    container: 'myContainer',          // {String|HTMLElement|Array} Optional. `submit` and `click` events are hijacked when possible.
	            //    button: 'myButton',                // {String|HTMLElement|Array} Optional. HTMLElement/ID of a custom buttom.
	            //    locale: 'en_US',                   // {String} Optional. Local code for localization. Defaults to 'en_US'
	            //    environment: 'production',         // {String} Optional. Defaults to 'production'. Possible options are 'sandbox'.
	            //    app: 'hermes'                      // {String} Optional. Defaults to 'hermes'.  Possible options are 'xoonboarding'.
	            //    click: function() {}               // {Function} Optional. Overrides the behavior when the button is clicked.
	            //    condition: function() {}          // {Function} Optional. Boolean if the PayPal popup should when button is clicked.
	            // });
	            app.setup = function (merchantId, merchantConfig) {
	
	                // allow passing just an object in,
	                // use merchantID option if passed in config
	                if (!merchantConfig && typeof merchantId === 'object') {
	                    merchantConfig = merchantId;
	                    merchantId = merchantConfig.merchantID;
	                }
	
	                // update constants with app name specified
	                var configApp = merchantConfig.app || constants.APP;
	                for (var key in constants) {
	                    if (constants.hasOwnProperty(key) && constants[key].indexOf && constants[key].indexOf('{{app}}') > -1) {
	                        constants[key] = constants[key].replace('{{app}}', configApp);
	                    }
	                }
	
	                /*if (_checkConditionAndLog(setupCalled, true, 'IC_SETUP_CALLED_TWICE')) {
	                    return;
	                }*/
	
	                config.guid = guid.getGUID();
	                config.frameGuid = config.guid.substring(0, 8);
	                config.name += config.frameGuid;
	                config.merchantID = merchantId;
	                config.locale = merchantConfig.locale || config.locale;
	                config.async = !!merchantConfig.async;
	               
	                config.bridgeUrl = merchantConfig.bridgeUrl;
	                config.domain = merchantConfig.domain;
	
	                if (_checkConditionAndLog(!merchantId, true, 'IC_SETUP_MERCHANTID_ERROR')) {
	                    return;
	                }
	
	                config.merchantConfig = merchantConfig;
	                config.sandBox = merchantConfig.environment === 'sandbox' ? true : false;
	                config.forceLightboxDisabled = merchantConfig.forceLightboxDisabled;
	
	                if (config.sandBox) {
	                    _log(constants.ERROR_MESSAGES.SANDBOX_BANNER);
	                }
	
	                app.urlPrefix = getUrlPrefix();
	
	                // (Backwards compatibility) Adding "urlPrefix" to the global namespace for merchants from the past using internal APIS :|
	                addToNamespace({
	                    urlPrefix: app.urlPrefix,
	                    events: xoEmitter
	                });
	
	                requireBtnJs = _requireLoadButtonJS();
	
	                if (requireBtnJs) {
	                    // fetch button.js
	                    loadScript(constants.BUTTON_JS_URL, _initWithButtonGeneration);
	                } else {
	                    _initWithButtonGeneration();
	                }
	
	                // init mask
	                mask = new Mask(config.name);
	
	                // note that setup was called
	                setupCalled = true;
	            };
	
	            /**
	             * Public method to init the XO flow manually for ASYNC AJAX flow
	             * This method need to be called before AJAX call is being made on merchant site
	             * @param {null}
	             */
	            app.initXO = function () {
	                // For non IC eligible browsers load the url in the same window
	                if (!_isICEligible() || !config.showMiniB) {
	                    return;
	                }
	                _checkConditionAndLog(setupCalled, false, 'IC_INITXO_CALLED_BEFORE_SETUP');
	                config.win = _render();
	            };
	
	            /**
	             * Public method to start the flow manually, e.g. from Flash
	             * @param {string} url or token of the landing page that needs to be loaded in mini browser
	             */
	            app.startFlow = function (url, opts) {
	                _checkConditionAndLog(setupCalled, false, 'IC_STARTFLOW_CALLED_BEFORE_SETUP');
	                ownPropertyShim();
	
	                if (!url || typeof url === 'object') {
	                    // if mini browser already opens and url is not passed or caused by clicking on mask, then it is a restart
	                    return;
	                }
	
	                // allow override of config options when flow is started
	                // does this need to be guarded at all? only set config
	                // options originally in merchantConfig?
	                if (opts) {
	                    for (var key in opts) {
	                        if (opts.hasOwnProperty(key)) {
	                            config[key] = opts[key];
	                        }
	                    }
	                }
	
	                url = url || config.landingUrl;
	
	                // url can be either an url or token
	                // if token is passed in
	                if (url && url.toLowerCase && url.toLowerCase().indexOf('ec-') === 0) {
	                    url = app.urlPrefix + url;
	                }
	
	                if (url && url.match(/\.paypal\.com/i)) {
	                    config.fromStartFlow = true;
	                }
	
	                if (url) {
	                    url = url.replace(/\s+$/, '');
	                }
	
	                try {
	                    ecToken = getECToken(url);
	                } catch (err) {
	                    _log(constants.ERROR_MESSAGES.MISSING_EC_TOKEN);
	                }
	
	                // For non IC eligible browsers load the url in the same window
	                if (!_isICEligible() || !config.showMiniB) {
	                    if (url) {
	                        location.href = url;
	                    } else {
	                        window.name = config.name;
	                    }
	                    return;
	                }
	
	                var win = config.win || _render();
	
	                // If Mini browser is blocked by popup blocker assign the user to full context as fallback (legacy integrations)
	                win = win || window;
	
	                // If already Mini browser window is opened and changing the name in cross domain throws permission denied exception
	                try {
	                    // only name the window if the win is not full context
	                    // otherwise apps will detect they are incontext 
	                    if (win !== window) {
	                        win.name = win.name || config.name;
	                    }
	                } catch (err) {
	                    _log(constants.ERROR_MESSAGES.MINI_BROWSER_ALREADY_OPEN);
	                }
	
	                if (url) {
	                    // only do this if url present and matching pp.
	                    if (url.match(/\.paypal\.com/i)) {
	                        if (config.prefetchLoaded) {
	                            url += '&prefetch=1';
	                        }
	                        if (config.cookieCheckLoaded) {
	                            url += '&cookie_check=1';
	                        }
	                    }
	                    if (win.location) {
	                        win.location = url;
	                    } else {
	                        win.src = url;
	                    }
	                }
	
	                // for async ajax case.
	                if (config.win) {
	                    _track({
	                        status: 'IC_CLICK_OPEN_MB_SUCCESS_ASYNC_AJAX'
	                    });
	                }
	            };
	
	            /**
	             * Public method to close the flow's UI
	             */
	            app.closeFlow = function (successUrl) {
	                _destroy();
	                if (successUrl) {
	                    top.location.href = successUrl;
	                }
	            };
	
	            // Return public methods
	            return app;
	        }());
	
	        // Expose global namespace
	        addToNamespace({
	            initXO: paypal.checkout.initXO,
	            startFlow: paypal.checkout.startFlow,
	            closeFlow: paypal.checkout.closeFlow,
	            restartFlow: paypal.checkout.startFlow,
	            setup: paypal.checkout.setup
	        });
	
	        // If the merchant defined a paypalCheckoutReady function,
	        // set it to run after window load
	        ready(function () {
	            if (typeof window.paypalCheckoutReady === 'function') {
	                window.paypalCheckoutReady();
	            }
	        });
	
	
	    }());
	
	
      return window.paypal;
	};


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	!function(e,t){ true?module.exports=t():"function"==typeof define&&define.amd?define("postRobot",[],t):"object"==typeof exports?exports.postRobot=t():e.postRobot=t()}(this,function(){return function(e){function t(r){if(n[r])return n[r].exports;var o=n[r]={exports:{},id:r,loaded:!1};return e[r].call(o.exports,o,o.exports,t),o.loaded=!0,o.exports}var n={};return t.m=e,t.c=n,t.p="",t(0)}([function(e,t,n){"use strict";function r(){(0,a.registerGlobals)(),u.util.debug("ID",(0,i.getWindowID)()),u.util.listen(window,"message",s.messageListener),u.childWindows.register((0,i.getWindowID)(),window,u.util.getType()),(0,u.propagate)((0,i.getWindowID)())}Object.defineProperty(t,"__esModule",{value:!0});var o=n(1);Object.keys(o).forEach(function(e){"default"!==e&&Object.defineProperty(t,e,{enumerable:!0,get:function(){return o[e]}})});var i=n(3),u=n(13),s=n(11),a=n(15);r(),t["default"]=e.exports},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.util=t.openBridge=t.reset=t.parent=void 0;var r=n(2);Object.keys(r).forEach(function(e){"default"!==e&&Object.defineProperty(t,e,{enumerable:!0,get:function(){return r[e]}})});var o=n(23);Object.keys(o).forEach(function(e){"default"!==e&&Object.defineProperty(t,e,{enumerable:!0,get:function(){return o[e]}})});var i=n(24);Object.keys(i).forEach(function(e){"default"!==e&&Object.defineProperty(t,e,{enumerable:!0,get:function(){return i[e]}})});var u=n(25);Object.keys(u).forEach(function(e){"default"!==e&&Object.defineProperty(t,e,{enumerable:!0,get:function(){return u[e]}})});var s=n(11);Object.defineProperty(t,"reset",{enumerable:!0,get:function(){return s.resetListeners}});var a=n(16);Object.defineProperty(t,"openBridge",{enumerable:!0,get:function(){return a.openBridge}});var c=n(7);Object.defineProperty(t,"util",{enumerable:!0,get:function(){return c.util}});t.parent=c.util.getParent()},function(e,t,n){"use strict";function r(e){return a.promise.nodeify(new a.promise.Promise(function(t,n){if(!e.name)throw new Error("Expected options.name");if(!e.window)throw new Error("Expected options.window");if(u.CONFIG.MOCK_MODE)e.window=window;else if("string"==typeof e.window){var r=document.getElementById(e.window);if(!r)throw new Error("Expected options.window "+e.window+" to be a valid element id");if("iframe"!==r.tagName.toLowerCase())throw new Error("Expected options.window "+e.window+" to be an iframe");if(e.window=r.contentWindow,!e.window)throw new Error("Expected options.window")}var o=e.name+"_"+a.util.uniqueID();if(s.listeners.response[o]=e,e.window.closed)throw new Error("Target window is closed");e.timeout&&setTimeout(function(){return n(new Error("Post message response timed out after "+e.timeout+" ms"))},e.timeout),e.respond=function(e,r){return e?n(e):t(r)},(0,s.sendMessage)(e.window,{hash:o,type:u.CONSTANTS.POST_MESSAGE_TYPE.REQUEST,name:e.name,data:e.data||{}})["catch"](n),setTimeout(function(){return e.ack?void 0:n(new Error("No ack for postMessage "+e.name))},u.CONFIG.ACK_TIMEOUT)}),e.callback)}function o(e,t,n,o){return!o&&n instanceof Function&&(o=n,n={}),r({window:e,name:t,data:n,callback:o})}function i(e,t,n){if(!a.util.getParent())throw new Error("Window does not have a parent");return o(a.util.getParent(),e,t,n)}Object.defineProperty(t,"__esModule",{value:!0}),t.request=r,t.send=o,t.sendToParent=i;var u=n(3),s=n(11),a=n(13)},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(4);Object.keys(r).forEach(function(e){"default"!==e&&Object.defineProperty(t,e,{enumerable:!0,get:function(){return r[e]}})});var o=n(5);Object.keys(o).forEach(function(e){"default"!==e&&Object.defineProperty(t,e,{enumerable:!0,get:function(){return o[e]}})});var i=n(6);Object.keys(i).forEach(function(e){"default"!==e&&Object.defineProperty(t,e,{enumerable:!0,get:function(){return i[e]}})})},function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.CONFIG={ALLOW_POSTMESSAGE_POPUP:!0,DEBUG:!1,ACK_TIMEOUT:3e3,LOG_TO_PAGE:!1,MOCK_MODE:!1}},function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.CONSTANTS={POST_MESSAGE_TYPE:{REQUEST:"postrobot_message_request",RESPONSE:"postrobot_message_response",ACK:"postrobot_message_ack"},POST_MESSAGE_ACK:{SUCCESS:"success",ERROR:"error"},POST_MESSAGE_NAMES:{IDENTIFY:"identify"},WINDOW_TYPES:{FULLPAGE:"fullpage",POPUP:"popup",IFRAME:"iframe"},WINDOW_PROPS:{POSTROBOT:"__postRobot__"}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getWindowID=void 0;var r=n(7);t.getWindowID=r.util.memoize(function(){return window.name||r.util.uniqueID()})},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.util=void 0;var r=n(3),o=n(8),i=t.util={isPopup:function(){return Boolean(window.opener)},isIframe:function(){return Boolean(window.parent&&window!==window.parent)},isFullpage:function(){return Boolean(!i.isIframe()&&!i.isPopup())},windowReady:new o.promise.Promise(function(e,t){return"complete"===document.readyState?e():void window.addEventListener("load",e)}),getType:function(){return i.isPopup()?r.CONSTANTS.WINDOW_TYPES.POPUP:i.isIframe()?r.CONSTANTS.WINDOW_TYPES.IFRAME:r.CONSTANTS.WINDOW_TYPES.FULLPAGE},once:function(e){if(!e)return e;var t=!1;return function(){return t?void 0:(t=!0,e.apply(this,arguments))}},getParent:function(){return i.isPopup()?window.opener:i.isIframe()?window.parent:void 0},eachParent:function(e,t){var n=window;for(t&&e(window);;){var r=n.opener||n.parent;if(n===r)return;n=r,e(n)}},eachFrame:function(e,t){for(var n=0;n<e.frames.length;n++){var r=void 0;try{r=e.frames[n]}catch(o){continue}t(r)}},noop:function(){},getDomain:function(){return window.location.host},clearLogs:function(){if(window.console&&window.console.clear&&window.console.clear(),r.CONFIG.LOG_TO_PAGE){var e=document.getElementById("postRobotLogs");e&&e.parentNode.removeChild(e)}},writeToPage:function(e,t){setTimeout(function(){var n=document.getElementById("postRobotLogs");n||(n=document.createElement("div"),n.id="postRobotLogs",n.style.cssText="width: 800px; font-family: monospace; white-space: pre-wrap;",document.body.appendChild(n));var r=document.createElement("div"),o=(new Date).toString().split(" ")[4],u=i.map(t,function(e){if("string"==typeof e)return e;if(!e)return toString.call(e);var t=void 0;try{t=JSON.stringify(e,0,2)}catch(n){t="[object]"}return"\n\n"+t+"\n\n"}).join(" "),s=o+" "+e+" "+u;r.innerHTML=s;var a={log:"#ddd",warn:"orange",error:"red",info:"blue",debug:"#aaa"}[e];r.style.cssText="margin-top: 10px; color: "+a+";",n.childNodes.length?n.insertBefore(r,n.childNodes[0]):n.appendChild(r)})},logLevel:function(e,t){t=Array.prototype.slice.call(t),t.unshift(i.getDomain()),t.unshift(i.getType().toLowerCase()),t.unshift("[post-robot]"),r.CONFIG.LOG_TO_PAGE&&i.writeToPage(e,t),window.console&&(window.console[e]||(e="log"),window.console[e]&&window.console[e].apply(window.console,t))},log:function(){i.logLevel("info",arguments)},debug:function(){r.CONFIG.DEBUG&&i.logLevel("debug",arguments)},debugError:function(){r.CONFIG.DEBUG&&i.logLevel("error",arguments)},safeHasProp:function(e,t){try{return!!e[t]}catch(n){return!1}},warn:function(){i.logLevel("warn",arguments)},error:function(){i.logLevel("error",arguments)},listen:function(e,t,n){return e.addEventListener?e.addEventListener(t,n):e.attachEvent("on"+t,n),{cancel:function(){e.removeEventListener?e.removeEventListener(t,n):e.detachEvent("on"+t,n)}}},apply:function(e,t,n){return e.apply instanceof Function?e.apply(t,n):e(n[0],n[1],n[2],n[3],n[4],n[5],n[6],n[7],n[8],n[9])},find:function(e,t,n){if(!e)return n;for(var r=0;r<e.length;r++)if(t(e[r]))return e[r];return n},map:function(e,t){for(var n=[],r=0;r<e.length;r++)n.push(t(e[r]));return n},some:function(e,t){t=t||Boolean;for(var n=0;n<e.length;n++)if(t(e[n]))return!0;return!1},keys:function(e){var t=[];for(var n in e)e.hasOwnProperty(n)&&t.push(n);return t},values:function(e){var t=[];for(var n in e)e.hasOwnProperty(n)&&t.push(e[n]);return t},getByValue:function(e,t){for(var n in e)if(e.hasOwnProperty(n)&&e[n]===t)return n},uniqueID:function(){var e="0123456789abcdef";return"xxxxxxxxxx".replace(/./g,function(){return e.charAt(Math.floor(Math.random()*e.length))})},isFrameOwnedBy:function(e,t){try{return t.parent===e}catch(n){try{for(var r=0;r<e.frames.length;r++)if(e.frames[r]===t)return!0}catch(o){return!1}}return!1},memoize:function(e){var t={};return function(){var n=JSON.stringify(Array.prototype.slice.call(arguments));return t.hasOwnProperty(n)||(t[n]=e.apply(this,arguments)),t[n]}}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.promise=void 0;var r=n(9),o=t.promise={get Promise(){return window.Promise?window.Promise:r.Promise},asyncPromise:function(e){return new o.Promise(function(t,n){setTimeout(function(){try{return e(t,n)}catch(r){return n(r)}})})},run:function(e){return o.Promise.resolve().then(e)},method:function(e){return function(){var t=this,n=arguments;return o.Promise.resolve().then(function(){return e.apply(t,n)})}},nodeify:function(e,t){return t?void e.then(function(e){t(null,e)},function(e){t(e)}):e}}},function(e,t,n){var r;(function(o,i){/*!
		 * @overview es6-promise - a tiny implementation of Promises/A+.
		 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
		 * @license   Licensed under MIT license
		 *            See https://raw.githubusercontent.com/jakearchibald/es6-promise/master/LICENSE
		 * @version   2.0.1
		 */
	(function(){function u(e,t){W[C]=e,W[C+1]=t,C+=2,2===C&&A()}function s(e){return"function"==typeof e}function a(){return function(){o.nextTick(l)}}function c(){var e=0,t=new j(l),n=document.createTextNode("");return t.observe(n,{characterData:!0}),function(){n.data=e=++e%2}}function f(){var e=new MessageChannel;return e.port1.onmessage=l,function(){e.port2.postMessage(0)}}function d(){return function(){setTimeout(l,1)}}function l(){for(var e=0;C>e;e+=2)(0,W[e])(W[e+1]),W[e]=void 0,W[e+1]=void 0;C=0}function p(){}function w(e,t,n,r){try{e.call(t,n,r)}catch(o){return o}}function h(e,t,n){u(function(e){var r=!1,o=w(n,t,function(n){r||(r=!0,t!==n?g(e,n):S(e,n))},function(t){r||(r=!0,v(e,t))});!r&&o&&(r=!0,v(e,o))},e)}function O(e,t){1===t.a?S(e,t.b):2===e.a?v(e,t.b):m(t,void 0,function(t){g(e,t)},function(t){v(e,t)})}function g(e,t){if(e===t)v(e,new TypeError("You cannot resolve a promise with itself"));else if("function"==typeof t||"object"==typeof t&&null!==t)if(t.constructor===e.constructor)O(e,t);else{var n;try{n=t.then}catch(r){R.error=r,n=R}n===R?v(e,R.error):void 0===n?S(e,t):s(n)?h(e,t,n):S(e,t)}else S(e,t)}function E(e){e.f&&e.f(e.b),y(e)}function S(e,t){void 0===e.a&&(e.b=t,e.a=1,0!==e.e.length&&u(y,e))}function v(e,t){void 0===e.a&&(e.a=2,e.b=t,u(E,e))}function m(e,t,n,r){var o=e.e,i=o.length;e.f=null,o[i]=t,o[i+1]=n,o[i+2]=r,0===i&&e.a&&u(y,e)}function y(e){var t=e.e,n=e.a;if(0!==t.length){for(var r,o,i=e.b,u=0;u<t.length;u+=3)r=t[u],o=t[u+n],r?P(n,r,o,i):o(i);e.e.length=0}}function T(){this.error=null}function P(e,t,n,r){var o,i,u,a,c=s(n);if(c){try{o=n(r)}catch(f){G.error=f,o=G}if(o===G?(a=!0,i=o.error,o=null):u=!0,t===o)return void v(t,new TypeError("A promises callback cannot return that same promise."))}else o=r,u=!0;void 0===t.a&&(c&&u?g(t,o):a?v(t,i):1===e?S(t,o):2===e&&v(t,o))}function b(e,t){try{t(function(t){g(e,t)},function(t){v(e,t)})}catch(n){v(e,n)}}function _(e,t,n,r){this.n=e,this.c=new e(p,r),this.i=n,this.o(t)?(this.m=t,this.d=this.length=t.length,this.l(),0===this.length?S(this.c,this.b):(this.length=this.length||0,this.k(),0===this.d&&S(this.c,this.b))):v(this.c,this.p())}function N(e){if(D++,this.b=this.a=void 0,this.e=[],p!==e){if(!s(e))throw new TypeError("You must pass a resolver function as the first argument to the promise constructor");if(!(this instanceof N))throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");b(this,e)}}var A,M=Array.isArray?Array.isArray:function(e){return"[object Array]"===Object.prototype.toString.call(e)},C=0,I="undefined"!=typeof window?window:{},j=I.MutationObserver||I.WebKitMutationObserver,I="undefined"!=typeof Uint8ClampedArray&&"undefined"!=typeof importScripts&&"undefined"!=typeof MessageChannel,W=Array(1e3);A="undefined"!=typeof o&&"[object process]"==={}.toString.call(o)?a():j?c():I?f():d();var R=new T,G=new T;_.prototype.o=function(e){return M(e)},_.prototype.p=function(){return Error("Array Methods must be provided an Array")},_.prototype.l=function(){this.b=Array(this.length)},_.prototype.k=function(){for(var e=this.length,t=this.c,n=this.m,r=0;void 0===t.a&&e>r;r++)this.j(n[r],r)},_.prototype.j=function(e,t){var n=this.n;"object"==typeof e&&null!==e?e.constructor===n&&void 0!==e.a?(e.f=null,this.g(e.a,t,e.b)):this.q(n.resolve(e),t):(this.d--,this.b[t]=this.h(e))},_.prototype.g=function(e,t,n){var r=this.c;void 0===r.a&&(this.d--,this.i&&2===e?v(r,n):this.b[t]=this.h(n)),0===this.d&&S(r,this.b)},_.prototype.h=function(e){return e},_.prototype.q=function(e,t){var n=this;m(e,void 0,function(e){n.g(1,t,e)},function(e){n.g(2,t,e)})};var D=0;N.all=function(e,t){return new _(this,e,!0,t).c},N.race=function(e,t){function n(e){g(o,e)}function r(e){v(o,e)}var o=new this(p,t);if(!M(e))return v(o,new TypeError("You must pass an array to race.")),o;for(var i=e.length,u=0;void 0===o.a&&i>u;u++)m(this.resolve(e[u]),void 0,n,r);return o},N.resolve=function(e,t){if(e&&"object"==typeof e&&e.constructor===this)return e;var n=new this(p,t);return g(n,e),n},N.reject=function(e,t){var n=new this(p,t);return v(n,e),n},N.prototype={constructor:N,then:function(e,t){var n=this.a;if(1===n&&!e||2===n&&!t)return this;var r=new this.constructor(p),o=this.b;if(n){var i=arguments[n-1];u(function(){P(n,r,i,o)})}else m(this,r,e,t);return r},"catch":function(e){return this.then(null,e)}};var x={Promise:N,polyfill:function(){var e;e="undefined"!=typeof i?i:"undefined"!=typeof window&&window.document?window:self,"Promise"in e&&"resolve"in e.Promise&&"reject"in e.Promise&&"all"in e.Promise&&"race"in e.Promise&&function(){var t;return new e.Promise(function(e){t=e}),s(t)}()||(e.Promise=N)}};r=function(){return x}.call(t,n,t,e),!(void 0!==r&&(e.exports=r))}).call(this)}).call(t,n(10),function(){return this}())},function(e,t){function n(){c=!1,u.length?a=u.concat(a):f=-1,a.length&&r()}function r(){if(!c){var e=setTimeout(n);c=!0;for(var t=a.length;t;){for(u=a,a=[];++f<t;)u&&u[f].run();f=-1,t=a.length}u=null,c=!1,clearTimeout(e)}}function o(e,t){this.fun=e,this.array=t}function i(){}var u,s=e.exports={},a=[],c=!1,f=-1;s.nextTick=function(e){var t=new Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)t[n-1]=arguments[n];a.push(new o(e,t)),1!==a.length||c||setTimeout(r,0)},o.prototype.run=function(){this.fun.apply(null,this.array)},s.title="browser",s.browser=!0,s.env={},s.argv=[],s.version="",s.versions={},s.on=i,s.addListener=i,s.once=i,s.off=i,s.removeListener=i,s.removeAllListeners=i,s.emit=i,s.binding=function(e){throw new Error("process.binding is not supported")},s.cwd=function(){return"/"},s.chdir=function(e){throw new Error("process.chdir is not supported")},s.umask=function(){return 0}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(12);Object.keys(r).forEach(function(e){"default"!==e&&Object.defineProperty(t,e,{enumerable:!0,get:function(){return r[e]}})});var o=n(19);Object.keys(o).forEach(function(e){"default"!==e&&Object.defineProperty(t,e,{enumerable:!0,get:function(){return o[e]}})});var i=n(21);Object.keys(i).forEach(function(e){"default"!==e&&Object.defineProperty(t,e,{enumerable:!0,get:function(){return i[e]}})})},function(e,t,n){"use strict";function r(e){try{e=JSON.parse(e)}catch(t){return}if(e.type&&l.RECEIVE_MESSAGE_TYPES[e.type])return e}function o(e,t){if(!s.CONFIG.MOCK_MODE&&t&&(t.type!==s.CONSTANTS.POST_MESSAGE_TYPE.REQUEST||!t.name||!d.listeners.request[t.name]||d.listeners.request[t.name].proxy!==!1)){var n=(t.type===s.CONSTANTS.POST_MESSAGE_TYPE.REQUEST||t.type===s.CONSTANTS.POST_MESSAGE_TYPE.ACK)&&d.listeners.response[t.hash];if(!n)for(var r=0;r<d.listeners.proxies.length;r++){var o=d.listeners.proxies[r];if(e===o.from)return o.to}if("parent.opener"===t.target){var i=void 0;try{i=window.parent.opener}catch(u){throw new Error("Can not get window.parent.opener to proxy to")}if(!i)throw new Error("Can not get window.parent.opener to proxy to");return i}if(t.target&&t.target!==(0,s.getWindowID)()){var c=a.childWindows.getWindowById(t.target);if(!c)throw new Error("Unable to find window to proxy message to: "+t.target);return c}}}function i(e,t){var n=r(t);if(n&&-1===p.indexOf(n.id)){p.push(n.id),a.childWindows.register(n.source,e,n.windowType);var i=o(e,n);return i?(delete n.target,(0,f.sendMessage)(i,n,!0)):(a.util.log("#receive",n.type,n.name,n),s.CONFIG.MOCK_MODE?l.RECEIVE_MESSAGE_TYPES[n.type](e,n):void l.RECEIVE_MESSAGE_TYPES[n.type](e,n))}}function u(e){var t=e.source||e.sourceElement,n=e.data;(0,c.emulateIERestrictions)(t,window),i(t,n)}Object.defineProperty(t,"__esModule",{value:!0}),t.receiveMessage=i,t.messageListener=u;var s=n(3),a=n(13),c=n(15),f=n(19),d=n(21),l=n(22),p=[]},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(8);Object.keys(r).forEach(function(e){"default"!==e&&Object.defineProperty(t,e,{enumerable:!0,get:function(){return r[e]}})});var o=n(7);Object.keys(o).forEach(function(e){"default"!==e&&Object.defineProperty(t,e,{enumerable:!0,get:function(){return o[e]}})});var i=n(14);Object.keys(i).forEach(function(e){"default"!==e&&Object.defineProperty(t,e,{enumerable:!0,get:function(){return i[e]}})})},function(e,t,n){"use strict";function r(e,t){return u.util.find(a,function(n){return n[e]===t},{})}function o(e){function t(t,r){t&&t!==window&&-1===n.indexOf(t)&&(u.util.debug("propagating to",r,t),n.push(t),u.util.safeHasProp(t,i.CONSTANTS.WINDOW_PROPS.POSTROBOT)?t[i.CONSTANTS.WINDOW_PROPS.POSTROBOT].registerSelf(e,window,u.util.getType()):(0,s.send)(t,i.CONSTANTS.POST_MESSAGE_NAMES.IDENTIFY,{id:e,type:u.util.getType()}).then(function(e){c.register(e.id,t,e.type)},function(e){u.util.debugError("Error sending identify:",e.stack||e.toString())}))}(0,s.on)(i.CONSTANTS.POST_MESSAGE_NAMES.IDENTIFY,function(t,n,r){return t?void 0:{id:e}});var n=[];u.util.eachParent(function(e){t(e,"parent"),u.util.eachFrame(e,function(e){t(e,"frame")})},!0)}Object.defineProperty(t,"__esModule",{value:!0}),t.childWindows=void 0,t.propagate=o;var i=n(3),u=n(13),s=n(1),a=[],c=t.childWindows={getWindowId:function(e){return r("win",e).id},getWindowById:function(e){return r("id",e).win},getWindowType:function(e){var t=r("win",e);if(t&&t.type)return t.type;if(u.util.safeHasProp(e,"parent")&&e.parent!==e)return i.CONSTANTS.WINDOW_TYPES.IFRAME;if(u.util.safeHasProp(e,"opener"))return i.CONSTANTS.WINDOW_TYPES.POPUP;var n=u.util.some(a,function(t){return u.util.isFrameOwnedBy(t.win,e)});return n?i.CONSTANTS.WINDOW_TYPES.IFRAME:void 0},register:function(e,t,n){var r=u.util.find(a,function(n){return n.id===e&&n.win===t});r||(u.util.debug("Registering window:",n,e,t),a.push({id:e,win:t,type:n}))}},f=window.open;window.open=function(e,t,n,r){t||(t=u.util.uniqueID(),arguments[1]=t);var o=u.util.apply(f,this,arguments);return c.register(t,o,i.CONSTANTS.WINDOW_TYPES.POPUP),o}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(16);Object.keys(r).forEach(function(e){"default"!==e&&Object.defineProperty(t,e,{enumerable:!0,get:function(){return r[e]}})});var o=n(17);Object.keys(o).forEach(function(e){"default"!==e&&Object.defineProperty(t,e,{enumerable:!0,get:function(){return o[e]}})});var i=n(18);Object.keys(i).forEach(function(e){"default"!==e&&Object.defineProperty(t,e,{enumerable:!0,get:function(){return i[e]}})})},function(e,t,n){"use strict";function r(){return s}function o(e){try{if(!e||!e.frames||!e.frames.length)return;for(var t=0;t<e.frames.length;t++)try{var n=e.frames[t];if(n&&n[i.CONSTANTS.WINDOW_PROPS.POSTROBOT])return n}catch(r){continue}}catch(r){return}}Object.defineProperty(t,"__esModule",{value:!0}),t.openBridge=void 0,t.getBridge=r,t.getBridgeFor=o;var i=n(3),u=n(13),s=void 0;t.openBridge=u.util.memoize(function(e){if(s)throw new Error("Only one bridge supported");return s=new u.promise.Promise(function(t,n){u.util.debug("Opening bridge:",e);var r=document.createElement("iframe");r.setAttribute("id","postRobotBridge"),r.setAttribute("style","margin: 0; padding: 0; border: 0px none; overflow: hidden;"),r.setAttribute("frameborder","0"),r.setAttribute("border","0"),r.setAttribute("scrolling","no"),r.setAttribute("allowTransparency","true"),r.setAttribute("tabindex","-1"),r.setAttribute("hidden","true"),r.setAttribute("title",""),r.setAttribute("role","presentation"),r.onload=function(){return t(r)},r.onerror=n,r.src=e,document.body.appendChild(r)})})},function(e,t,n){"use strict";function r(){if(window[o.CONSTANTS.WINDOW_PROPS.POSTROBOT])throw new Error("Attempting to load postRobot twice on the same window");window[o.CONSTANTS.WINDOW_PROPS.POSTROBOT]={registerSelf:function(e,t,n){i.childWindows.register(e,t,n)},postMessage:i.promise.method(function(e,t){(0,u.receiveMessage)(e,t)}),postMessageParent:i.promise.method(function(e,t){window.parent.postMessage(t,"*")})}}Object.defineProperty(t,"__esModule",{value:!0}),t.registerGlobals=r;var o=n(3),i=n(13),u=n(11)},function(e,t,n){"use strict";function r(e,t){if(!o.CONFIG.ALLOW_POSTMESSAGE_POPUP){var n=i.childWindows.getWindowType(e)===o.CONSTANTS.WINDOW_TYPES.IFRAME&&i.util.isFrameOwnedBy(t,e),r=i.childWindows.getWindowType(t)===o.CONSTANTS.WINDOW_TYPES.IFRAME&&i.util.isFrameOwnedBy(e,t);if(!n&&!r)throw e===window?new Error("Can not send post messages to another window (disabled by config to emulate IE)"):new Error("Can not receive post messages sent from another window (disabled by config to emulate IE)")}}Object.defineProperty(t,"__esModule",{value:!0}),t.emulateIERestrictions=r;var o=n(3),i=n(13)},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.sendMessage=void 0;var r=n(3),o=n(13),i=n(20);t.sendMessage=o.promise.method(function(e,t,n){if(t.id=t.id||o.util.uniqueID(),t.source=(0,r.getWindowID)(),t.originalSource=t.originalSource||(0,r.getWindowID)(),t.windowType=o.util.getType(),t.originalWindowType=t.originalWindowType||o.util.getType(),t.target||(t.target=o.childWindows.getWindowId(e)),o.util.log(n?"#proxy":"#send",t.type,t.name,t),r.CONFIG.MOCK_MODE)return delete t.target,window[r.CONSTANTS.WINDOW_PROPS.POSTROBOT].postMessage(window,JSON.stringify(t));if(e===window)throw new Error("Attemping to send message to self");return o.util.debug("Waiting for window to be ready"),o.util.windowReady.then(function(){return o.util.debug("Running send message strategies",t),o.promise.Promise.all(o.util.map(o.util.keys(i.SEND_MESSAGE_STRATEGIES),function(n){return i.SEND_MESSAGE_STRATEGIES[n](e,t).then(function(){return o.util.debug(n,"success"),!0},function(e){return o.util.debugError(n,"error\n\n",e.stack||e.toString()),!1})})).then(function(e){if(!o.util.some(e))throw new Error("No post-message strategy succeeded")})})})},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.SEND_MESSAGE_STRATEGIES=void 0;var r=n(3),o=n(13),i=n(15);t.SEND_MESSAGE_STRATEGIES={POST_MESSAGE:o.promise.method(function(e,t){return(0,i.emulateIERestrictions)(window,e),e.postMessage(JSON.stringify(t,0,2),"*")}),POST_MESSAGE_GLOBAL_METHOD:o.promise.method(function(e,t){if(!o.util.safeHasProp(e,r.CONSTANTS.WINDOW_PROPS.POSTROBOT))throw new Error("postRobot not found on window");return e[r.CONSTANTS.WINDOW_PROPS.POSTROBOT].postMessage(window,JSON.stringify(t,0,2))}),POST_MESSAGE_UP_THROUGH_BRIDGE:o.promise.method(function(e,t){var n=(0,i.getBridgeFor)(e);if(!n)throw new Error("No bridge available in window");if(!o.util.safeHasProp(n,r.CONSTANTS.WINDOW_PROPS.POSTROBOT))throw new Error("postRobot not installed in bridge");return n[r.CONSTANTS.WINDOW_PROPS.POSTROBOT].postMessageParent(window,JSON.stringify(t,0,2))}),POST_MESSAGE_DOWN_THROUGH_BRIDGE:o.promise.method(function(e,t){var n=(0,i.getBridge)();if(!n)throw new Error("Bridge not initialized");if(e===n.contentWindow)throw new Error("Message target is bridge");if(!t.target){if(e!==window.opener)throw new Error("Can not post message down through bridge without target");t.target="parent.opener"}return n.then(function(e){e.contentWindow.postMessage(JSON.stringify(t,0,2),"*")})})}},function(e,t){"use strict";function n(){t.listeners=r={request:{},response:{},proxies:[]}}Object.defineProperty(t,"__esModule",{value:!0}),t.resetListeners=n;var r=t.listeners=void 0;n()},function(e,t,n){"use strict";function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}Object.defineProperty(t,"__esModule",{value:!0}),t.RECEIVE_MESSAGE_TYPES=void 0;var o,i=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},u=n(3),s=n(13),a=n(19),c=n(21);t.RECEIVE_MESSAGE_TYPES=(o={},r(o,u.CONSTANTS.POST_MESSAGE_TYPE.ACK,function(e,t){var n=c.listeners.response[t.hash];if(!n)throw new Error("No handler found for post message ack for message: "+t.name+" in "+window.location.href);n.ack=!0}),r(o,u.CONSTANTS.POST_MESSAGE_TYPE.REQUEST,function(e,t){function n(n){return(0,a.sendMessage)(e,i({target:t.originalSource?t.originalSource:s.childWindows.getWindowId(e),hash:t.hash,name:t.name},n))["catch"](function(e){if(r)return r.handleError(e);throw e})}var r=c.listeners.request[t.name],o=s.util.once(function(e){return n({type:u.CONSTANTS.POST_MESSAGE_TYPE.RESPONSE,ack:u.CONSTANTS.POST_MESSAGE_ACK.SUCCESS,response:e||{}})}),f=s.util.once(function(e){return n({type:u.CONSTANTS.POST_MESSAGE_TYPE.RESPONSE,ack:u.CONSTANTS.POST_MESSAGE_ACK.ERROR,error:e.stack||e.toString()})});if(!r)return f(new Error("No postmessage request handler for "+t.name+" in "+window.location.href));if(!r.window||!e||r.window===e){n({type:u.CONSTANTS.POST_MESSAGE_TYPE.ACK});var d=void 0;try{d=r.handler(null,t.data,function(e,t){return e?f(e):o(t)})}catch(l){return f(l)}return d&&d.then instanceof Function?d.then(o,f):r.handler.length<=2?o(d):void 0}}),r(o,u.CONSTANTS.POST_MESSAGE_TYPE.RESPONSE,function(e,t){var n=c.listeners.response[t.hash];if(!n)throw new Error("No response handler found for post message response "+t.name+" in "+window.location.href);return delete c.listeners.response[t.hash],t.ack===u.CONSTANTS.POST_MESSAGE_ACK.ERROR?n.respond(t.error):t.ack===u.CONSTANTS.POST_MESSAGE_ACK.SUCCESS?n.respond(null,t.response):void 0}),o)},function(e,t,n){"use strict";function r(e){if(!e.name)throw new Error("Expected options.name");if(a.listeners.request[e.name]&&!e.override&&!u.CONFIG.MOCK_MODE)throw new Error("Post message response handler already registered: "+e.name);if(!e.handler)throw new Error("Expected options.handler");return e.errorHandler=e.errorHandler||s.util.noop,e.once&&(e.handler=s.util.once(e.handler)),a.listeners.request[e.name]=e,e.handleError=function(t){delete a.listeners.request[e.name],e.errorHandler(t)},e.window&&e.errorOnClose&&!function(){var t=setInterval(function(){e.window.closed&&(clearInterval(t),e.handleError(new Error("Post message target window is closed")))},50)}(),{cancel:function(){delete a.listeners.request[e.name]}}}function o(e,t,n,o){return t instanceof Function&&(o=n,n=t,t={}),t.name=e,t.handler=n||t.handler,t.errorHandler=o||t.errorHandler,r(t)}function i(e,t,n,o){return t instanceof Function&&(o=n,n=t,t={}),t.name=e,t.handler=n||t.handler,t.errorHandler=o||t.errorHandler,t.once=!0,r(t)}Object.defineProperty(t,"__esModule",{value:!0}),t.listen=r,t.on=o,t.once=i;var u=n(3),s=n(13),a=n(11)},function(e,t,n){"use strict";function r(e,t){i.listeners.proxies.push({from:e,to:t}),i.listeners.proxies.push({from:t,to:e})}function o(e,t){for(var n=[],r=0;r<i.listeners.proxies.length;r++){var o=i.listeners.proxies[r];(o.to===e&&o.from===t||o.to===t&&o.from===e)&&n.push(o)}for(var u=0;u<n.length;u++)i.listeners.proxies.splice(i.listeners.proxies.indexOf(n[u]),1)}Object.defineProperty(t,"__esModule",{value:!0}),t.proxy=r,t.unproxy=o;var i=n(11)},function(e,t,n){"use strict";function r(){i.CONFIG.MOCK_MODE=!0}function o(){i.CONFIG.MOCK_MODE=!1}Object.defineProperty(t,"__esModule",{value:!0}),t.enableMockMode=r,t.disableMockMode=o;var i=n(3)}])});

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = {
	
	    // Default app for incontext
	    APP: 'hermes',
	
	    // Max time we'll wait for an iframe load
	    LOADING_TIMEOUT: 5000,
	
	    // Bridge
	    BRIDGE_NAME: 'PayPalBridge',
	    BRIDGE_CONTEXT_ROOT: '/webapps/{{app}}/bridge',
	
	    // Prefetch
	    PREFETCH_NAME: 'prefetch',
	    PREFETCH_CONTEXT_ROOT: '/webapps/{{app}}/prefetch',
	
	    // Third-party cookie support
	    COOKIE_CHECK_NAME: 'cookiecheck',
	    COOKIE_CHECK_PATH: '/webapps/{{app}}/cookiecheck',
	
	    // One Touch Auth
	    ONETOUCH_CONTEXT_ROOT: '/webapps/{{app}}/api/auth/onetouch',
	
	    // Classes
	    STATIC_BUTTON_HIDDEN_STYLE: 'paypal-button-hidden',
	
	    // Content
	    CONTENT_CLOSE_WINDOW: 'Close Window',
	    CONTENT_LOADING: 'Loading...',
	    CONTENT_SECURE_WINDOW: 'Don\'t see the secure PayPal browser? We\'ll help you re-launch the window to complete your purchase.',
	    CONTINUE_LINK: '<a class="ppbutton" id="ppICContinue" role="button" tabindex="1" title="Relaunch secure PayPal browser">Continue <span class="frontArrow"></span></a>',
	
	    // Device
	    SUPPORTED_AGENTS: {
	        Chrome: 27,
	        IE: 9,
	        MSIE: 9,
	        Firefox: 30,
	        Safari: 5.1,
	        Opera: 23
	    },
	
	    // Locale
	    DEFAULT_LOCALE: 'en_US',
	
	    // Mini-browser
	    MINI_BROWSER_NAME: 'PPFrame',
	    MINI_BROWSER_HEIGHT: 535,
	    MINI_BROWSER_WIDTH: 450,
	
	    // One touch related
	    ONETOUCH_IFRAME_ID: 'paypalOneTouchIframe',
	    JS_BUTTON_TAGLINE_SPAN_STYLE: 'paypal-button-tag-content',
	
	    // URLs
	    BUTTON_JS_URL: '//www.paypalobjects.com/api/button.js',
	    ONETOUCH_IFRAME_URL: '//www.paypalobjects.com/api/oneTouch.html',
	
	    LIVE_URL_PREFIX: 'https://www.paypal.com/checkoutnow?token=',
	    LIVE_URL_ROOT: 'https://www.paypal.com',
	
	    SANDBOX_URL_PREFIX: 'https://www.sandbox.paypal.com/checkoutnow?token=',
	    SANDBOX_URL_ROOT: 'https://www.sandbox.paypal.com',
	
	    // Templates
	    TEMPLATES: {"incontext":"<div id=\"ppICMask\" class=\"ppICMask mask\"></div><div class=\"<%=(data.error ? \"ppmodal\" : \"ppmodal loading\")%>\" id=\"ppICModal\" tabindex=\"-1\">    <div class=\"pplogo\"></div>    <div id=\"ppmsg\" class=\"message\"><%=data.secureWindow%>    <%=data.continueLink%>    </div>    <a id=\"closeButton\" class=\"closeButton\" role=\"button\" title=\"<%=data.closeWindow%>\" tabindex=\"2\"><%=data.closeWindow%></a>    <%=(data.error ? \"<div class='text'>\" + data.error + \"</div>\" : \"\")%></div>","loading":"<!DOCTYPE html><html lang=\"en\">    <head>        <title>PayPal</title>        <style>            body {                font-family: \"HelveticaNeue\", \"HelveticaNeue-Light\", \"Helvetica Neue Light\", helvetica, arial, sans-serif;                font-size: 95%;                color: #2c2e2f;            }            .spinner {                height: 100%;                width: 100%;                position: absolute;                z-index: 10;                background: red;            }            .spinner.preloader {                position: fixed;                top: 0;                left: 0;                z-index: 1000;                background-color: #fff;            }            .spinner {                height: 100%;                width: 100%;                position: absolute;                z-index: 10;            }            .spinner .spinWrap {                width: 200px;                position: absolute;                top: 50%;                left: 50%;                margin-left: -100px;                height: 48px;                margin-top: -24px;            }            .spinner .loader {                height: 30px;                width: 30px;                position: absolute;                top: 0;                left: 50%;                margin: 0 0 0 -23px;                opacity: 1;                filter: alpha(opacity=100);                background-color: rgba(255, 255, 255, 0.701961);                -webkit-animation: rotation .7s infinite linear;                -moz-animation: rotation .7s infinite linear;                -o-animation: rotation .7s infinite linear;                animation: rotation .7s infinite linear;                border-left: 8px solid rgba(0, 0, 0, 0.2);                border-right: 8px solid rgba(0, 0, 0, 0.2);                border-bottom: 8px solid rgba(0, 0, 0, 0.2);                border-top: 8px solid #2180c0;                border-radius: 100%;            }            .spinner .loadingMessage {                -webkit-box-sizing: border-box;                -moz-box-sizing: border-box;                -ms-box-sizing: border-box;                box-sizing: border-box;                width: 100%;                margin-top: 55px;                text-align: center;                z-index: 100;            }            @-webkit-keyframes rotation {                from {                    -webkit-transform: rotate(0deg);                }                to {                    -webkit-transform: rotate(359deg);                }            }            @-moz-keyframes rotation {                from {                    -moz-transform: rotate(0deg);                }                to {                    -moz-transform: rotate(359deg);                }            }            @-o-keyframes rotation {                from {                    -o-transform: rotate(0deg);                }                to {                    -o-transform: rotate(359deg);                }            }            @keyframes rotation {                from {                    transform: rotate(0deg);                }                to {                    transform: rotate(359deg);                }            }            @media (max-width:30em) and (min-width:0) {                .spinner {                    position: fixed;                }            }        </style>    </head>    <body>        <div id=\"preloaderSpinner\" class=\"preloader spinner\">            <div class=\"spinWrap\">                <p class=\"loader\"></p>                <p class=\"loadingMessage\" id=\"spinnerMessage\"></p>            </div>        </div>    </body></html>"},
	    ERROR_MESSAGES: {
	        IC_SETUP_CALLED_TWICE: 'Error: You are calling paypal.checkout.setup() more than once. This function can only be called once per page load. Any further calls will be ignored.',
	        PAYPAL_GLOBAL_OVERRIDE: 'Error: window.paypal.checkout already exists. You may have inserted the checkout.js script more than once. Ignoring further attempts to assign to window.paypal.checkout.',
	        POSTMESSAGE_INVALID_ORIGIN: 'Message received from invalid domain',
	        IC_SETUP_MERCHANTID_ERROR: 'Merchant id is required for setup!',
	        SANDBOX_BANNER: 'PayPal Incontext is running in sandbox mode. This message will not appear in production mode',
	        MISSING_EC_TOKEN: 'EC Token is not passed in url passed by ajax response',
	        MINI_BROWSER_ALREADY_OPEN: 'Mini browser window already opened and trying to change name',
	        CANNOT_WRITE_TO_MINI_BROWSER: 'unable to write to minibrowser',
	        BUYER_CANCELLED_TRANSACTION: 'Buyer cancelled the transaction',
	        SETUP_MISSING_ELEMENT: 'IC_SETUP_CONTAINER_ERROR: Can\'t find element ',
	        IC_INITXO_CALLED_BEFORE_SETUP: 'paypal.checkout.initXO() was called before calling paypal.checkout.setup(). Please call paypal.checkout.setup() first.',
	        IC_STARTFLOW_CALLED_BEFORE_SETUP: 'paypal.checkout.startFlow() was called before calling paypal.checkout.setup(). Please call paypal.checkout.setup() first.'
	    },
	
	    FOCUSABLE_ELEMENTS: [
	        'a[href]',
	        'area[href]',
	        'input',
	        'select',
	        'textarea',
	        'button',
	        'iframe',
	        'object',
	        'embed',
	        '[tabindex]',
	        '[contenteditable]'
	    ]
	};


/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = {
	    getItem: function (sKey) {
	        if (!sKey) {
	            return null;
	        }
	        return decodeURIComponent(document.cookie.replace(new RegExp('(?:(?:^|.*;)\\s*' + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=\\s*([^;]*).*$)|^.*$'), '$1')) || null;
	    },
	    setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
	        if (!sKey || (/^(?:expires|max\-age|path|domain|secure)$/i).test(sKey)) {
	            return false;
	        }
	        var sExpires = '';
	        if (vEnd) {
	            if (vEnd.constructor === Number) {
	                sExpires = vEnd === Infinity ? '; expires=Fri, 31 Dec 9999 23:59:59 GMT' : '; max-age=' + vEnd;
	            } else if (vEnd.constructor === String) {
	                sExpires = '; expires=' + vEnd;
	            } else if (vEnd.constructor === Date) {
	                sExpires = '; expires=' + vEnd.toUTCString();
	            }
	        }
	        document.cookie = encodeURIComponent(sKey) + '=' + encodeURIComponent(sValue) + sExpires + (sDomain ? '; domain=' + sDomain : '') + (sPath ? '; path=' + sPath : '') + (bSecure ? '; secure' : '');
	        return true;
	    },
	    removeItem: function (sKey, sPath, sDomain) {
	        if (!this.hasItem(sKey)) {
	            return false;
	        }
	        document.cookie = encodeURIComponent(sKey) + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT' + (sDomain ? '; domain=' + sDomain : '') + (sPath ? '; path=' + sPath : '');
	        return true;
	    },
	    hasItem: function (sKey) {
	        if (!sKey) {
	            return false;
	        }
	        return (new RegExp('(?:^|;\\s*)' + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=')).test(document.cookie);
	    },
	    keys: function () {
	        var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, '').split(/\s*(?:\=[^;]*)?;\s*/); // eslint-disable-line fasec/no-unsafe-regex
	        for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) {
	            aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]);
	        }
	        return aKeys;
	    }
	};

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';
	
	/**
	* Embeds the CSS for the UI into the document head
	*/
	function _addCSS(config) {
	    var css = config.css,
	        styleEl = document.createElement('style');
	
	    css = css.replace(new RegExp('PPFrame', 'g'), config.name);
	
	    styleEl.type = 'text/css';
	    config.bodyStyle = styleEl.id = 'PP--IC--CSS';
	
	
	    if (styleEl.styleSheet) {
	        styleEl.styleSheet.cssText = css;
	    } else {
	        styleEl.appendChild(document.createTextNode(css));
	    }
	
	    config.css = css;
	
	    document.getElementsByTagName('head')[0].appendChild(styleEl);
	}
	
	
	
	function _removeCSS(config) {
	    if (config.bodyStyle) {
	        var styleEl = document.getElementById(config.bodyStyle);
	        if (styleEl) {
	            styleEl.parentNode.removeChild(styleEl);
	        }
	    }
	}
	
	module.exports = {
	    add: _addCSS,
	    remove: _removeCSS
	};

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';
	
	/**
	 * Detects if the view is being rendered in mobile.
	 * @param userAgent string
	 * @returns {boolean} true if the view is loaded in mobile/tablet.
	 */
	
	function isDevice(userAgent) {
	    if (userAgent.match(/Android|webOS|iPhone|iPad|iPod|bada|Symbian|Palm|CriOS|BlackBerry|IEMobile|WindowsMobile|Opera Mini/i)) {
	        return true;
	    }
	
	    return false;
	}
	
	/**
	 * Method to detect if the merchant page is in web view
	 * @param userAgent string
	 * @returns {boolean} True if web view
	 */
	function isWebView(userAgent) {
	    return (/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i).test(userAgent);
	}
	
	function getAgent() {
	    var ua = navigator.userAgent, tem,
	        M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
	    if (/trident/i.test(M[1])) {
	        tem = (/\brv[ :]+(\d+)/g).exec(ua) || [];
	        return ['IE', tem[1] || ''];
	    }
	    if (M[1] === 'Chrome') {
	        tem = ua.match(/\bOPR\/(\d+)/);
	        if (tem !== null) {
	            return ['Opera', tem[1]];
	        }
	    }
	    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
	    if ((tem = ua.match(/version\/(\d+(\.\d{1,2}))/i)) !== null) {
	        M.splice(1, 1, tem[1]);
	    }
	    return M;
	}
	
	module.exports = {
	    getAgent: getAgent,
	    isDevice: isDevice,
	    isWebView: isWebView
	};

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var constants = __webpack_require__(3);
	var template = __webpack_require__(8);
	
	/**
	 * Injects the incontext experience (mask, help text + mini browser) into the <body>
	 */
	function injectIncontext(options, config) {
	    options = options || {};
	
	    var incontextMarkup = template(constants.TEMPLATES.incontext, {
	        error: options.error,
	        secureWindow: config.secureWindow,
	        continueLink: config.continueLink,
	        closeWindow: constants.closeWindow
	    });
	
	    var incontextWrapper = document.createElement('div');
	    incontextWrapper.id = config.name;
	    incontextWrapper.innerHTML = incontextMarkup;
	
	    document.body.appendChild(incontextWrapper);
	}
	
	/**
	 * Injects the loading interstitial page into "el"
	 */
	function injectLoadingInterstitial(el) {
	    var loadingMarkup = template(constants.TEMPLATES.loading, {});
	
	    el.write(loadingMarkup);
	}
	
	module.exports = {
	    injectIncontext: injectIncontext,
	    injectLoadingInterstitial: injectLoadingInterstitial
	};

/***/ },
/* 8 */
/***/ function(module, exports) {

	/*eslint-disable */
	'use strict';
	
	/**
	 * Didn't end up using a library like handlebars or ejs
	 * because we want to keep this bundle as small as possible.
	 */
	
	// John Resig - http://ejohn.org/ - MIT Licensed
	// Simple JavaScript Templating
	// http://ejohn.org/blog/javascript-micro-templating/
	var cache = {};
	
	module.exports = function template(str, data) {
	    // Figure out if we're getting a template, or if we need to
	    // load the template - and be sure to cache the result.
	    data = data || {};
	
	    var fn = !/\W/.test(str) ?
	        cache[str] = cache[str] ||
	            template(document.getElementById(str).innerHTML) :
	
	        // Generate a reusable function that will serve as a template
	        // generator (and which will be cached).
	        new Function("data", "var p=[],print=function(){p.push.apply(p,arguments);};" + "p.push('" + str
	            .replace(/[\r\t\n]/g, " ")
	            .split("<%").join("\t")
	            .replace(/((^|%>)[^\t]*)'/g, "$1\r")
	            .replace(/\t=(.*?)%>/g, "',$1,'")
	            .split("\t").join("');")
	            .split("%>").join("p.push('")
	            .split("\r").join("\\'") + "');return p.join('');");
	
	        return fn(data);
	};

/***/ },
/* 9 */
/***/ function(module, exports) {

	'use strict';
	
	/**
	 * Storage object for all events; used to obtain exact signature when
	 * removing events
	 */
	var eventCache = [];
	
	/**
	 * Normalized method of adding an event to an element
	 *
	 * @param {HTMLElement} obj The object to attach the event to
	 * @param {String} type The type of event minus the 'on'
	 * @param {Function} fn The callback function to add
	 * @param {Object} scope A custom scope to use in the callback (optional)
	 */
	function addEvent(obj, type, fn, scope) {
	    scope = scope || obj;
	
	    var wrappedFn;
	
	    if (obj.addEventListener) {
	        wrappedFn = function (event) {
	            fn.call(scope, event);
	        };
	        obj.addEventListener(type, wrappedFn, false);
	    } else if (obj.attachEvent) {
	        wrappedFn = function () {
	            var e = window.event;
	            // e.target = e.target || e.srcElement;
	
	            e.preventDefault = function () {
	                window.event.returnValue = false;
	            };
	
	            fn.call(scope, e);
	        };
	
	        obj.attachEvent('on' + type, wrappedFn);
	    }
	
	    eventCache.push([obj, type, fn, wrappedFn]);
	}
	
	/**
	 * Normalized method of removing an event from an element
	 *
	 * @param {HTMLElement} obj The object to attach the event to
	 * @param {String} type The type of event minus the 'on'
	 * @param {Function} fn The callback function to remove
	 */
	function removeEvent(obj, type, fn) {
	    var wrappedFn, item, i;
	
	    for (i = 0; i < eventCache.length; i++) {
	        item = eventCache[i];
	
	        if (item[0] === obj && item[1] === type && item[2] === fn) {
	            wrappedFn = item[3];
	
	            if (wrappedFn) {
	                if (obj.removeEventListener) {
	                    obj.removeEventListener(type, wrappedFn, false);
	                } else if (obj.detachEvent) {
	                    obj.detachEvent('on' + type, wrappedFn);
	                }
	            }
	        }
	    }
	}
	
	module.exports = {
	    addEvent: addEvent,
	    removeEvent: removeEvent
	};


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var constants = __webpack_require__(3);
	var events = __webpack_require__(9);
	var redirect = __webpack_require__(11);
	var _log = __webpack_require__(13);
	
	function _getBtnContainers(el, result) {
	    // either an array or nodelist
	    if (el.constructor.toString().indexOf('Array') > -1 || el.length > 0 && typeof el.item !== 'undefined') {
	        for (var i = 0; i < el.length; i++) {
	            _getBtnContainers(el[i], result);
	        }
	    } else {
	        var domEl = typeof el === 'string' ? document.getElementById(el) : el;
	
	        if (domEl) {
	            result.push(domEl);
	        } else {
	            _log(constants.ERROR_MESSAGES.SETUP_MISSING_ELEMENT + el);
	        }
	    }
	}
	
	function _getBtnObject(element, clickFn, condFn) {
	    return {
	        element: element,
	        clickFn: clickFn,
	        condFn: condFn
	    };
	}
	
	function _addButtonElement(config, btnList, jsBtnConfigs, container, btnOptions, clickFn, condFn) {
	
	    var dataAttrs = {
	        lc: (config.merchantConfig && config.merchantConfig.locale) || 'en_US',
	        color: btnOptions.color || 'gold',
	        shape: btnOptions.shape || 'pill',
	        size: btnOptions.size || 'small'
	    };
	
	    var buttonDom = window.paypal.button.create(config.merchantID, dataAttrs, { // eslint-disable-line no-undef
	        label: btnOptions.label,
	        type: 'button'
	    });
	
	    var buttonEle = buttonDom.el,
	        btnTagEle = buttonEle.getElementsByTagName('BUTTON')[0];
	
	    if (config.enableOneTouch) {
	
	        if (!document.getElementById(constants.ONETOUCH_IFRAME_ID)) {
	            var oneTouchIframe = document.createElement('iframe');
	            oneTouchIframe.setAttribute('id', constants.ONETOUCH_IFRAME_ID);
	            oneTouchIframe.setAttribute('src', constants.ONETOUCH_IFRAME_URL);
	            oneTouchIframe.style.display = 'none';
	            document.body.appendChild(oneTouchIframe);
	        }
	    }
	
	    // should bind onclick event in here
	    if (container.nodeName === 'A') {
	        btnList.push(_getBtnObject(container, clickFn, condFn));
	
	        // for IE8-, button inside of link doesn't work
	        if (config.oldIe) {
	            events.addEvent(btnTagEle, 'click', function () {
	                redirect(container.getAttribute('href'));
	            });
	        }
	        // a form
	    } else {
	        btnList.push(_getBtnObject(btnTagEle, clickFn, condFn));
	    }
	    container.appendChild(buttonEle);
	
	    // Add js button related options for tracking
	    dataAttrs.label = btnOptions.label;
	    jsBtnConfigs.push(dataAttrs);
	
	}
	
	function buttonGenerator(config, jsBtnConfigs, btnList) {
	
	    var merchantConfig = config.merchantConfig,
	        jsBtnIds = merchantConfig && merchantConfig.container,
	        customBtnIds = merchantConfig && merchantConfig.button,
	        jsBtnTypes = merchantConfig && merchantConfig.type || [],
	        color = merchantConfig && merchantConfig.color,
	        size = merchantConfig && merchantConfig.size,
	        shape = merchantConfig && merchantConfig.shape,
	        condFn = merchantConfig && merchantConfig.condition,
	        clickFn = merchantConfig && merchantConfig.click,
	        btnsConfigList = merchantConfig && merchantConfig.buttons,
	        btnContainers = [];
	
	    if (btnsConfigList && btnsConfigList.length) {
	        for (var i = 0; i < btnsConfigList.length; i++) {
	            var btnConfig = btnsConfigList[i];
	            var elId = btnConfig.container || btnConfig.button;
	            var elDom = typeof elId === 'string' ? document.getElementById(elId) : elId;
	
	            if (btnConfig.container) {
	                _addButtonElement(config, btnList, jsBtnConfigs, elDom, {
	                    label: btnConfig.type || 'checkout',
	                    color: btnConfig.color,
	                    shape: btnConfig.shape,
	                    size: btnConfig.size
	                }, btnConfig.click, btnConfig.condition);
	            } else if (btnConfig.button) {
	                btnList.push(_getBtnObject(elDom, btnConfig.click, btnConfig.condition));
	            }
	        }
	    } else {
	        // get all container list
	        _getBtnContainers(jsBtnIds || customBtnIds, btnContainers);
	
	        for (var j = 0; j < btnContainers.length; j++) {
	            if (customBtnIds) {
	                btnList.push(_getBtnObject(btnContainers[j], clickFn, condFn));
	            } else {
	                var buttonParams = {
	                    label: jsBtnTypes[j] || 'checkout',
	                    color: color,
	                    shape: shape,
	                    size: size
	                };
	                _addButtonElement(config, btnList, jsBtnConfigs, btnContainers[j], buttonParams, clickFn, condFn);
	            }
	        }
	    }
	
	    return btnList;
	}
	
	module.exports = buttonGenerator;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var once = __webpack_require__(12);
	
	var redirect = once(function (location) {
	    window.location.href = location;
	});
	
	module.exports = redirect;

/***/ },
/* 12 */
/***/ function(module, exports) {

	'use strict';
	
	function once(method) {
	    if (!method) {
	        return method;
	    }
	
	    var called = false;
	
	    return function onceWrapper() {
	        if (!called) {
	            called = true;
	            return method.apply(this, arguments);
	        }
	    };
	}
	
	module.exports = once;

/***/ },
/* 13 */
/***/ function(module, exports) {

	'use strict';
	/**
	    * Logs the msg to the console.
	    * @param {string} msg to print in console
	    * @returns {null}
	    */
	function _log(msg) {
	    if (window.console) {
	        console.log(msg);
	    }
	}
	
	module.exports = _log;

/***/ },
/* 14 */
/***/ function(module, exports) {

	'use strict';
	
	/**
	 * Generates a GUID string.
	 * @returns {String} The generated GUID.
	 * @example af8a8416-6e18-a307-bd9c-f2c947bbb3aa
	 * @author Slavik Meltser (slavik@meltser.info).
	 * @link http://slavik.meltser.info/?p=142
	 */
	function getGUID() {
	    function _p8(s) {
	        var p = (Math.random().toString(16) + '000000000').substr(2, 8);
	        return s ? '-' + p.substr(0, 4) + '-' + p.substr(4, 4) : p;
	    }
	    return _p8() + _p8(true) + _p8(true) + _p8();
	}
	
	module.exports = {
	    getGUID: getGUID
	};

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var events = __webpack_require__(9);
	var constants = __webpack_require__(3);
	var getDomain = __webpack_require__(16);
	
	var trk = function () {
	    
	};
	
	function _nao() {
	    // get high-res time, fallback to classic datetime
	    var perfNow = window.performance && window.performance.now && window.performance.now();
	    var now = parseInt(perfNow || new Date().getTime(), 10);
	    return now;
	}
	
	/**
	* Creates a function that will remove the iframe specified
	* @returns Function<void>
	*/
	function _iframeTimedOut(iframe) {
	    return function () {
	        // stop loading of iframe content
	        if (typeof (window.frames[iframe.name].stop) !== 'undefined') {
	            window.frames[iframe.name].stop();
	        } else {
	            try {
	                window.frames[iframe.name].document.execCommand('Stop');
	            } catch (err) {
	                // IE access denied error most likely,
	                // can't stop won't stop so we let it be
	            }
	
	        }
	        // remove listener for iframe load event
	        // since we didn't make it in time
	        iframe.onload = null;
	        iframe.parentNode.removeChild(iframe);
	
	    };
	}
	
	
	function _determineThirdPartyCookiesEnabled(config) {
	    var domain = getDomain(config);
	    var url = domain + constants.COOKIE_CHECK_PATH;
	    var iframe = _setupIframe(constants.COOKIE_CHECK_NAME, url);
	
	    // set up timeout so slow third-party cookie check loading doesn't affect IC rendering
	    var timer = setTimeout(_iframeTimedOut(iframe), constants.LOADING_TIMEOUT);
	    var start = _nao();
	    var iframeSuccess = _iframeCookieCheckLoaded(config, timer, name, start);
	    events.addEvent(iframe, 'load', iframeSuccess);
	
	    document.body.appendChild(iframe);
	}
	
	/**
	 * Creates a success handler function
	 * that clears the failure timeout
	 * @returns Function<void>
	 */
	function _iframePrefetchLoaded(config, timer, name, start) {
	    return function () {
	        var elapsed = _nao() - start;
	        config.prefetchLoaded = true;
	        trk({
	            status: 'IC_HERMES_PREFETCH_COMPLETE',
	            elapsed: elapsed
	        });
	        clearTimeout(timer);
	    };
	}
	
	/**
	 * Creates a success handler function
	 * that clears the failure timeout
	 * @returns Function<void>
	 */
	function _iframeCookieCheckLoaded(config, timer, name, start) {
	    return function () {
	        var elapsed = _nao() - start;
	        config.cookieCheckLoaded = true;
	        trk({
	            status: 'IC_HERMES_COOKIE_CHECK_COMPLETE',
	            elapsed: elapsed
	        });
	        clearTimeout(timer);
	    };
	}
	
	/**
	 * Creates an invisible iframe (used for beacons, bridges, prefetch loaders) given a name and URL
	 *
	 * @returns {HTMLIFrameElement}
	 */
	function _setupIframe(name, url) {
	    var iframe;
	
	    // workaround: IE6 + 7 won't let you name an iframe after you create it
	    try {
	        iframe = document.createElement('<iframe name="' + name + '">');
	    } catch (err) {
	        iframe = document.createElement('iframe');
	        iframe.name = name;
	    }
	
	    // batch write attributes as quick as possible
	    iframe.setAttribute('style', 'margin: 0; padding: 0; border: 0px none; overflow: hidden;');
	    iframe.setAttribute('frameborder', 0);
	    iframe.setAttribute('border', 0);
	    iframe.setAttribute('scrolling', 'no');
	    iframe.setAttribute('allowTransparency', true);
	    // accessibility attributes.
	    // these prevent screenreaders from announcing
	    // iframe contents or allowing navigation to these frames.
	    iframe.setAttribute('tabindex', -1);
	    iframe.setAttribute('hidden', true);
	    iframe.setAttribute('title', '');
	    iframe.setAttribute('role', 'presentation');
	
	    // set the src to begin the loading process
	
	    iframe.src = url;
	    return iframe;
	}
	
	/**
	             * Prefetches resources before user clicks checkout button and (hopefully) primes them in the browser's cache
	             *
	             * @returns {undefined}
	             */
	function _setupPrefetchIframe(config) {
	    var domain = getDomain(config);
	    var url = domain + constants.PREFETCH_CONTEXT_ROOT + (config.debug ? '?resources_prefetch=1' : '');
	    var iframe = _setupIframe(constants.PREFETCH_NAME, url);
	
	    // set up timeout so slow prefetch/bridge loading
	    // doesn't affect IC rendering
	    var timer = setTimeout(_iframeTimedOut(iframe), constants.LOADING_TIMEOUT);
	    var start = _nao();
	    var iframeSuccess = _iframePrefetchLoaded(config, timer, name, start);
	    events.addEvent(iframe, 'load', iframeSuccess);
	
	    document.body.appendChild(iframe);
	}
	
	/**
	 * IE doesn't support cross domain post message. Create an iFrame Bridge to communicate between Mini browser and parent window.
	 * This is only for IE
	 * @returns {undefined}
	 */
	function _setUpPayPalBridge(config) {
	    var domain = config.sandBox ? constants.SANDBOX_URL_ROOT : constants.LIVE_URL_ROOT;
	    var bridgeUrl = config.bridgeUrl ? domain + config.bridgeUrl : domain + constants.BRIDGE_CONTEXT_ROOT;
	    var iframe = _setupIframe(constants.BRIDGE_NAME, bridgeUrl);
	
	    document.body.appendChild(iframe);
	}
	function IframeFactory(_track) {
	    trk = _track;
	    var iframe = {
	        bridge: _setUpPayPalBridge,
	        prefetch: _setupPrefetchIframe,
	        thirdParty: _determineThirdPartyCookiesEnabled
	    };
	    return iframe;
	}
	
	
	module.exports = IframeFactory;

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var constants = __webpack_require__(3);
	
	function getDomain(config) {
	    if (config.domain) {
	        return config.domain;
	    } else if (config.sandBox) {
	        return constants.SANDBOX_URL_ROOT;
	    } else {
	        return constants.LIVE_URL_ROOT;
	    }
	}
	
	module.exports = getDomain;

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var constants = __webpack_require__(3);
	var removePanels = __webpack_require__(18);
	var getDomain = __webpack_require__(16);
	
	function _buildLightbox(config) {
	    var UI = {};
	
	    UI.wrapper = document.createElement('div');
	    UI.wrapper.id = config.name;
	
	    UI.panel = document.createElement('div');
	    UI.panel.className = 'PPIC-panel PPIC-lightbox animated';
	    UI.panel.id = 'PPPanel';
	
	    // workaround: IE6 + 7 won't let you name an iframe after you create it
	    try {
	        UI.iframe = document.createElement('<iframe name="' + config.name + '" id="' + config.name + 'frame' + '" role="dialog">');
	    } catch (e) {
	        UI.iframe = document.createElement('iframe');
	        UI.iframe.name = config.name;
	        UI.iframe.id = config.name + 'frame';
	        UI.iframe.setAttribute('role', 'dialog');
	    }
	
	    UI.iframe.frameBorder = '0';
	    UI.iframe.border = '0';
	    UI.iframe.scrolling = 'no';
	    UI.iframe.allowTransparency = 'true';
	
	    UI.mask = document.createElement('div');
	    UI.mask.className = 'mask';
	
	    UI.loading = document.createElement('div');
	    UI.loading.className = 'modal';
	
	    var logo = document.createElement('div');
	    logo.className = 'logo';
	    UI.loading.appendChild(logo);
	
	    UI.loading.className = UI.loading.className + ' loading';
	    // var loadingSpinner = document.createElement('div');
	    // loadingSpinner.className = 'spinner';
	    // UI.loading.appendChild(loadingSpinner);
	
	    UI.panel.appendChild(UI.iframe);
	    UI.wrapper.appendChild(UI.mask);
	    UI.wrapper.appendChild(UI.loading);
	    UI.wrapper.appendChild(UI.panel);
	
	    document.body.className = document.body.className + ' ' + config.name;
	    document.body.appendChild(UI.wrapper);
	
	    return UI;
	}
	
	
	
	function _determineLightboxEnabled(config) {
	    var domain = getDomain(config);
	    var url = domain + constants.ONETOUCH_CONTEXT_ROOT + '?guid=' + config.frameGuid + (config.debug ? '&incontext_iframe=1' : '');
	    var xhr = new XMLHttpRequest();
	
	    // IE9 can use XDomainRequest as a fallback for no CORS support
	    if (!('withCredentials' in xhr) && typeof XDomainRequest !== 'undefined') {
	        xhr = new XDomainRequest();
	    }
	
	    // If XHR w/ CORS is supported...
	    if (xhr && 'withCredentials' in xhr) {
	        try {
	            xhr.withCredentials = true;
	
	            xhr.open('GET', url);
	
	            xhr.onreadystatechange = function () {
	                if (xhr.readyState === 4 && xhr.status === 200) {
	                    var response = JSON.parse(xhr.responseText);
	                    var remembered = response && response.data && response.data.remembered;
	
	                    if (remembered) {
	                        config.oneTouchEnabled = true;
	                    }
	                }
	            };
	
	            xhr.onerror = function () {
	                config.oneTouchEnabled = false;
	            };
	
	            xhr.send();
	        } catch (err) {
	            config.oneTouchEnabled = false;
	        }
	    }
	}
	
	
	
	/**
	 * Hides lightbox when user clicks Esc key.
	 */
	function _toggleLightbox(callback) {
	    return function (event) {
	        if (event.which === null && (event.charCode !== null || event.keyCode !== null)) {
	            event.which = event.charCode !== null ? event.charCode : event.keyCode;
	        }
	        if (event.which === 27) {
	            // errMsg = constants.ERROR_MESSAGES.BUYER_CANCELLED_TRANSACTION;
	            callback();
	        }
	    };
	}
	
	function _destroyLightbox(app, config, callback) {
	    app.lightbox.panel.className += ' bounceOutDown';
	
	    setTimeout(function () {
	        removePanels(config);
	
	        app.lightbox.wrapper.className = '';
	
	        config.oneTouchEnabled = false;
	
	        if (callback) {
	            callback();
	        }
	    }, 700);
	}
	
	function isLightboxEnabled(config) {
	    var oneTouchEnabled = config.oneTouchEnabled; // If a user is one touch enabled, or fully logged in...
	    var thirdPartyCookiesEnabled = config.thirdPartyCookiesEnabled; // If a browser has third party cookies enabled...
	    var forceLightboxDisabled = config.forceLightboxDisabled; // If a merchant forces the lightbox to be disabled (undocumented)...
	    var isNotIE = !config.needsIframeBridge; // IE may break lightbox
	
	    return oneTouchEnabled && thirdPartyCookiesEnabled && !forceLightboxDisabled && isNotIE;
	}
	
	var Lightbox = {
	    build: _buildLightbox,
	    destroy: _destroyLightbox,
	    toggle: _toggleLightbox,
	    isEligible: _determineLightboxEnabled,
	    isEnabled: isLightboxEnabled
	};
	
	module.exports = Lightbox;

/***/ },
/* 18 */
/***/ function(module, exports) {

	'use strict';
	
	
	function _removePanels(config) {
	    var panel = document.getElementById(config.name);
	
	    while (panel && panel.parentNode) {
	        panel.parentNode.removeChild(panel);
	        _removePanels(config);
	    }
	}
	
	module.exports = _removePanels;

/***/ },
/* 19 */
/***/ function(module, exports) {

	'use strict';
	
	function MaskFactory(bodyClass) {
	    /* Creates the mask */
	    function _createMask() {
	        var mask = document.getElementById('ppICMask');
	        var actualWidth = document.documentElement ? document.documentElement.clientWidth : window.innerWidth;
	        var windowWidth, windowHeight, scrollWidth, scrollHeight, width, height;
	
	        if (window.innerHeight && window.scrollMaxY) {
	            scrollWidth = actualWidth + window.scrollMaxX;
	            scrollHeight = window.innerHeight + window.scrollMaxY;
	        } else if (document.body.scrollHeight > document.body.offsetHeight) {
	            scrollWidth = document.body.scrollWidth;
	            scrollHeight = document.body.scrollHeight;
	        } else {
	            scrollWidth = document.body.offsetWidth;
	            scrollHeight = document.body.offsetHeight;
	        }
	
	        if (window.innerHeight) {
	            windowWidth = actualWidth;
	            windowHeight = window.innerHeight;
	        } else if (document.documentElement && document.documentElement.clientHeight) {
	            windowWidth = document.documentElement.clientWidth;
	            windowHeight = document.documentElement.clientHeight;
	        } else if (document.body) {
	            windowWidth = document.body.clientWidth;
	            windowHeight = document.body.clientHeight;
	        }
	
	        width = windowWidth > scrollWidth ? windowWidth : scrollWidth;
	        height = windowHeight > scrollHeight ? windowHeight : scrollHeight;
	
	        if (mask) {
	            mask.style.width = width + 'px';
	            mask.style.height = height + 'px';
	        }
	
	        if (bodyClass && document.body.className.indexOf(bodyClass) === -1) {
	            document.body.className += ' ' + bodyClass;
	        }
	    }
	
	    function _hideMask() {
	        var mask = document.getElementById('ppICMask'),
	            frame = mask && mask.parentNode;
	        if (frame) {
	            frame.parentNode.removeChild(frame);
	
	        }
	    }
	
	    return {
	        create: _createMask,
	        hide: _hideMask
	    };
	}
	
	module.exports = MaskFactory;

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var evence = __webpack_require__(21);
	var util = __webpack_require__(22);
	
	function XoEmitter() {
	    evence.EventEmitter.call(this);
	}
	
	util.inherits(XoEmitter, evence.EventEmitter);
	
	module.exports = XoEmitter;

/***/ },
/* 21 */
/***/ function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.
	
	function EventEmitter() {
	  this._events = this._events || {};
	  this._maxListeners = this._maxListeners || undefined;
	}
	module.exports = EventEmitter;
	
	// Backwards-compat with node 0.10.x
	EventEmitter.EventEmitter = EventEmitter;
	
	EventEmitter.prototype._events = undefined;
	EventEmitter.prototype._maxListeners = undefined;
	
	// By default EventEmitters will print a warning if more than 10 listeners are
	// added to it. This is a useful default which helps finding memory leaks.
	EventEmitter.defaultMaxListeners = 10;
	
	// Obviously not all Emitters should be limited to 10. This function allows
	// that to be increased. Set to zero for unlimited.
	EventEmitter.prototype.setMaxListeners = function(n) {
	  if (!isNumber(n) || n < 0 || isNaN(n))
	    throw TypeError('n must be a positive number');
	  this._maxListeners = n;
	  return this;
	};
	
	EventEmitter.prototype.emit = function(type) {
	  var er, handler, len, args, i, listeners;
	
	  if (!this._events)
	    this._events = {};
	
	  // If there is no 'error' event listener then throw.
	  if (type === 'error') {
	    if (!this._events.error ||
	        (isObject(this._events.error) && !this._events.error.length)) {
	      er = arguments[1];
	      if (er instanceof Error) {
	        throw er; // Unhandled 'error' event
	      }
	      throw TypeError('Uncaught, unspecified "error" event.');
	    }
	  }
	
	  handler = this._events[type];
	
	  if (isUndefined(handler))
	    return false;
	
	  if (isFunction(handler)) {
	    switch (arguments.length) {
	      // fast cases
	      case 1:
	        handler.call(this);
	        break;
	      case 2:
	        handler.call(this, arguments[1]);
	        break;
	      case 3:
	        handler.call(this, arguments[1], arguments[2]);
	        break;
	      // slower
	      default:
	        args = Array.prototype.slice.call(arguments, 1);
	        handler.apply(this, args);
	    }
	  } else if (isObject(handler)) {
	    args = Array.prototype.slice.call(arguments, 1);
	    listeners = handler.slice();
	    len = listeners.length;
	    for (i = 0; i < len; i++)
	      listeners[i].apply(this, args);
	  }
	
	  return true;
	};
	
	EventEmitter.prototype.addListener = function(type, listener) {
	  var m;
	
	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');
	
	  if (!this._events)
	    this._events = {};
	
	  // To avoid recursion in the case that type === "newListener"! Before
	  // adding it to the listeners, first emit "newListener".
	  if (this._events.newListener)
	    this.emit('newListener', type,
	              isFunction(listener.listener) ?
	              listener.listener : listener);
	
	  if (!this._events[type])
	    // Optimize the case of one listener. Don't need the extra array object.
	    this._events[type] = listener;
	  else if (isObject(this._events[type]))
	    // If we've already got an array, just append.
	    this._events[type].push(listener);
	  else
	    // Adding the second element, need to change to array.
	    this._events[type] = [this._events[type], listener];
	
	  // Check for listener leak
	  if (isObject(this._events[type]) && !this._events[type].warned) {
	    if (!isUndefined(this._maxListeners)) {
	      m = this._maxListeners;
	    } else {
	      m = EventEmitter.defaultMaxListeners;
	    }
	
	    if (m && m > 0 && this._events[type].length > m) {
	      this._events[type].warned = true;
	      console.error('(node) warning: possible EventEmitter memory ' +
	                    'leak detected. %d listeners added. ' +
	                    'Use emitter.setMaxListeners() to increase limit.',
	                    this._events[type].length);
	      if (typeof console.trace === 'function') {
	        // not supported in IE 10
	        console.trace();
	      }
	    }
	  }
	
	  return this;
	};
	
	EventEmitter.prototype.on = EventEmitter.prototype.addListener;
	
	EventEmitter.prototype.once = function(type, listener) {
	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');
	
	  var fired = false;
	
	  function g() {
	    this.removeListener(type, g);
	
	    if (!fired) {
	      fired = true;
	      listener.apply(this, arguments);
	    }
	  }
	
	  g.listener = listener;
	  this.on(type, g);
	
	  return this;
	};
	
	// emits a 'removeListener' event iff the listener was removed
	EventEmitter.prototype.removeListener = function(type, listener) {
	  var list, position, length, i;
	
	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');
	
	  if (!this._events || !this._events[type])
	    return this;
	
	  list = this._events[type];
	  length = list.length;
	  position = -1;
	
	  if (list === listener ||
	      (isFunction(list.listener) && list.listener === listener)) {
	    delete this._events[type];
	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);
	
	  } else if (isObject(list)) {
	    for (i = length; i-- > 0;) {
	      if (list[i] === listener ||
	          (list[i].listener && list[i].listener === listener)) {
	        position = i;
	        break;
	      }
	    }
	
	    if (position < 0)
	      return this;
	
	    if (list.length === 1) {
	      list.length = 0;
	      delete this._events[type];
	    } else {
	      list.splice(position, 1);
	    }
	
	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);
	  }
	
	  return this;
	};
	
	EventEmitter.prototype.removeAllListeners = function(type) {
	  var key, listeners;
	
	  if (!this._events)
	    return this;
	
	  // not listening for removeListener, no need to emit
	  if (!this._events.removeListener) {
	    if (arguments.length === 0)
	      this._events = {};
	    else if (this._events[type])
	      delete this._events[type];
	    return this;
	  }
	
	  // emit removeListener for all listeners on all events
	  if (arguments.length === 0) {
	    for (key in this._events) {
	      if (key === 'removeListener') continue;
	      this.removeAllListeners(key);
	    }
	    this.removeAllListeners('removeListener');
	    this._events = {};
	    return this;
	  }
	
	  listeners = this._events[type];
	
	  if (isFunction(listeners)) {
	    this.removeListener(type, listeners);
	  } else if (listeners) {
	    // LIFO order
	    while (listeners.length)
	      this.removeListener(type, listeners[listeners.length - 1]);
	  }
	  delete this._events[type];
	
	  return this;
	};
	
	EventEmitter.prototype.listeners = function(type) {
	  var ret;
	  if (!this._events || !this._events[type])
	    ret = [];
	  else if (isFunction(this._events[type]))
	    ret = [this._events[type]];
	  else
	    ret = this._events[type].slice();
	  return ret;
	};
	
	EventEmitter.prototype.listenerCount = function(type) {
	  if (this._events) {
	    var evlistener = this._events[type];
	
	    if (isFunction(evlistener))
	      return 1;
	    else if (evlistener)
	      return evlistener.length;
	  }
	  return 0;
	};
	
	EventEmitter.listenerCount = function(emitter, type) {
	  return emitter.listenerCount(type);
	};
	
	function isFunction(arg) {
	  return typeof arg === 'function';
	}
	
	function isNumber(arg) {
	  return typeof arg === 'number';
	}
	
	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}
	
	function isUndefined(arg) {
	  return arg === void 0;
	}


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.
	
	var formatRegExp = /%[sdj%]/g;
	exports.format = function(f) {
	  if (!isString(f)) {
	    var objects = [];
	    for (var i = 0; i < arguments.length; i++) {
	      objects.push(inspect(arguments[i]));
	    }
	    return objects.join(' ');
	  }
	
	  var i = 1;
	  var args = arguments;
	  var len = args.length;
	  var str = String(f).replace(formatRegExp, function(x) {
	    if (x === '%%') return '%';
	    if (i >= len) return x;
	    switch (x) {
	      case '%s': return String(args[i++]);
	      case '%d': return Number(args[i++]);
	      case '%j':
	        try {
	          return JSON.stringify(args[i++]);
	        } catch (_) {
	          return '[Circular]';
	        }
	      default:
	        return x;
	    }
	  });
	  for (var x = args[i]; i < len; x = args[++i]) {
	    if (isNull(x) || !isObject(x)) {
	      str += ' ' + x;
	    } else {
	      str += ' ' + inspect(x);
	    }
	  }
	  return str;
	};
	
	
	// Mark that a method should not be used.
	// Returns a modified function which warns once by default.
	// If --no-deprecation is set, then it is a no-op.
	exports.deprecate = function(fn, msg) {
	  // Allow for deprecating things in the process of starting up.
	  if (isUndefined(global.process)) {
	    return function() {
	      return exports.deprecate(fn, msg).apply(this, arguments);
	    };
	  }
	
	  if (process.noDeprecation === true) {
	    return fn;
	  }
	
	  var warned = false;
	  function deprecated() {
	    if (!warned) {
	      if (process.throwDeprecation) {
	        throw new Error(msg);
	      } else if (process.traceDeprecation) {
	        console.trace(msg);
	      } else {
	        console.error(msg);
	      }
	      warned = true;
	    }
	    return fn.apply(this, arguments);
	  }
	
	  return deprecated;
	};
	
	
	var debugs = {};
	var debugEnviron;
	exports.debuglog = function(set) {
	  if (isUndefined(debugEnviron))
	    debugEnviron = process.env.NODE_DEBUG || '';
	  set = set.toUpperCase();
	  if (!debugs[set]) {
	    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
	      var pid = process.pid;
	      debugs[set] = function() {
	        var msg = exports.format.apply(exports, arguments);
	        console.error('%s %d: %s', set, pid, msg);
	      };
	    } else {
	      debugs[set] = function() {};
	    }
	  }
	  return debugs[set];
	};
	
	
	/**
	 * Echos the value of a value. Trys to print the value out
	 * in the best way possible given the different types.
	 *
	 * @param {Object} obj The object to print out.
	 * @param {Object} opts Optional options object that alters the output.
	 */
	/* legacy: obj, showHidden, depth, colors*/
	function inspect(obj, opts) {
	  // default options
	  var ctx = {
	    seen: [],
	    stylize: stylizeNoColor
	  };
	  // legacy...
	  if (arguments.length >= 3) ctx.depth = arguments[2];
	  if (arguments.length >= 4) ctx.colors = arguments[3];
	  if (isBoolean(opts)) {
	    // legacy...
	    ctx.showHidden = opts;
	  } else if (opts) {
	    // got an "options" object
	    exports._extend(ctx, opts);
	  }
	  // set default options
	  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
	  if (isUndefined(ctx.depth)) ctx.depth = 2;
	  if (isUndefined(ctx.colors)) ctx.colors = false;
	  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
	  if (ctx.colors) ctx.stylize = stylizeWithColor;
	  return formatValue(ctx, obj, ctx.depth);
	}
	exports.inspect = inspect;
	
	
	// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
	inspect.colors = {
	  'bold' : [1, 22],
	  'italic' : [3, 23],
	  'underline' : [4, 24],
	  'inverse' : [7, 27],
	  'white' : [37, 39],
	  'grey' : [90, 39],
	  'black' : [30, 39],
	  'blue' : [34, 39],
	  'cyan' : [36, 39],
	  'green' : [32, 39],
	  'magenta' : [35, 39],
	  'red' : [31, 39],
	  'yellow' : [33, 39]
	};
	
	// Don't use 'blue' not visible on cmd.exe
	inspect.styles = {
	  'special': 'cyan',
	  'number': 'yellow',
	  'boolean': 'yellow',
	  'undefined': 'grey',
	  'null': 'bold',
	  'string': 'green',
	  'date': 'magenta',
	  // "name": intentionally not styling
	  'regexp': 'red'
	};
	
	
	function stylizeWithColor(str, styleType) {
	  var style = inspect.styles[styleType];
	
	  if (style) {
	    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
	           '\u001b[' + inspect.colors[style][1] + 'm';
	  } else {
	    return str;
	  }
	}
	
	
	function stylizeNoColor(str, styleType) {
	  return str;
	}
	
	
	function arrayToHash(array) {
	  var hash = {};
	
	  array.forEach(function(val, idx) {
	    hash[val] = true;
	  });
	
	  return hash;
	}
	
	
	function formatValue(ctx, value, recurseTimes) {
	  // Provide a hook for user-specified inspect functions.
	  // Check that value is an object with an inspect function on it
	  if (ctx.customInspect &&
	      value &&
	      isFunction(value.inspect) &&
	      // Filter out the util module, it's inspect function is special
	      value.inspect !== exports.inspect &&
	      // Also filter out any prototype objects using the circular check.
	      !(value.constructor && value.constructor.prototype === value)) {
	    var ret = value.inspect(recurseTimes, ctx);
	    if (!isString(ret)) {
	      ret = formatValue(ctx, ret, recurseTimes);
	    }
	    return ret;
	  }
	
	  // Primitive types cannot have properties
	  var primitive = formatPrimitive(ctx, value);
	  if (primitive) {
	    return primitive;
	  }
	
	  // Look up the keys of the object.
	  var keys = Object.keys(value);
	  var visibleKeys = arrayToHash(keys);
	
	  if (ctx.showHidden) {
	    keys = Object.getOwnPropertyNames(value);
	  }
	
	  // IE doesn't make error fields non-enumerable
	  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
	  if (isError(value)
	      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
	    return formatError(value);
	  }
	
	  // Some type of object without properties can be shortcutted.
	  if (keys.length === 0) {
	    if (isFunction(value)) {
	      var name = value.name ? ': ' + value.name : '';
	      return ctx.stylize('[Function' + name + ']', 'special');
	    }
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    }
	    if (isDate(value)) {
	      return ctx.stylize(Date.prototype.toString.call(value), 'date');
	    }
	    if (isError(value)) {
	      return formatError(value);
	    }
	  }
	
	  var base = '', array = false, braces = ['{', '}'];
	
	  // Make Array say that they are Array
	  if (isArray(value)) {
	    array = true;
	    braces = ['[', ']'];
	  }
	
	  // Make functions say that they are functions
	  if (isFunction(value)) {
	    var n = value.name ? ': ' + value.name : '';
	    base = ' [Function' + n + ']';
	  }
	
	  // Make RegExps say that they are RegExps
	  if (isRegExp(value)) {
	    base = ' ' + RegExp.prototype.toString.call(value);
	  }
	
	  // Make dates with properties first say the date
	  if (isDate(value)) {
	    base = ' ' + Date.prototype.toUTCString.call(value);
	  }
	
	  // Make error with message first say the error
	  if (isError(value)) {
	    base = ' ' + formatError(value);
	  }
	
	  if (keys.length === 0 && (!array || value.length == 0)) {
	    return braces[0] + base + braces[1];
	  }
	
	  if (recurseTimes < 0) {
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    } else {
	      return ctx.stylize('[Object]', 'special');
	    }
	  }
	
	  ctx.seen.push(value);
	
	  var output;
	  if (array) {
	    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
	  } else {
	    output = keys.map(function(key) {
	      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
	    });
	  }
	
	  ctx.seen.pop();
	
	  return reduceToSingleString(output, base, braces);
	}
	
	
	function formatPrimitive(ctx, value) {
	  if (isUndefined(value))
	    return ctx.stylize('undefined', 'undefined');
	  if (isString(value)) {
	    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
	                                             .replace(/'/g, "\\'")
	                                             .replace(/\\"/g, '"') + '\'';
	    return ctx.stylize(simple, 'string');
	  }
	  if (isNumber(value))
	    return ctx.stylize('' + value, 'number');
	  if (isBoolean(value))
	    return ctx.stylize('' + value, 'boolean');
	  // For some reason typeof null is "object", so special case here.
	  if (isNull(value))
	    return ctx.stylize('null', 'null');
	}
	
	
	function formatError(value) {
	  return '[' + Error.prototype.toString.call(value) + ']';
	}
	
	
	function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
	  var output = [];
	  for (var i = 0, l = value.length; i < l; ++i) {
	    if (hasOwnProperty(value, String(i))) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
	          String(i), true));
	    } else {
	      output.push('');
	    }
	  }
	  keys.forEach(function(key) {
	    if (!key.match(/^\d+$/)) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
	          key, true));
	    }
	  });
	  return output;
	}
	
	
	function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
	  var name, str, desc;
	  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
	  if (desc.get) {
	    if (desc.set) {
	      str = ctx.stylize('[Getter/Setter]', 'special');
	    } else {
	      str = ctx.stylize('[Getter]', 'special');
	    }
	  } else {
	    if (desc.set) {
	      str = ctx.stylize('[Setter]', 'special');
	    }
	  }
	  if (!hasOwnProperty(visibleKeys, key)) {
	    name = '[' + key + ']';
	  }
	  if (!str) {
	    if (ctx.seen.indexOf(desc.value) < 0) {
	      if (isNull(recurseTimes)) {
	        str = formatValue(ctx, desc.value, null);
	      } else {
	        str = formatValue(ctx, desc.value, recurseTimes - 1);
	      }
	      if (str.indexOf('\n') > -1) {
	        if (array) {
	          str = str.split('\n').map(function(line) {
	            return '  ' + line;
	          }).join('\n').substr(2);
	        } else {
	          str = '\n' + str.split('\n').map(function(line) {
	            return '   ' + line;
	          }).join('\n');
	        }
	      }
	    } else {
	      str = ctx.stylize('[Circular]', 'special');
	    }
	  }
	  if (isUndefined(name)) {
	    if (array && key.match(/^\d+$/)) {
	      return str;
	    }
	    name = JSON.stringify('' + key);
	    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
	      name = name.substr(1, name.length - 2);
	      name = ctx.stylize(name, 'name');
	    } else {
	      name = name.replace(/'/g, "\\'")
	                 .replace(/\\"/g, '"')
	                 .replace(/(^"|"$)/g, "'");
	      name = ctx.stylize(name, 'string');
	    }
	  }
	
	  return name + ': ' + str;
	}
	
	
	function reduceToSingleString(output, base, braces) {
	  var numLinesEst = 0;
	  var length = output.reduce(function(prev, cur) {
	    numLinesEst++;
	    if (cur.indexOf('\n') >= 0) numLinesEst++;
	    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
	  }, 0);
	
	  if (length > 60) {
	    return braces[0] +
	           (base === '' ? '' : base + '\n ') +
	           ' ' +
	           output.join(',\n  ') +
	           ' ' +
	           braces[1];
	  }
	
	  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
	}
	
	
	// NOTE: These type checking functions intentionally don't use `instanceof`
	// because it is fragile and can be easily faked with `Object.create()`.
	function isArray(ar) {
	  return Array.isArray(ar);
	}
	exports.isArray = isArray;
	
	function isBoolean(arg) {
	  return typeof arg === 'boolean';
	}
	exports.isBoolean = isBoolean;
	
	function isNull(arg) {
	  return arg === null;
	}
	exports.isNull = isNull;
	
	function isNullOrUndefined(arg) {
	  return arg == null;
	}
	exports.isNullOrUndefined = isNullOrUndefined;
	
	function isNumber(arg) {
	  return typeof arg === 'number';
	}
	exports.isNumber = isNumber;
	
	function isString(arg) {
	  return typeof arg === 'string';
	}
	exports.isString = isString;
	
	function isSymbol(arg) {
	  return typeof arg === 'symbol';
	}
	exports.isSymbol = isSymbol;
	
	function isUndefined(arg) {
	  return arg === void 0;
	}
	exports.isUndefined = isUndefined;
	
	function isRegExp(re) {
	  return isObject(re) && objectToString(re) === '[object RegExp]';
	}
	exports.isRegExp = isRegExp;
	
	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}
	exports.isObject = isObject;
	
	function isDate(d) {
	  return isObject(d) && objectToString(d) === '[object Date]';
	}
	exports.isDate = isDate;
	
	function isError(e) {
	  return isObject(e) &&
	      (objectToString(e) === '[object Error]' || e instanceof Error);
	}
	exports.isError = isError;
	
	function isFunction(arg) {
	  return typeof arg === 'function';
	}
	exports.isFunction = isFunction;
	
	function isPrimitive(arg) {
	  return arg === null ||
	         typeof arg === 'boolean' ||
	         typeof arg === 'number' ||
	         typeof arg === 'string' ||
	         typeof arg === 'symbol' ||  // ES6 symbol
	         typeof arg === 'undefined';
	}
	exports.isPrimitive = isPrimitive;
	
	exports.isBuffer = __webpack_require__(24);
	
	function objectToString(o) {
	  return Object.prototype.toString.call(o);
	}
	
	
	function pad(n) {
	  return n < 10 ? '0' + n.toString(10) : n.toString(10);
	}
	
	
	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
	              'Oct', 'Nov', 'Dec'];
	
	// 26 Feb 16:19:34
	function timestamp() {
	  var d = new Date();
	  var time = [pad(d.getHours()),
	              pad(d.getMinutes()),
	              pad(d.getSeconds())].join(':');
	  return [d.getDate(), months[d.getMonth()], time].join(' ');
	}
	
	
	// log is just a thin wrapper to console.log that prepends a timestamp
	exports.log = function() {
	  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
	};
	
	
	/**
	 * Inherit the prototype methods from one constructor into another.
	 *
	 * The Function.prototype.inherits from lang.js rewritten as a standalone
	 * function (not on Function.prototype). NOTE: If this file is to be loaded
	 * during bootstrapping this function needs to be rewritten using some native
	 * functions as prototype setup using normal JavaScript does not work as
	 * expected during bootstrapping (see mirror.js in r114903).
	 *
	 * @param {function} ctor Constructor function which needs to inherit the
	 *     prototype.
	 * @param {function} superCtor Constructor function to inherit prototype from.
	 */
	exports.inherits = __webpack_require__(25);
	
	exports._extend = function(origin, add) {
	  // Don't do anything if add isn't an object
	  if (!add || !isObject(add)) return origin;
	
	  var keys = Object.keys(add);
	  var i = keys.length;
	  while (i--) {
	    origin[keys[i]] = add[keys[i]];
	  }
	  return origin;
	};
	
	function hasOwnProperty(obj, prop) {
	  return Object.prototype.hasOwnProperty.call(obj, prop);
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(23)))

/***/ },
/* 23 */
/***/ function(module, exports) {

	// shim for using process in browser
	
	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;
	
	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}
	
	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = setTimeout(cleanUpNextTick);
	    draining = true;
	
	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    clearTimeout(timeout);
	}
	
	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        setTimeout(drainQueue, 0);
	    }
	};
	
	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};
	
	function noop() {}
	
	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	
	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};
	
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 24 */
/***/ function(module, exports) {

	module.exports = function isBuffer(arg) {
	  return arg && typeof arg === 'object'
	    && typeof arg.copy === 'function'
	    && typeof arg.fill === 'function'
	    && typeof arg.readUInt8 === 'function';
	}

/***/ },
/* 25 */
/***/ function(module, exports) {

	if (typeof Object.create === 'function') {
	  // implementation from standard node.js 'util' module
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    ctor.prototype = Object.create(superCtor.prototype, {
	      constructor: {
	        value: ctor,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	  };
	} else {
	  // old school shim for old browsers
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    var TempCtor = function () {}
	    TempCtor.prototype = superCtor.prototype
	    ctor.prototype = new TempCtor()
	    ctor.prototype.constructor = ctor
	  }
	}


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var events = __webpack_require__(9);
	
	var block = function (closeButton, focusToContinue) {
	    return function () {
	        events.addEvent(closeButton, 'blur', focusToContinue);
	    };
	};
	
	var unblock = function (closeButton, focusToContinue) {
	    return function () {
	        events.removeEvent(closeButton, 'blur', focusToContinue);
	    };
	};
	
	function BlockerFactory(container, continueSelector, closeSelector) {
	    var closeButton = document.getElementsByClassName(closeSelector)[0];
	    
	    var focusToContinue = function (event) {
	        var continueButton = document.getElementsByClassName(continueSelector)[0];
	        if (continueButton) {
	            continueButton.focus();
	        }
	    };
	
	    return {
	        block: block(closeButton, focusToContinue),
	        unblock: unblock(closeButton, focusToContinue)
	    };
	}
	
	module.exports = BlockerFactory;

/***/ },
/* 27 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = function(fn) {
	    var readyStateCheckInterval = window.setInterval(function () {
	        if (document.readyState === 'complete') {
	            window.clearInterval(readyStateCheckInterval);
	            fn();
	        }
	    }, 10);
	};

/***/ },
/* 28 */
/***/ function(module, exports) {

	'use strict';
	
	function loadScript(url, callback) {
	    var head = document.head || document.getElementsByTagName('head')[0] || document.documentElement;
	    var script = document.createElement('script');
	
	    script.async = 'async';
	    script.src = url;
	
	    script.onload = script.onreadystatechange = function (_, abort) {
	        if (abort || !script.readyState || (/loaded|complete/).test(script.readyState)) {
	            script.onload = script.onreadystatechange = null;
	
	            if (head && script.parentNode) {
	                head.removeChild(script);
	            }
	
	            script = undefined;
	
	            if (!abort) {
	                callback();
	            }
	        }
	    };
	
	    head.insertBefore(script, head.firstChild);
	}
	
	module.exports = loadScript;

/***/ },
/* 29 */
/***/ function(module, exports) {

	'use strict';
	
	function getECToken(url) {
	    var parts = url.split('EC-');
	    return parts.length > 1 ? 'EC-' + parts[1].split('&')[0] : null;
	}
	
	module.exports = getECToken;

/***/ },
/* 30 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = function () {
	    var getProps = Object.getOwnPropertyNames,
	        cachedWindowNames = typeof window === 'object' ? Object.getOwnPropertyNames(window) : [],
	        defProp = Object.defineProperty,
	        toSource = Function.prototype.toString,
	        create = Object.create,
	        hasOwn = Object.prototype.hasOwnProperty,
	        funcName = /^\n?function\s?(\w*)?_?\(/; // eslint-disable-line fasec/no-unsafe-regex
	
	    function nameOf(func) {
	        var finalFunctionName = 'name' in func
	            ? func.name : toSource.call(func).match(funcName)[1],
	            underscoreName = '_name' in func
	                ? func._name : finalFunctionName;
	        return typeof func !== 'function'
	            ? '' : underscoreName;
	    }
	
	    function define(object, key, value) {
	        if (typeof key === 'function') {
	            value = key;
	            key = nameOf(value).replace(/_$/, '');
	        }
	        return defProp(object, key, { configurable: true, writable: true, value: value });
	    }
	
	    function namedFunction(name, func) {
	        // Undo the name-stripping that UglifyJS does
	        func._name = name;
	        return func;
	    }
	
	    var uids = create(null),
	        createUID = function () {
	            var key = Math.random().toString(36).slice(2);
	            return key in uids ? createUID() : uids[key] = key;
	        },
	        globalID = createUID();
	
	
	    define(Object, namedFunction('getOwnPropertyNames', function getOwnPropertyNames(obj) {
	        var coercedObj = Object(obj), props;
	        if (coercedObj.toString && coercedObj.toString() === '[object Window]') {
	            try {
	                props = getProps(obj);
	            } catch (e) {
	                props = cachedWindowNames;
	            }
	        } else {
	            props = getProps(obj);
	        }
	        try {
	            if (hasOwn.call(obj, globalID)) {
	                props.splice(props.indexOf(globalID), 1);
	            }
	        } catch (err) {
	            return cachedWindowNames;
	        }
	
	
	        return props;
	    }));
	};


/***/ },
/* 31 */
/***/ function(module, exports) {

	'use strict';
	
	// JSON Polyfill for unsupported older browser
	if (!window.JSON) {
	    window.JSON = {
	        parse: function (sJSON) { // eslint-disable-line strict
	            return eval('(' + sJSON + ')'); // eslint-disable-line no-eval
	        },
	        stringify: function stringify (vContent) { // eslint-disable-line strict
	            if (vContent instanceof Object) {
	                var sOutput = '';
	                if (vContent.constructor === Array) {
	                    // @TODO: Does this line of code work? for loops can have 4 arguments? huh?
	                    for (var nId = 0; nId < vContent.length; sOutput += this.stringify(vContent[nId]) + ',', nId++); // eslint-disable-line curly,no-extra-semi
	                    return '[' + sOutput.substr(0, sOutput.length - 1) + ']';
	                }
	                if (vContent.toString !== Object.prototype.toString) {
	                    return '\"' + vContent.toString().replace(/"/g, '\\$&') + '\"';
	                }
	                for (var sProp in vContent) {
	                    sOutput += '\"' + sProp.replace(/"/g, '\\$&') + '\":' + this.stringify(vContent[sProp]) + ',';
	                }
	                return '{' + sOutput.substr(0, sOutput.length - 1) + '}';
	            }
	            return typeof vContent === 'string' ? '\"' + vContent.replace(/"/g, '\\$&') + '\"' : String(vContent);
	        }
	    };
	}
	
	// Date.now polyfill
	if (!Date.now) {
	    Date.now = function() { // eslint-disable-line strict
	        return new Date().getTime();
	    };
	}

/***/ }
/******/ ]);

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
