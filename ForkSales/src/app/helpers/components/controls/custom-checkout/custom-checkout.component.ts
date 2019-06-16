import { Component, Input, OnInit, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import * as CustomCheckout from 'src/assets/js/customcheckout.js';

const noop = () => {
};

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CustomCheckoutComponent),
  multi: true
};

@Component({
  selector: 'app-custom-checkout',
  templateUrl: './custom-checkout.component.html',
  styleUrls: ['./custom-checkout.component.css']
})
export class CustomCheckoutComponent implements ControlValueAccessor, OnInit {
  //The internal data model
  customCheckout: CustomCheckout = CustomCheckout();
  payButtonDisabled = true;
  value: string;

  isCardNumberComplete = false;
  isCVVComplete = false;
  isExpiryComplete = false;

  //customCheckoutController = {

    init () {
      console.log('checkout.init()');
      this.createInputs();
      //this.addListeners();
    }

    createInputs () {
      console.log('checkout.createInputs()');
      let options = <any>{};

      // Create and mount the inputs
      options.placeholder = 'Card number';
      this.customCheckout.create('card-number', options).mount('#card-number');

      options.placeholder = 'CVV';
      this.customCheckout.create('cvv', options).mount('#card-cvv');

      options.placeholder = 'MM / YY';
      this.customCheckout.create('expiry', options).mount('#card-expiry');
    }

    addListeners() {
      var self = this;

      // listen for submit button
      if (document.getElementById('checkout-form') !== null) {
        document
          .getElementById('checkout-form')
          .addEventListener('submit', self.onSubmit.bind(self));
      }

      this.customCheckout.on('brand', function (event) {
        console.log('brand: ' + JSON.stringify(event));

        var cardLogo = 'none';
        if (event.brand && event.brand !== 'unknown') {
          var filePath =
            'https://cdn.na.bambora.com/downloads/images/cards/' +
            event.brand +
            '.svg';
          cardLogo = 'url(' + filePath + ')';
        }
        document.getElementById('card-number').style.backgroundImage = cardLogo;
      });

      this.customCheckout.on('blur', function (event) {
        console.log('blur: ' + JSON.stringify(event));
      });

      this.customCheckout.on('focus', function (event) {
        console.log('focus: ' + JSON.stringify(event));
      });

      this.customCheckout.on('empty', function (event) {
        console.log('empty: ' + JSON.stringify(event));

        if (event.empty) {
          if (event.field === 'card-number') {
            this.isCardNumberComplete = false;
          } else if (event.field === 'cvv') {
            this.isCVVComplete = false;
          } else if (event.field === 'expiry') {
            this.isExpiryComplete = false;
          }
          self.setPayButton(false);
        }
      });

      this.customCheckout.on('complete', function (event) {
        console.log('complete: ' + JSON.stringify(event));

        if (event.field === 'card-number') {
          this.isCardNumberComplete = true;
          self.hideErrorForId('card-number');
        } else if (event.field === 'cvv') {
          this.isCVVComplete = true;
          self.hideErrorForId('card-cvv');
        } else if (event.field === 'expiry') {
          this.isExpiryComplete = true;
          self.hideErrorForId('card-expiry');
        }

        self.setPayButton(
          this.isCardNumberComplete && this.isCVVComplete && this.isExpiryComplete
        );
      });

      this.customCheckout.on('error', function (event) {
        console.log('error: ' + JSON.stringify(event));

        if (event.field === 'card-number') {
          this.isCardNumberComplete = false;
          self.showErrorForId('card-number', event.message);
        } else if (event.field === 'cvv') {
          this.isCVVComplete = false;
          self.showErrorForId('card-cvv', event.message);
        } else if (event.field === 'expiry') {
          this.isExpiryComplete = false;
          self.showErrorForId('card-expiry', event.message);
        }
        self.setPayButton(false);
      });
    }

