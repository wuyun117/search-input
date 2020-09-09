import React from "react";
import { render, act, fireEvent } from "@testing-library/react";

import ResultsList from "../components/ResultsList/ResultsList";

describe("Button component", () => {
  it("component render correctly", () => {
    const selectFn = jest.fn();
    const hoverFn = jest.fn();
    const { container } = render(<ResultsList items={items} selectedIndex={2} onSelect={selectFn} onHover={hoverFn}/>);
    expect(container).toMatchSnapshot();
  });

  it("should have 5 suggestions", () => {
    const selectFn = jest.fn();
    const hoverFn = jest.fn();
    const { getAllByRole,  getByText} = render(<ResultsList items={items} selectedIndex={2} onSelect={selectFn} onHover={hoverFn}/>);
    expect(getAllByRole('option')).toHaveLength(5);
    expect(getByText('Sydney South, NSW')).toBeInTheDocument();
    expect(getByText('Sydney, NSW')).toBeInTheDocument();
    expect(getByText('Sydney International Airport, NSW')).toBeInTheDocument();
    expect(getByText('Sydney Domestic Airport, NSW')).toBeInTheDocument();
    expect(getByText('Sydenham, VIC')).toBeInTheDocument();
  });

  it("should trigger onSelect event", async () => {
    const selectFn = jest.fn();
    const hoverFn = jest.fn();
    const item = items[0];
    const { getAllByRole} = render(<ResultsList items={items} selectedIndex={2} onSelect={selectFn} onHover={hoverFn}/>);
    await act(async () => {
      fireEvent.click(getAllByRole('option')[0], {
        item
      });
    });
    expect(selectFn).toHaveBeenCalledWith(item);
  });

  it("should trigger onMouseEnter event", async () => {
    const selectFn = jest.fn();
    const hoverFn = jest.fn();
    const item = items[0];
    const { getAllByRole} = render(<ResultsList items={items} selectedIndex={2} onSelect={selectFn} onHover={hoverFn}/>);
    await act(async () => {
      fireEvent.mouseEnter(getAllByRole('option')[0], {
        item
      });
    });
    expect(hoverFn).toHaveBeenCalledWith(item);
  });
});

const items = [
  { name: "Sydney South", state: { abbreviation: "NSW" } },
  { name: "Sydney", state: { abbreviation: "NSW" } },
  { name: "Sydney International Airport", state: { abbreviation: "NSW" } },
  { name: "Sydney Domestic Airport", state: { abbreviation: "NSW" } },
  { name: "Sydenham", state: { abbreviation: "VIC" } }
];