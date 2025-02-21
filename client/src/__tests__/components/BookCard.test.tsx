import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import BookCard from "../../components/BookCard";

// A sample book object to use in our tests
const mockBook = {
	bookId: "123",
	title: "Sample Book",
	authors: ["John Doe", "Jane Doe"],
	description: "A test book description",
	image: "http://example.com/book.jpg",
	link: "http://example.com/book",
};

describe("BookCard Component", () => {
	it("renders book details correctly", () => {
		render(<BookCard book={mockBook} onSave={jest.fn()} isSaved={false} />);

		// Check that the book title is rendered
		expect(screen.getByText(/sample book/i)).toBeInTheDocument();
		// Check that the authors are rendered correctly
		expect(screen.getByText(/john doe, jane doe/i)).toBeInTheDocument();
		// Check that the description is rendered
		expect(screen.getByText(/a test book description/i)).toBeInTheDocument();

		// Check that Save button is present when the book is not already saved
		expect(
			screen.getByRole("button", { name: /save this book/i })
		).toBeInTheDocument();
	});

	it("calls onSave when save button is clicked", () => {
		const mockOnSave = jest.fn();
		render(<BookCard book={mockBook} onSave={mockOnSave} isSaved={false} />);

		const saveButton = screen.getByRole("button", { name: /save this book/i });
		fireEvent.click(saveButton);

		expect(mockOnSave).toHaveBeenCalledTimes(1);
		expect(mockOnSave).toHaveBeenCalledWith(mockBook.bookId);
	});

	it("displays a disabled save button when the book is already saved", () => {
		render(<BookCard book={mockBook} onSave={jest.fn()} isSaved={true} />);

		// Assume the button text changes when disabled
		const disabledButton = screen.getByRole("button", {
			name: /this book has already been saved/i,
		});
		expect(disabledButton).toBeDisabled();
	});
});
