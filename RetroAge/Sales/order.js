
$(function() {
    function orderTimer() {
        jQuery('.timer-box__counter').each(function () {
            var timerBox = jQuery(this);
            var minBox = timerBox.find('.timer-box__minutes');
            var secBox = timerBox.find('.timer-box__seconds');
            var minVal = 15;
            var secVal = 0;
            var deadline = new Date(Date.parse(new Date()) + (minVal * 60 + secVal) * 1000);

            function getTimeRemaining(endtime) {
                var t = Date.parse(endtime) - Date.parse(new Date());
                var seconds = Math.floor(t / 1000 % 60);
                var minutes = Math.floor(t / 1000 / 60 % 60);
                return {
                    'total': t,
                    'minutes': minutes,
                    'seconds': seconds
                };
            }

            function initializeClock(endtime) {
                function updateClock() {
                    var t = getTimeRemaining(endtime);
                    minBox.text(('0' + t.minutes).slice(-2));
                    secBox.text(('0' + t.seconds).slice(-2));

                    if (t.total <= 0) {
                        clearInterval(timeinterval);
                    }
                }

                updateClock();
                var timeinterval = setInterval(updateClock, 1000);
            }

            initializeClock(deadline);
        });
    }
    orderTimer();
});




/**
 *
 * @param today - Today's date
 * @param businessDays - Business days for delivery
 * @returns {string}
 */
var calculateDeliveryDate = function calculateDeliveryDate(today = new Date(), businessDays = 2){

    // Estimated Delivery Date
    var _deliveryDate = today;

    // Total amount of days for package to arrive
    var _totalDays = businessDays;

    // Array of long form months
    var _months = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
        'August', 'September', 'October', 'November', 'December'];

    // Array of short form weekdays
    var _days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];

    // Loops through
    for(var _day = 1; _day <= _totalDays; _day++) {

        // Day in milliseconds
        var _oneDay = _day * 24 * 60 * 60 * 1000;

        // Returns the number of milliseconds between midnight of January 1, 1970 and the specified date
        var _todayMilliseconds = today.getTime()

        // Adds days to today's unix time
        _deliveryDate = new Date(_todayMilliseconds + _oneDay);

        // Get day of the week
        var _dayOfTheWeek = _deliveryDate.getDay()

        // Sunday is 0, Saturday is 6
        if(_dayOfTheWeek == 0 || _dayOfTheWeek == 6) {
            // Increase total days by 1
            _totalDays++;
        }

    }

    // Returns IE - Get it Wed, Apr 24 - Fri, Apr 26
    return _days[_deliveryDate.getDay()] + ', ' +
        _months[_deliveryDate.getMonth()] + ' ' +
        _deliveryDate.getDate();

}

// Wait for timeStamp to be available by server
setTimeout(function(){
    var arrivalRange = calculateDeliveryDate(new Date(timeStamp), 5);
    $('.estimated-arrival__date').html(arrivalRange);
}, 1000);



function getCreditCardType(cardNumber) {

    if(/^5[1-5]/.test(cardNumber)) {
        return 'master';
    } else if(/^4/.test(cardNumber)) {
        return 'visa';
    } else if(/^3[47]/.test(cardNumber)) {
        return 'amex';
    } else if(/^6(?:011|5[0-9]{2})[0-9]{3,}$/.test(cardNumber)) {
        return 'discover';
    } else if(/^35(?:2[89]|[3-8]\d)\d{12}$/.test(cardNumber)) {
        return 'jcb';
    } else {
        return 'unknown';
    }

}

function addCreditCardIcon(type) {

    switch (type) {
        case 'master':
            $('.payment-form__field--credit-card-icon').addClass('payment-form__field--mastercard-credit-card');
            break;

        case 'visa':
            $('.payment-form__field--credit-card-icon').addClass('payment-form__field--visa-credit-card');
            break;

        case 'amex':
            $('.payment-form__field--credit-card-icon').addClass('payment-form__field--amex-credit-card');
            break;

        case 'discover':
            $('.payment-form__field--credit-card-icon').addClass('payment-form__field--discover-credit-card');
            break;

        default:
            $('.payment-form__field--credit-card-icon').addClass('payment-form__field--unknown-credit-card');
            break;
    }

}

