/**
 * Copyright (c) 2016 Konstantin Kulinicenko.
 * Licensed under the MIT License (MIT), see
 * https://github.com/40818419/react-code-input
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { uuidv4 } from './utils';

const BACKSPACE_KEY = 8;
const LEFT_ARROW_KEY = 37;
const UP_ARROW_KEY = 38;
const RIGHT_ARROW_KEY = 39;
const DOWN_ARROW_KEY = 40;
const E_KEY = 69;

class ReactCodeInput extends Component {
  static codeInputs = [];

  static reset(){

    let code = ReactCodeInput.codeInputs[0];
    console.log('code', code);

    var inputs = [];

    for(var i=0; i < code.state.fields; i++){
      inputs.push('')
    }

    code.setState({
      input: inputs,
      updated: false
    });
  }

  constructor(props) {
    super(props);

    const { fields, type, isValid, disabled, filterKeyCodes, forceUppercase } = props;
    let { value } = props;

    if (forceUppercase) {
      value = value.toUpperCase();
    }

    this.state = {
      value,
      fields,
      type,
      input: [],
      isValid,
      disabled,
      updated: false,
      filterKeyCodes,
      defaultInputStyle: {
        fontFamily: 'monospace',
        MozAppearance: 'textfield',
        borderRadius: '6px',
        border: '1px solid',
        boxShadow: '0px 0px 10px 0px rgba(0,0,0,.10)',
        margin: '4px',
        // paddingLeft: '8px',
        width: '36px',
        height: '42px',
        fontSize: '32px',
        boxSizing: 'border-box',
      },
    };

    for (let i = 0; i < Number(this.state.fields); i += 1) {
      if (i < 32) {
        const value = this.state.value[i] || '';
        this.state.input.push(value);
      }
    }

    this.textInput = [];

    this.uuid = uuidv4();
  }

  componentDidMount() {
    ReactCodeInput.codeInputs.push(this);
  }


  componentWillReceiveProps(nextProps) {

    this.setState({
          isValid:  nextProps.isValid,
          value:    nextProps.value,
          disabled: nextProps.disabled,
          // updated: nextProps.updated
    });

    // console.log('updated',  nextProps.updated);

     //
     // if(this.state.updated){
     //   var inputs = [];
     //
     //   for(var i=0; i < this.state.fields; i++){
     //     inputs.push('')
     //   }
     //
     //   this.setState({
     //     input: inputs,
     //     updated: false
     //   });
     // }
  }

  handleBlur(e) {
    this.handleTouch(e.target.value);
  }

  handleTouch(value) {
    const { touch, untouch, name } = this.props;

    if (typeof touch === 'function' && typeof untouch === 'function') {
      if (value === '') {
        touch(name);
      } else {
        untouch(name);
      }
    }
  }

  handleChange(e) {
    // console.log("ReactCodeInput handleChange");
    var id = e.target.id;
    const { filterChars } = this.props;

    let value = String(e.target.value);

    if (this.props.forceUppercase) {
      value = value.toUpperCase();
    }

    if (this.state.type === 'number') {
        value = value.replace(/[^\d]/g, '');
    }

    // if(this.state.type === "otpCode") {
    //   console.log("otpCode value before ",value);
    //   console.log('otpCode test', this.containsArabicNumber(value));
    //   value = this.containsArabicNumber(value) ? this.convert(value) :  value;
    //   console.log("otpCode value after ",value);
    //   value = value.replace(/[^\d]/g, '');
    //   console.log("otpCode value final ",value);
    // }


    /** Filter Chars */
    value = value.split('').filter(currChar => !filterChars.includes(currChar)).join('');

    let fullValue = value;

    console.log('full Value', fullValue);

    if (value !== '') {
      const input = this.state.input.slice();

      console.log('input slice', input);

      if (value.length > 1) {
        value.split('').map((chart, i) => {
          if (Number(id.substring(id.length - 1)) + i < this.props.fields) {
            input[Number(id.substring(id.length - 1)) + i] = chart;
          }
          return false;
        });
      } else {
        input[Number(id.substring(id.length - 1))] = value;
      }

      input.map((s, i) => {
        if (this.textInput[i]) {
          this.textInput[i].value = s;
        }
        return false;
      });

      const newTarget = this.textInput[id.substring(id.length - 1) < input.length
        ? Number(id.substring(id.length - 1)) + 1
        : id.substring(id.length - 1)];

      if (newTarget) {
        newTarget.focus();
        newTarget.select();
      }

      fullValue = input.join('');

      this.setState({ value: input.join(''), input });
    }

    if (this.props.onChange && fullValue) {
      this.props.onChange(fullValue);
    }

    this.handleTouch(fullValue);
  }

  handleKeyDown(e) {
    var id = e.target.id;
    // console.log("ReactCodeInput handleKeyDown",id.substring(id.length - 1));
    const target = Number(id.substring(id.length - 1)),
      nextTarget = this.textInput[target + 1],
      prevTarget = this.textInput[target - 1];

    let input,
      value;

    if (this.state.filterKeyCodes.length > 0) {
      this.state.filterKeyCodes.map((item) => {
        if (item === e.keyCode) {
          e.preventDefault();
          return true;
        }
      });
    }

    switch (e.keyCode) {
      case BACKSPACE_KEY:
        // e.preventDefault();
        // this.textInput[target].value = '';
        input = this.state.input.slice();
        input[target] = '';
        value = input.join('');

        this.setState({ value, input });
        if (this.textInput[target].value === '') {
          if (prevTarget) {
            prevTarget.focus();
            prevTarget.select();
          }
        }
        if (this.props.onChange) {
          this.props.onChange(value);
        }
        break;

      case LEFT_ARROW_KEY:
        e.preventDefault();
        if (prevTarget) {
          prevTarget.focus();
          prevTarget.select();
        }
        break;

      case RIGHT_ARROW_KEY:
        e.preventDefault();
        if (nextTarget) {
          nextTarget.focus();
          nextTarget.select();
        }
        break;

      case UP_ARROW_KEY:
        e.preventDefault();
        break;

      case DOWN_ARROW_KEY:
        e.preventDefault();
        break;

      case E_KEY: // This case needs to be handled because of https://stackoverflow.com/questions/31706611/why-does-the-html-input-with-type-number-allow-the-letter-e-to-be-entered-in
        if (e.target.type === 'number') {
          e.preventDefault();
          break;
        }

      default:
        break;
    }

    this.handleTouch(value);

  }

  handleKeyPress(e){
    var id = e.target.id;
    const target = Number(id.substring(id.length - 1)),
      nextTarget = this.textInput[target + 1],
      prevTarget = this.textInput[target - 1];

      var value = parseInt(e.key);
      console.log('val', value);

      if(e.keyCode != 8 && isNaN(value)){
        e.preventDefault();
        this.textInput[target].value = '';
      }

      if(this.props.onKeyUp){
        this.props.onKeyUp(e);
      }

      // var key = e.charCode || e.keyCode || 0;
      // // // allow backspace, tab, delete, enter, arrows, numbers and keypad numbers ONLY
      // // // home, end, period, and numpad decimal
      // if(key == 0 || !(key == 8 || key == 9 || key == 13 || key == 46 || key == 110 || key == 190 ||
      //     (key >= 35 && key <= 40) || (key >= 48 && key <= 57) || (key >= 96 && key <= 105))){
      //       e.preventDefault();
      //       this.textInput[target].value = '';
      //   }

    // if(e.keyCode == 0 || !(e.keyCode >= 48 && e.keyCode <=57)){
    //   e.preventDefault();
    //   this.textInput[target].value = '';
    // }
  }

  render() {

    var { className, style = {}, inputStyle = {}, inputStyleInvalid = {}, type, autoFocus, pattern, inputMode } = this.props,
      { disabled, input, isValid, defaultInputStyle } = this.state,

      styles = {
        container: style,
        input: isValid ? inputStyle : inputStyleInvalid,
      };

    Object.assign(styles.container, {
      // display: 'inline-block',
    });

    if (!className && inputStyle.length === 0) {
      Object.assign(inputStyle, {
        defaultInputStyle,
        color: 'black',
        backgroundColor: 'white',
        borderColor: 'lightgrey',
      });
    }

    if (!className && inputStyleInvalid.length === 0) {
      Object.assign(inputStyleInvalid, {
        defaultInputStyle,
        color: '#b94a48',
        backgroundColor: '#f2dede',
        borderColor: '#eed3d7',
      });
    }

    if (disabled) {
      Object.assign(styles.input, {
        cursor: 'not-allowed',
        color: 'lightgrey',
        borderColor: 'lightgrey',
        backgroundColor: '#efeff1',
      });
    }

    return (
      <div className={classNames(className, 'react-code-input')} style={styles.container}>
        {input.map((value, i) => {
          return (
            <input
              ref={(ref) => {
                this.textInput[i] = ref;
              }}
              id={`${this.uuid}-${i}`}
              lang="en"
              data-id={i}
              autoFocus={autoFocus && (i === 0) ? 'autoFocus' : ''}
              value={value}
              key={`input_${i}`}
              type={type}
              min={0}
              max={9}
              maxLength={input.length === i + 1 ? 1 : input.length}
              style={styles.input}
              autoComplete="off"
              onFocus={(e) => e.target.select(e)}
              onBlur={(e) => this.handleBlur(e)}
              onChange={(e) => this.handleChange(e)}
              onKeyDown={(e) => this.handleKeyDown(e)}
              onKeyUp={(e) => this.handleKeyPress(e)}
              disabled={disabled}
              data-valid={isValid}
              pattern={pattern}
              inputMode={inputMode}
            />
          );
        })}
      </div>
    );
  }
}