    onSubmit(event) {
      var self = this;

      console.log('checkout.onSubmit()');

      event.preventDefault();
      self.setPayButton(false);
      self.toggleProcessingScreen();

      var callback = function (result) {
        console.log('token result : ' + JSON.stringify(result));

        if (result.error) {
          self.processTokenError(result.error);
        } else {
          self.processTokenSucces(result.token);
        }
      };

      console.log('checkout.createToken()');
      this.customCheckout.createToken(callback);
    }

    hideErrorForId(id) {
      console.log('hideErrorForId: ' + id);

      var element = document.getElementById(id);

      if (element !== null) {
        var errorElement = document.getElementById(id + '-error');
        if (errorElement !== null) {
          errorElement.innerHTML = '';
        }

        var bootStrapParent = document.getElementById(id + '-bootstrap');
        if (bootStrapParent !== null) {
          bootStrapParent.classList.remove('has-error');
          bootStrapParent.classList.add('has-success');
        }
      } else {
        console.log('showErrorForId: Could not find ' + id);
      }
    }

    showErrorForId(id, message) {
      console.log('showErrorForId: ' + id + ' ' + message);

      var element = document.getElementById(id);

      if (element !== null) {
        var errorElement = document.getElementById(id + '-error');
        if (errorElement !== null) {
          errorElement.innerHTML = message;
        }

        var bootStrapParent = document.getElementById(id + '-bootstrap');
        if (bootStrapParent !== null) {
          bootStrapParent.classList.add('has-error');
          bootStrapParent.classList.remove('has-success');
        }
      } else {
        console.log('showErrorForId: Could not find ' + id);
      }
    }
    
    setPayButton(enabled) {
      console.log('checkout.setPayButton() disabled: ' + !enabled);

      var payButton = document.getElementById('pay-button');
      if (enabled) {
        this.payButtonDisabled = false;
        payButton.className = 'btn btn-primary';
      } else {
        this.payButtonDisabled = true;
        payButton.className = 'btn btn-primary disabled';
      }
    }

    toggleProcessingScreen() {
      var processingScreen = document.getElementById('processing-screen');
      if (processingScreen) {
        processingScreen.classList.toggle('visible');
      }
    }

    showErrorFeedback (message) {
      var xMark = '\u2718';
      // this.feedback = document.getElementById('feedback');
      // this.feedback.innerHTML = xMark + ' ' + message;
      // this.feedback.classList.add('error');
    }

    showSuccessFeedback(message) {
      var checkMark = '\u2714';
      // this.feedback = document.getElementById('feedback');
      // this.feedback.innerHTML = checkMark + ' ' + message;
      // this.feedback.classList.add('success');
    }
    
    processTokenError (error) {
      error = JSON.stringify(error, undefined, 2);
      console.log('processTokenError: ' + error);

      this.showErrorFeedback(
        'Error creating token: </br>' + JSON.stringify(error, null, 4)
      );
      this.setPayButton(true);
      this.toggleProcessingScreen();
    }
    processTokenSucces(token) {
      console.log('processTokenSuccess: ' + token);

      this.showSuccessFeedback('Success! Created token: ' + token);
      this.setPayButton(true);
      this.toggleProcessingScreen();

      // Use token to call payments api
      // this.makeTokenPayment(token);
    }
  //};

  ngOnInit(): void {
    this.init();
  }

  // Method that is invoked on an update of a model.
  updateChanges() {
    //    this.value = this.toggleDD ? this.selectedDDValue : this.textboxValue;
    console.log("updateChanges: " + this.value);
    this.onChangeCallback(this.value);
  }

  get isValid() {
    return (this.value && this.value.length > 0);
  }
  //Placeholders for the callbacks which are later providesd
  //by the Control Value Accessor
  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;

  //From ControlValueAccessor interface
  writeValue(value: any) {
    this.value = value;
    this.updateChanges();
  }

  //From ControlValueAccessor interface
  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  //From ControlValueAccessor interface
  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  diags(o) {
    return JSON.stringify(o);
  }
}