function handleEvent(event) {

    var type    = getCreditCardType($(this).val().replace(/-/g,''));

    $('#credit-card-type').val(type);


    $(this).val($(this).val().replace(/\D/g, '').match(/.{1,4}|^$/g).join('-'));

    $('.payment-form__field--credit-card-icon').removeClass('payment-form__field--unknown-credit-card payment-form__field--discover-credit-card payment-form__field--mastercard-credit-card payment-form__field--visa-credit-card payment-form__field--amex-credit-card');

    addCreditCardIcon(type);


}

$(function() {
    $(document).on('blur input keyup change', '[name="creditCardNumber"]', handleEvent);
});





/**
 *  @file Simple Form Field Validator
 *
 *  @version    1.0.1
 *  @requires   GIT:Jquery
 */



/**
 * Validates form fields against regular expressions
 * @param fieldRules
 * @constructor
 */
function Validity(fieldRules) {

    if (typeof fieldRules !== 'object') {
        throw new Error('fieldRules is expected to be an Object and is required')
    }

    // Contains form field data
    this.formData   = {};
    // Contains an array of form errors
    this.formError  = [];
    // Rules for the form fields
    this.fieldRules = fieldRules;
}

Validity.prototype = {

    // 1. Validate field against Field Rules
    validate : function () {

        // Clear
        this.formData  = {};
        this.formError = [];

        // TODO check fieldName hasOwnProperty

        // Loop through rules
        for (var fieldName in this.fieldRules) {

            // Select field
            var field = $('[name=' + fieldName + ']');

            // Get field value
            var value = field.val();

            if (fieldName === 'creditCardNumber') {
                // If credit card remove
                value = value.replace(/\D/g, '');
            }

            value = value.toLowerCase();

            // TODO add option for default css
            // Remove previous border styling
            field.css({
                'border': '1px solid #5da743'
            });

            // Get field rules
            var rule = this.fieldRules[fieldName]; // Add form data to object

            this.formData[fieldName] = value;

            // Check if Required
            if (rule.indexOf('required') !== -1) {
                if (value === '' || value == undefined) {
                    this.formError.push({
                        // field name
                        'fieldName'    : fieldName,
                        // failed rule
                        'failedRule'   : 'required',
                        // failed message
                        'failedMessage': 'Field Required'
                    });
                }
            }


            // Check if Credit Card Number
            if (rule.indexOf('credit card number') !== -1) {
                if (!/[0-9\-]/.test(value)) {
                    this.formError.push({
                        'fieldName'    : fieldName,
                        'failed_Rule'  : 'credit card number',
                        'failedMessage': 'Field should only contain Numbers & Hypens'
                    }); // console.log('field should only contain Numbers & Hypens');
                }
            }

            // Check if Number
            if (rule.indexOf('numbers') !== -1) {
                if (!/^\d+$/.test(value)) {
                    this.formError.push({
                        'fieldName'    : fieldName,
                        'failedRule'   : 'numbers',
                        'failedMessage': 'Field should only contain Numbers'
                    }); // console.log('field should only contain numbers');
                }
            }
            // Check if is numbers & letters
            if (rule.indexOf('letters') !== -1) {
                if (!/^[a-zA-Z]+$/.test(value)) {
                    this.formError.push({
                        'fieleName'    : fieldName,
                        'failedRule'   : 'letters',
                        'failedMessage': 'Field should only contain Letters'
                    });
                }
            }

            // Check if is numbers & letters
            if (rule.indexOf('numbers letters spaces periods hypens') !== -1) {
                if (!/^[0-9a-zA-Z\s-.]+$/.test(value)) {
                    this.formError.push({
                        'fieldName'    : fieldName,
                        'failedRule'   : 'numbers letters',
                        'failedMessage': 'Field should only contain Numbers, Letters, Periods, Spaces & Hypens'
                    });
                }
            }

            // Check if it is Email Address
            if (rule.indexOf('email') !== -1) {

                // Remove first and last spaces if found
                value = value.trim();

                if (!/^([\w_\.\-\+])+\@([\w\-]+\.)+([\w]{2,10})+$/.test(value)) {
                    this.formError.push({
                        'fieldName'    : fieldName,
                        'failedRule'   : 'email',
                        'failedMessage': 'Field should be formatted like an Email Address'
                    });
                }
            }

            // Check if Email Address matches
            if (rule.indexOf('match') !== -1) {

                if ($('[name=emailAddress]').val() !== $('[name=confirmEmailAddress]').val()) {
                    this.formError.push({
                        'fieldName'    : fieldName,
                        'failedRule'   : 'match',
                        'failedMessage': 'Field should match Email Address'
                    });
                }
            }
        }

        this.error();
    },

    // 2. Check for errors return boolean
    error    : function () {

        var errorField = $('.error-message');

        if (this.formError.length) {
            for (var error in this.formError) {
                // Select & add border to field with error
                var fieldSelect = $('[name=' + this.formError[error].fieldName + ']');
                // Add Red borders around
                fieldSelect.css({
                    'border': '1px solid #ff0000'
                });

                // Detect first found Error
                if (error == 0) {
                    // Focus on the first field in form that contains Error
                    fieldSelect.focus();
                    // Show Error Div
                    errorField.css({
                        'display': 'block'
                    });
                    // Insert Error Message
                    errorField.html(this.formError[error].failedMessage);
                    // Scroll Page to Error Message Div
                    errorField.animate({
                        scrollTop: 0
                    }, "slow");
                }
            }

        } else {
            // Clear error message
            errorField.html('');
            // Hide Error Message Div
            errorField.css({
                'display': 'none'
            });
        }
    },

    // 3. Return back if form is valid or not
    valid    : function () {
        return this.formError.length === 0;
    },

    // Returns back formData
    data     : function() {
        return this.formData;
    }
}










