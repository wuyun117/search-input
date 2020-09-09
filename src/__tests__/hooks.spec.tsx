import React from "react";
import { render, cleanup, act } from "@testing-library/react";
import { useDebounce } from "../hooks";

afterEach(() => {
  jest.clearAllMocks();
  jest.clearAllTimers();
  cleanup();
});

describe("useDebounce", () => {
  jest.useFakeTimers();

  it("returns value after a delay", async () => {
    const delay = 1000;
    const Test = ({ value }: { value: string }): React.ReactElement => {
      const debouncedValue = useDebounce(value, delay);
      return <div>{debouncedValue}</div>;
    };

    const oldText = "oldText";
    const updatedText = "updatedText";
    const { getByText, rerender } = render(<Test value={oldText} />);

    expect(getByText(oldText)).toBeTruthy();

    await act(async () => {
      rerender(<Test value={updatedText} />);
    });
    expect(getByText(oldText)).toBeTruthy();

    await act(async () => {
      jest.advanceTimersByTime(delay);
    });
    expect(getByText(updatedText)).toBeTruthy();
  });
});
