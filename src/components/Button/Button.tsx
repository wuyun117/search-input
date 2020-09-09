import React, { MouseEvent } from "react";
import PropTypes from "prop-types";
import iconPath from "./icons.svg";
import "./Button.scss";

/**
 * <Button
 *   className="MyButton"
 *   onClick={() => console.log('Click')} 
 * />
 *
 * @prop {Function} onClick
 * @prop {mixed} ... All other props will be forwarded to the native DOM button.

 */

interface IButtonProps {
  className?: string;
  onClick: (event: MouseEvent) => void;
}

const Button: React.FC<IButtonProps> = (props: IButtonProps) => {
  const { className, onClick, ...otherProps } = props;

  return (
    <button
      type="button"
      className={"Button " + (className || "")}
      onClick={onClick}
      data-testid="search-alert-button"
      {...otherProps}
    >
      <svg viewBox="0 0 24 24" width="24" height="16">
        <use xlinkHref={iconPath + "#dls-icon-arrow-right"} />
      </svg>
    </button>
  );
}

Button.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func.isRequired
}

export default Button