$(function () {

    $('.order-summary-mobile__title').stop().on('click', function () {
        var action = $('.order-summary-mobile__action');
        var content = $('.order-summary-mobile-content');

        if (content.is(':visible')) {
            action.text('+');
        } else {
            action.text('-');
        }

        content.fadeToggle(300);
    });

});



var step1_fieldRules = {
    'firstName'       : ['required', 'numbers letters spaces periods hypens'],
    'lastName'        : ['required', 'numbers letters spaces periods hypens'],
    'emailAddress'    : ['required', 'email'],
    'shippingAddress1': ['required'],
'shippingAddress2': ['not required'],
    'shippingCity'    : ['required', 'numbers letters spaces periods hypens'],
    'shippingState'   : ['required', 'numbers letters spaces periods hypens'],
    'shippingCountry' : ['required', 'numbers letters spaces periods hypens'],
    'phoneNumber'     : ['required', 'numbers letters spaces periods hypens'],
    'shippingZip'     : ['required', 'numbers letters spaces periods hypens'],
};

var step1 = new Validity(step1_fieldRules)

/**
 * Validates the Shipping form
 */
$(document).on('click', '.shipping-form__next-button', function() {

    step1.validate();

    if(!step1.valid()) {
        _scrollToErrorMessage();
        return;
    }


    $('.shipping-form').fadeOut(100, function(){
        $('.payment-form').fadeIn(1000, function() {

            $('#card_number').focus();
            $('html, body').animate({ scrollTop: $('.form').offset().top - 10 }, 'slow');


        });
    });


});





var step2_fieldRules = {
    'creditCardNumber': ['required', 'credit card number'],
    'creditCardType'  : ['required', 'letters'],
    'expirationMonth' : ['required', 'numbers'],
    'expirationYear'  : ['required', 'numbers'],
    'cvv'             : ['required', 'numbers letters']
};

var step2 = new Validity(step2_fieldRules)


/**
 * Validates the Payment form
 */
$(document).on('click', '.payment-form__next-button', function() {

    step2.validate();

    if(!step2.valid()) {
        _scrollToErrorMessage()
        return;
    }


    // Processing Messages
    $(this).prop('disabled', true);
    $('#processing-modal').modal('show');


    var formData = Object.assign(step1.data(), step2.data());


    _processPayment(formData);


});


function _scrollToErrorMessage() {
    $('html, body').animate({ scrollTop: $('.error-message').offset().top - 10 }, 'slow');
}

// The Post URL for the payment form
var postUrl = '/api/limelight/payment';

function  _processPayment(formData) {



    $.ajax({
        type   : 'post',
        url    : postUrl,
        data   : formData,
        success: function (resp) {

            console.log(resp)

            // Scroll the page up
            _scrollToErrorMessage();


            // Response was successful
            if(resp.status == true) {

                if(typeof pushDataLayer === 'function' &&  window['google_tag_manager']) {
                    pushDataLayer(resp.transaction, resp.product, function(id) {
                        window.location.href = resp[0];
                    });

                } else {
                    window.location.href = resp[0];
                }


            } else {
                // Enable Payment Button
                $('.payment-form__next-button').prop('disabled', false);

                // Hide Processing Modal
                $('#processing-modal').modal('hide');

                // Show Error Message
                $('.error-message').css({'display': 'block'}).html(resp.errorMessage);

                // Scroll page to Error Message
                _scrollToErrorMessage();
            }

        },
        error  : function () {
            console.log('error');
        }

    });


}



