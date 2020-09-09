import React from "react";
import PropTypes from "prop-types";
import "./ResultsList.scss";

/**
 * <ResultsList
 *   items={[...]}
 *   onSelect={item => console.log(item.name)}
 *   className="MyResultsList"
 * />
 *
 * @prop {Array} items List of results of form { name: string, state: { abbreviation: string } }
 * @prop {Function} onSelect Callback to execute when item is selected, accepts object.
 * @prop {mixed} ... All other props will be forwarded to the container DOM node.
 */

export type Suggestion = {
  latitude?: number;
  locality?: string;
  longtitude?: number;
  name: string;
  postcode?: number;
  state: {
    abbreviation: string;
    name?: string;
  }
}

interface IResultsListProps {
  className?: string;
  items: Array<Suggestion>;
  selectedIndex: number;
  onSelect: (arg: Suggestion) => void;
  onHover: (arg: Suggestion) => void;
}

const ResultsList: React.FC<IResultsListProps> = (props: IResultsListProps) => {
  const { className, selectedIndex, onSelect, onHover, items, ...otherProps } = props;

  return (
    <ul className={"ResultsList " + (className || "")} {...otherProps} tabIndex={0}>
      {items.map(function (item: Suggestion, index: number) {
        return (
          <li
            key={"item-" + index}
            className={`ResultsList-item ${selectedIndex === index ? 'selected' : ''}`}
            onClick={() => onSelect && onSelect(item)}
            onMouseEnter={() => onHover && onHover(item)}
            role="option"
            aria-selected={index === 2 ? true : false}
          >
            <span className="ResultsList-text">
              {item.name}, {item.state.abbreviation}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

ResultsList.propTypes = {
  className: PropTypes.string,
  items: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired,
  onHover: PropTypes.func.isRequired
}

export default ResultsList;
