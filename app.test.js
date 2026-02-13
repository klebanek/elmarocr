// Mock DOM globals
global.document = {
  addEventListener: jest.fn(),
  getElementById: jest.fn().mockReturnValue({
    addEventListener: jest.fn(),
    appendChild: jest.fn(),
    classList: { add: jest.fn(), remove: jest.fn() },
    style: {},
    value: "",
    textContent: "",
    innerHTML: "",
    querySelector: jest
      .fn()
      .mockReturnValue({ focus: jest.fn(), select: jest.fn() }),
    remove: jest.fn(),
  }),
  querySelectorAll: jest.fn().mockReturnValue({
    forEach: jest.fn(),
  }),
  createElement: jest.fn().mockReturnValue({
    style: {},
    classList: { add: jest.fn(), remove: jest.fn() },
    appendChild: jest.fn(),
    innerHTML: "",
    remove: jest.fn(),
  }),
  body: {
    appendChild: jest.fn(),
    removeChild: jest.fn(),
    style: {},
  },
  documentElement: {
    scrollTop: 0,
  },
};

global.window = {
  addEventListener: jest.fn(),
  scrollTo: jest.fn(),
  innerWidth: 1024,
  location: { reload: jest.fn() },
};

global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

global.navigator = {
  mediaDevices: {
    getUserMedia: jest.fn(),
  },
  vibrate: jest.fn(),
  serviceWorker: {
    register: jest.fn(),
  },
  hardwareConcurrency: 4,
};

global.URL = {
  createObjectURL: jest.fn().mockReturnValue("blob:test"),
  revokeObjectURL: jest.fn(),
};

global.Blob = jest.fn();

// Mock external libraries
global.Quagga = {
  init: jest.fn(),
  start: jest.fn(),
  stop: jest.fn(),
  onDetected: jest.fn(),
};

global.jspdf = {
  jsPDF: jest.fn().mockImplementation(() => ({
    setFontSize: jest.fn(),
    setTextColor: jest.fn(),
    text: jest.fn(),
    addPage: jest.fn(),
    save: jest.fn(),
    output: jest.fn().mockReturnValue(new Blob()),
    lastAutoTable: { finalY: 100 },
    setFont: jest.fn(),
  })),
};

global.JsBarcode = jest.fn();

global.XLSX = {
  utils: {
    book_new: jest.fn(),
    aoa_to_sheet: jest.fn(),
    book_append_sheet: jest.fn(),
    sheet_to_json: jest.fn().mockReturnValue([]),
  },
  read: jest.fn(),
  writeFile: jest.fn(),
};

const ElmarApp = require("./app");

describe("ElmarApp", () => {
  let app;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Mock init to prevent DOM errors during instantiation
    const originalInit = ElmarApp.prototype.init;
    ElmarApp.prototype.init = jest.fn();

    app = new ElmarApp();

    // Restore init for individual tests if needed
    ElmarApp.prototype.init = originalInit;
  });

  test("should initialize with default values", () => {
    expect(app.currentDocument).toBeNull();
    expect(app.documents).toEqual([]);
    expect(app.productDatabase).toEqual({});
    expect(app.currentScreen).toBe("startScreen");
  });

  test("isValidEAN13 should validate correct codes", () => {
    // Valid EAN-13 example: 5903240542246
    expect(app.isValidEAN13("5903240542246")).toBe(true);
    // Invalid EAN-13 (wrong checksum)
    expect(app.isValidEAN13("5903240542247")).toBe(false);
    // Invalid length
    expect(app.isValidEAN13("123456789012")).toBe(false);
    // Non-digit characters
    expect(app.isValidEAN13("590324054224a")).toBe(false);
  });

  test("escapeHtml should escape sensitive characters", () => {
    const input = '<script>alert("xss")</script> & more';
    const expected =
      "&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt; &amp; more";
    expect(app.escapeHtml(input)).toBe(expected);
  });

  test("findProductsByName should return matches from database", () => {
    app.productDatabase = {
      5903240542246: "Brzuszki z łososia wędzone",
      1234567890123: "Inny produkt",
      5907632658096: "Dorada wędzona",
    };

    const results = app.findProductsByName("wędzone");
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe("Brzuszki z łososia wędzone");

    const multipleResults = app.findProductsByName("wędz");
    expect(multipleResults).toHaveLength(2);
  });

  test("formatDate should return formatted date string", () => {
    expect(app.formatDate("2025-02-12")).toBe("12.02.2025");
    expect(app.formatDate("")).toBe("-");
    expect(app.formatDate(null)).toBe("-");
  });

  test("getCustomProductCount should return number of custom products from localStorage", () => {
    localStorage.getItem.mockReturnValue(
      JSON.stringify({
        123: "Test 1",
        456: "Test 2",
      }),
    );
    expect(app.getCustomProductCount()).toBe(2);

    localStorage.getItem.mockReturnValue(null);
    expect(app.getCustomProductCount()).toBe(0);
  });

  test("isCustomProduct should check if product is in custom products in localStorage", () => {
    localStorage.getItem.mockReturnValue(
      JSON.stringify({
        123: "Test 1",
      }),
    );
    expect(app.isCustomProduct("123")).toBe(true);
    expect(app.isCustomProduct("456")).toBe(false);
  });
});
