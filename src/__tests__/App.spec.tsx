import React from "react";
import { render, act, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";

import App from "../App";

describe("App container", () => {
  it("Intial status should be empty input and resultslist", () => {
    const { getByTestId, queryAllByRole } = render(<App />);
    expect(getByTestId("search-input")).toHaveValue("");
    expect(queryAllByRole("listitem")).toHaveLength(0);
  });

  it("Input Sydney, search suggestions should only list 4 out of 5 search results", async () => {
    const value = "Sydney";
    const { getByTestId, getAllByRole } = render(<App />);
    expect(getByTestId("search-input")).toHaveValue('');
    await act(async () => {
      fireEvent.change(getByTestId("search-input"), {
        target: { value },
      });
    });
    expect(getByTestId("search-input")).toHaveValue(value);
    await act(async () => {
      jest
        .spyOn(axios, "get")
        .mockImplementation(() => Promise.resolve({ data }));
    })
    await waitFor(() => expect(getAllByRole("option")).toHaveLength(4));
  })

  it(`
    1. Select one suggestion should display full name in the input box and hide selection suggestion drop down
    2. Should trigger window.alert recent selection whne click button
    `, async () => {
    const value = "Sydney";
    const suggestionIndex = 2;
    const fn = jest.fn();
    window.alert = fn;
    const { getByTestId, getAllByRole, queryAllByRole } = render(<App />);
    expect(getByTestId("search-input")).toHaveValue('');
    await act(async () => {
      fireEvent.change(getByTestId("search-input"), {
        target: { value },
      });
    });
    expect(getByTestId("search-input")).toHaveValue(value);
    await act(async () => {
      jest
        .spyOn(axios, "get")
        .mockImplementation(() => Promise.resolve({ data }));
    });
    await waitFor(() => expect(getAllByRole("option")).toHaveLength(4));
    await act(async () => {
      fireEvent.click(getAllByRole("option")[suggestionIndex], {
        item: data[suggestionIndex]
      });
    });
    expect(getByTestId("search-input")).toHaveValue(`${data[suggestionIndex].name}, ${data[suggestionIndex].state.abbreviation}`);
    expect(queryAllByRole("option")).toHaveLength(0);
    await act(async () => {
      fireEvent.click(getByTestId("search-alert-button"));
    });
    expect(fn).toBeCalledWith('You recently selected Sydney International Airport, NSW');
  })

  it("click enter/return btn should display full name in the input box", async () => {
    const value = "Sydney";
    const suggestionIndex = 2;
    const item = data[suggestionIndex];
    const event = { key: 'Enter',  keyCode: 13 }
    const { getByTestId, getAllByRole } = render(<App />);
    expect(getByTestId("search-input")).toHaveValue('');
    await act(async () => {
      fireEvent.change(getByTestId("search-input"), {
        target: { value },
      });
    });
    expect(getByTestId("search-input")).toHaveValue(value);
    await act(async () => {
      jest
        .spyOn(axios, "get")
        .mockImplementation(() => Promise.resolve({ data }));
    });
    await waitFor(() => expect(getAllByRole("option")).toHaveLength(4));
    await act(async () => {
      fireEvent.mouseEnter(getAllByRole('option')[suggestionIndex], {
        item
      });
    });
    await act(async () => {
      fireEvent.keyUp(getByTestId("search-input"), {
        ...event
      });
    });
    expect(getByTestId("search-input")).toHaveValue(`${data[suggestionIndex].name}, ${data[suggestionIndex].state.abbreviation}`);
  })

  it("click keyup or keydown arrow btn will move the selected suggestion", async () => {
    const value = "Sydney";
    const keyUpEvent = { key: 'ArrowUp',  keyCode: 38 }
    const keyDownEvent = { key: 'ArrowDown',  keyCode: 40 }
    const { getByTestId, getAllByRole, queryAllByRole } = render(<App />);
    expect(getByTestId("search-input")).toHaveValue('');
    await act(async () => {
      fireEvent.change(getByTestId("search-input"), {
        target: { value },
      });
    });
    expect(getByTestId("search-input")).toHaveValue(value);
    await act(async () => {
      jest
        .spyOn(axios, "get")
        .mockImplementation(() => Promise.resolve({ data }));
    });
    await waitFor(() => expect(getAllByRole("option")).toHaveLength(4));
    await act(async () => {
      fireEvent.keyUp(getByTestId("search-input"), {
        ...keyUpEvent
      });
    });
    expect(queryAllByRole("option")[3]).toHaveClass("ResultsList-item selected");
    await act(async () => {
      fireEvent.keyUp(getByTestId("search-input"), {
        ...keyDownEvent
      });
    });
    expect(queryAllByRole("option")[0]).toHaveClass("ResultsList-item selected");
  })

  it("should not trigger selection before suggestion is targeted", async () => {
    const value = "Sydney";
    const suggestionIndex = 2;
    const event = { key: 'Enter',  keyCode: 13 }
    const { getByTestId, getAllByRole } = render(<App />);
    expect(getByTestId("search-input")).toHaveValue('');
    await act(async () => {
      fireEvent.change(getByTestId("search-input"), {
        target: { value },
      });
    });
    expect(getByTestId("search-input")).toHaveValue(value);
    await act(async () => {
      jest
        .spyOn(axios, "get")
        .mockImplementation(() => Promise.resolve({ data }));
    });
    await waitFor(() => expect(getAllByRole("option")).toHaveLength(4));
    await act(async () => {
      fireEvent.keyUp(getByTestId("search-input"), {
        ...event
      });
    });
    expect(getByTestId("search-input")).toHaveValue(value);
  })

  it("Should only display one suggestion: Sydenham, Vic when input syd, vic", async () => {
    const value = "syd, vic";
    const { getByTestId, getAllByRole, getByText } = render(<App />);
    expect(getByTestId("search-input")).toHaveValue('');
    await act(async () => {
      fireEvent.change(getByTestId("search-input"), {
        target: { value },
      });
    });
    expect(getByTestId("search-input")).toHaveValue(value);
    await act(async () => {
      jest
        .spyOn(axios, "get")
        .mockImplementation(() => Promise.resolve({ data }));
    });
    await waitFor(() => expect(getAllByRole("option")).toHaveLength(1));
    expect(getByText('Sydenham, VIC')).toBeInTheDocument();
  })

  it("Should trigger window.alert when click button and there is no select history", async () => {
    const { getByTestId } = render(<App />);
    const fn = jest.fn();
    window.alert = fn;
    await act(async () => {
      fireEvent.click(getByTestId("search-alert-button"));
    });
    expect(fn).toBeCalledWith('You have not selected yet!');
  })

  it("Should log err when http request is failure", async () => {
    const value = "Sydney";
    const { getByTestId, getByText } = render(<App />);
    expect(getByTestId("search-input")).toHaveValue('');
    act(() => {
      fireEvent.change(getByTestId("search-input"), {
        target: { value },
      });
    });
    expect(getByTestId("search-input")).toHaveValue(value);
    act(() => {
      jest
        .spyOn(axios, "get")
        .mockRejectedValueOnce(new Error('Network error'));
    })
    await waitFor(() => expect(getByText("network error, please try it again!")).toBeInTheDocument());
  })
})

const data = [
  { name: "Sydney South", state: { abbreviation: "NSW" } },
  { name: "Sydney", state: { abbreviation: "NSW" } },
  { name: "Sydney International Airport", state: { abbreviation: "NSW" } },
  { name: "Sydney Domestic Airport", state: { abbreviation: "NSW" } },
  { name: "Sydenham", state: { abbreviation: "VIC" } }
];