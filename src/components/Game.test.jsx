import { render, screen, fireEvent } from "@testing-library/react";
import Game from "./Game";

describe("Game Component", () => {
  test("renders game interface", () => {
    render(<Game />);
    expect(screen.getByText("Word Scramble Game")).toBeInTheDocument();
    expect(screen.getByText("Submit Guess")).toBeInTheDocument();
    expect(screen.getByText("Get Hint")).toBeInTheDocument();
  });

  test("displays error for empty guess", () => {
    render(<Game />);
    const submitButton = screen.getByText("Submit Guess");
    fireEvent.click(submitButton);
    expect(screen.getByText("Please enter a valid word")).toBeInTheDocument();
  });

  test("shows hint when hint button is clicked", () => {
    render(<Game />);
    const hintButton = screen.getByText("Get Hint");
    fireEvent.click(hintButton);
    expect(
      screen.getByText(/A popular programming language|An electronic device/)
    ).toBeInTheDocument();
  });
});