import { countIndex } from "../util";

describe("countIndex util", () => {
  it("keyup should select last item in intial status", () => {
    expect(countIndex(-1, 5, 'up')).toBe(4)
  })
  it("Keyup shuld return above item in noral case", () => {
    expect(countIndex(3, 5, 'up')).toBe(2)
  })
  it("keyup should select last item when current fouces item is the first one", () => {
    expect(countIndex(0, 5, 'up')).toBe(4)
  })
  it("keydown should select first item in intial status", () => {
    expect(countIndex(-1, 5, 'down')).toBe(0)
  })
  it("keydonw shuld return next item in noral case", () => {
    expect(countIndex(3, 5, 'down')).toBe(4)
  })
  it("keyup should select first item when current fouces item is the last one", () => {
    expect(countIndex(4, 5, 'down')).toBe(0)
  })
  it("abnormal cases just return index as it is", () => {
    expect(countIndex(5, 5, 'down')).toBe(5)
  })

  it("if totalNumber is equal 0 should return index as it is ", () => {
    expect(countIndex(5, 0, 'down')).toBe(5)
  })
})