ReactCodeInput.defaultProps = {
  autoFocus: true,
  isValid: true,
  disabled: false,
  forceUppercase: false,
  fields: 4,
  value: '',
  type: 'text',
  filterKeyCodes: [189, 190],
  filterChars: ['-', '.'],
};

ReactCodeInput.propTypes = {
    type: PropTypes.oneOf(['text', 'number', 'password', 'tel','otpCode']),
  fields: PropTypes.number,
  value: PropTypes.string,
  onChange: PropTypes.func,
  name: PropTypes.string,
  touch: PropTypes.func,
  untouch: PropTypes.func,
  className: PropTypes.string,
  isValid: PropTypes.bool,
  disabled: PropTypes.bool,
  style: PropTypes.object,
  inputStyle: PropTypes.object,
  inputStyleInvalid: PropTypes.object,
  autoFocus: PropTypes.bool,
  forceUppercase: PropTypes.bool,
  filterKeyCodes: PropTypes.array,
  filterChars: PropTypes.array,
  pattern: PropTypes.string,
  inputMode: PropTypes.oneOf([
    'verbatim', 'latin', 'latin-name', 'latin-prose',
    'full-width-latin', 'kana', 'kana-name', 'katakana',
    'numeric', 'tel', 'email', 'url',
  ]),
};

export default ReactCodeInput;
