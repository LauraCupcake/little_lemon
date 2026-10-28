// Adds custom jest matchers such as toBeInTheDocument() and toHaveAttribute().
import '@testing-library/jest-dom';

// jsdom does not implement scrolling; stub it so the router can call it.
window.scrollTo = jest.fn();
Element.prototype.scrollIntoView = jest.fn();
