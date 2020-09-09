import React from "react";
import { render, act, fireEvent } from "@testing-library/react";

import Button from "../components/Button/Button";

describe("Button component", () => {
  it("component render correctly", () => {
    const fn = jest.fn();
    const wrapper = render(<Button className="search__body--button" onClick={fn} />);
    expect(wrapper.container).toMatchSnapshot();
  });

  it("should have custom classname: search__body--button", async () => {
    const fn = jest.fn();
    const { getByTestId } = render(<Button className="search__body--button" onClick={fn} />);
    expect(getByTestId("search-alert-button")).toHaveClass("search__body--button");
  });

  it("should have only have classname Button", async () => {
    const fn = jest.fn();
    const { getByTestId } = render(<Button onClick={fn} />);
    expect(getByTestId("search-alert-button")).toHaveAttribute('class', 'Button ');
  });

  it("should trigger onclick event", async () => {
    const fn = jest.fn();
    const { getByTestId } = render(<Button className="search__body--button" onClick={fn} />);
    expect(fn).not.toBeCalled();
    await act(async () => {
      fireEvent.click(getByTestId("search-alert-button"));
    });
    expect(fn).toHaveBeenCalledTimes(1);
  });
});