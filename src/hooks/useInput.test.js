import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useInput } from "./useInput";

describe("useInput hook", () => {
  it("should initialize with default empty string if no argument passed", () => {
    const { result } = renderHook(() => useInput());
    const [value] = result.current;
    expect(value).toBe("");
  });

  it("should initialize with custom initial value", () => {
    const { result } = renderHook(() => useInput("initial"));
    const [value] = result.current;
    expect(value).toBe("initial");
  });

  it("should update value when handleValueChange is called", () => {
    const { result } = renderHook(() => useInput("hello"));
    const [, handleValueChange] = result.current;

    act(() => {
      handleValueChange({ target: { value: "world" } });
    });

    expect(result.current[0]).toBe("world");
  });

  it("should update value directly using setValue", () => {
    const { result } = renderHook(() => useInput("first"));
    const [, , setValue] = result.current;

    act(() => {
      setValue("second");
    });

    expect(result.current[0]).toBe("second");
  });
});

