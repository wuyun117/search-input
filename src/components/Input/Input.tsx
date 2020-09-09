import React from "react";
import PropTypes from "prop-types";
import "./Input.scss";

/**
 * <Input
 *   className="MyInput"
 *   data-something="Value"
 *   value="Hello, World!"
 *   onChange={(value) => console.log('You typed', value)}
 * />
 *
 * @prop {string} value The default value for the input.
 * @prop {string} placeholder The placeholder text.
 * @prop {Function} onChange Callback that will receive current input value.
 * @prop {mixed} ... All other props will be forwarded to the native DOM input.
 */

interface IInputProps {
  id?: string;
  className?: string;
  placeholder?: string;
  value: string;
  onChange: (arg: string) => void;
  onKeyUp: (arg1: string, arg2: number, ) => void;
}

const Input: React.FC<IInputProps> = (props: IInputProps) => {

  const { className, value, onChange, onKeyUp, ...otherProps } = props;

  return (
    <input
      className={"Input " + (className || "")}
      type="text"
      value={value}
      data-testid="search-input"
      onChange={event => onChange(event.target.value)}
      onKeyUp={event => onKeyUp(event.key, event.keyCode)}
      {...otherProps}
    />
  );
}

Input.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onKeyUp: PropTypes.func.isRequired
}

export default Input;