/**
 * Zip to State
 * @param zipCode
 * @returns {boolean|string}
 */
var getStateFromZip = function getStateFromZip(zipCode) {

    var stateAbbr = null;

    // Ensure you don't parse codes that start with 0 as octal values
    zipCode = parseInt(zipCode, 10);

    // Code blocks alphabetized by state
    if (zipCode >= 35000 && zipCode <= 36999) {
        stateAbbr = 'AL';
    }
    else if (zipCode >= 99500 && zipCode <= 99999) {
        stateAbbr = 'AK';
    }
    else if (zipCode >= 85000 && zipCode <= 86999) {
        stateAbbr = 'AZ';
    }
    else if (zipCode >= 71600 && zipCode <= 72999) {
        stateAbbr = 'AR';
    }
    else if (zipCode >= 90000 && zipCode <= 96699) {
        stateAbbr = 'CA';
    }
    else if (zipCode >= 80000 && zipCode <= 81999) {
        stateAbbr = 'CO';
    }
    else if (zipCode >= 6000 && zipCode <= 6999) {
        stateAbbr = 'CT';
    }
    else if (zipCode >= 19700 && zipCode <= 19999) {
        stateAbbr = 'DE';
    }
    else if (zipCode >= 32000 && zipCode <= 34999) {
        stateAbbr = 'FL';
    }
    else if (zipCode >= 30000 && zipCode <= 31999) {
        stateAbbr = 'GA';
    }
    else if (zipCode >= 96700 && zipCode <= 96999) {
        stateAbbr = 'HI';
    }
    else if (zipCode >= 83200 && zipCode <= 83999) {
        stateAbbr = 'ID';
    }
    else if (zipCode >= 60000 && zipCode <= 62999) {
        stateAbbr = 'IL';
    }
    else if (zipCode >= 46000 && zipCode <= 47999) {
        stateAbbr = 'IN';
    }
    else if (zipCode >= 50000 && zipCode <= 52999) {
        stateAbbr = 'IA';
    }
    else if (zipCode >= 66000 && zipCode <= 67999) {
        stateAbbr = 'KS';
    }
    else if (zipCode >= 40000 && zipCode <= 42999) {
        stateAbbr = 'KY';
    }
    else if (zipCode >= 70000 && zipCode <= 71599) {
        stateAbbr = 'LA';
    }
    else if (zipCode >= 3900 && zipCode <= 4999) {
        stateAbbr = 'ME';
    }
    else if (zipCode >= 20600 && zipCode <= 21999) {
        stateAbbr = 'MD';
    }
    else if (zipCode >= 1000 && zipCode <= 2799) {
        stateAbbr = 'MA';
    }
    else if (zipCode >= 48000 && zipCode <= 49999) {
        stateAbbr = 'MI';
    }
    else if (zipCode >= 55000 && zipCode <= 56999) {
        stateAbbr = 'MN';
    }
    else if (zipCode >= 38600 && zipCode <= 39999) {
        stateAbbr = 'MS';
    }
    else if (zipCode >= 63000 && zipCode <= 65999) {
        stateAbbr = 'MO';
    }
    else if (zipCode >= 59000 && zipCode <= 59999) {
        stateAbbr = 'MT';
    }
    else if (zipCode >= 27000 && zipCode <= 28999) {
        stateAbbr = 'NC';
    }
    else if (zipCode >= 58000 && zipCode <= 58999) {
        stateAbbr = 'ND';
    }
    else if (zipCode >= 68000 && zipCode <= 69999) {
        stateAbbr = 'NE';
    }
    else if (zipCode >= 88900 && zipCode <= 89999) {
        stateAbbr = 'NV';
    }
    else if (zipCode >= 3000 && zipCode <= 3899) {
        stateAbbr = 'NH';
    }
    else if (zipCode >= 7000 && zipCode <= 8999) {
        stateAbbr = 'NJ';
    }
    else if (zipCode >= 87000 && zipCode <= 88499) {
        stateAbbr = 'NM';
    }
    else if (zipCode >= 10000 && zipCode <= 14999) {
        stateAbbr = 'NY';
    }
    else if (zipCode >= 43000 && zipCode <= 45999) {
        stateAbbr = 'OH';
    }
    else if (zipCode >= 73000 && zipCode <= 74999) {
        stateAbbr = 'OK';
    }
    else if (zipCode >= 97000 && zipCode <= 97999) {
        stateAbbr = 'OR';
    }
    else if (zipCode >= 15000 && zipCode <= 19699) {
        stateAbbr = 'PA';
    }
    else if (zipCode >= 300 && zipCode <= 999) {
        stateAbbr = 'PR';
    }
    else if (zipCode >= 2800 && zipCode <= 2999) {
        stateAbbr = 'RI';
    }
    else if (zipCode >= 29000 && zipCode <= 29999) {
        stateAbbr = 'SC';
    }
    else if (zipCode >= 57000 && zipCode <= 57999) {
        stateAbbr = 'SD';
    }
    else if (zipCode >= 37000 && zipCode <= 38599) {
        stateAbbr = 'TN';
    }
    else if ( (zipCode >= 75000 && zipCode <= 79999) || (zipCode >= 88500 && zipCode <= 88599) ) {
        stateAbbr = 'TX';
    }
    else if (zipCode >= 84000 && zipCode <= 84999) {
        stateAbbr = 'UT';
    }
    else if (zipCode >= 5000 && zipCode <= 5999) {
        stateAbbr = 'VT';
    }
    else if (zipCode >= 22000 && zipCode <= 24699) {
        stateAbbr = 'VA';
    }
    else if (zipCode >= 20000 && zipCode <= 20599) {
        stateAbbr = 'DC';
    }
    else if (zipCode >= 98000 && zipCode <= 99499) {
        stateAbbr = 'WA';
    }
    else if (zipCode >= 24700 && zipCode <= 26999) {
        stateAbbr = 'WV';
    }
    else if (zipCode >= 53000 && zipCode <= 54999) {
        stateAbbr = 'WI';
    }
    else if (zipCode >= 82000 && zipCode <= 83199) {
        stateAbbr = 'WY';
    }
    else {
        stateAbbr = false;
    }
    return stateAbbr;
}


