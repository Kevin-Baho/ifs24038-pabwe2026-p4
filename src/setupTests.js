import "@testing-library/jest-dom";

vi.mock("sweetalert2", () => {
  const fire = vi.fn().mockResolvedValue({ isConfirmed: true });
  return {
    default: { fire },
    fire,
  };
});

if (typeof window !== "undefined") {
  window.URL.createObjectURL = vi.fn(() => "blob:http://localhost/mock-preview");
  window.URL.revokeObjectURL = vi.fn();
  window.scrollTo = vi.fn();
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});
