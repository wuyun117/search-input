import React from "react";
import { render, act, fireEvent } from "@testing-library/react";

import Input from "../components/Input/Input";

describe("Button component", () => {
  it("component render correctly", () => {
    const changeFn = jest.fn();
    const keyUpFn = jest.fn();
    const wrapper = render(<Input value="Syd" placeholder="Search Input" onChange={changeFn} onKeyUp={keyUpFn} />);
    expect(wrapper.container).toMatchSnapshot();
  });

  it("should have placeholder: Search Input and value: Sydney", async () => {
    const changeFn = jest.fn();
    const keyUpFn = jest.fn();
    const { getByTestId } = render(<Input value="Sydney" placeholder="Search Input" onChange={changeFn} onKeyUp={keyUpFn} />);
    expect(getByTestId("search-input")).toHaveAttribute('placeholder', 'Search Input');
    expect(getByTestId("search-input")).toHaveValue('Sydney');
  });

  it("should trigger onclick event", async () => {
    const changeFn = jest.fn();
    const keyUpFn = jest.fn();
    const value = "Chatswood";
    const { getByTestId } = render(<Input value="Sydney" placeholder="Search Input" onChange={changeFn} onKeyUp={keyUpFn} />);
    expect(getByTestId("search-input")).toHaveValue('Sydney');
    await act(async () => {
      fireEvent.change(getByTestId("search-input"), {
        target: { value },
      });
    });
    expect(changeFn).toHaveBeenLastCalledWith(value);
  });

  it("should trigger onKeyUp event", async () => {
    const changeFn = jest.fn();
    const keyUpFn = jest.fn();
    const event = {
      key: 'ArrowUp',
      keyCode: 38
    }
    const { getByTestId } = render(<Input value="Sydney" placeholder="Search Input" onChange={changeFn} onKeyUp={keyUpFn} />);
    expect(getByTestId("search-input")).toHaveValue('Sydney');
    await act(async () => {
      fireEvent.keyUp(getByTestId("search-input"), {
        ...event
      });
    });
    expect(keyUpFn).toHaveBeenLastCalledWith(event.key, event.keyCode);
  });
});