$(function() {
    $(document).on('change', '[name=shippingZip]', function(e) {
        var stateAbbr = getStateFromZip($(this).val());
        console.log(stateAbbr);
        $("[name=shippingState] option[value='" + stateAbbr + "']").prop('selected', true);
    });
});


/**
 * Google DataLayer
 * @param transaction
 * @param product
 * @param cb
 */
function pushDataLayer(transaction, product, cb) {

    window.dataLayer = window.dataLayer || [];

    window.dataLayer.push({
        event: 'eec.purchase',
        'eventCallback' : function(id) {
            if(id == 'GTM-NFRMXXB') {
                return cb(id);
            }
        },
        eventTimeout : 4000,
        // The quantity of the given product purchased.
        quantity: 1,
        // The price of one item. Same formatting instructions as with revenue.
        price: product.price,
        transactionId: transaction.orderId,
        testing: transaction.test,
        ecommerce: {
            currencyCode: 'USD',
            purchase: {
                // The unique order ID of the transaction.
                // Should match the actual ID of the order.
                actionField: {
                    // Transaction ID
                    id: transaction.orderId,
                    // Extra details about where the purchase happened.
                    affiliation: transaction.gatewayDescriptor,
                    // Total transaction value. You can include tax and shipping,
                    // or you can choose to send the revenue without tax and shipping.
                    // The value must not include anything else except number separated by
                    // a decimal point. Don’t use a comma as the separator, and don’t include
                    // any currency symbols.
                    revenue: transaction.orderTotal,
                    // Tax paid. Same formatting instructions as with revenue.
                    tax: transaction.orderSalesTaxAmount,
                    // Cost of shipping. Same formatting instructions as with revenue.
                    shipping: '0.00',
                },
                products: [{
                    // The SKU of the product.
                    id: product.sku,
                    // The name of the product.
                    name: product.name,
                    // The brand name of the product.
                    brand: 'Del Mar Laboratories',
                    // The quantity of the given product purchased.
                    quantity: 1,
                    // The price of one item. Same formatting instructions as with revenue.
                    price: product.price
                }]
            }
        }
    });


}
