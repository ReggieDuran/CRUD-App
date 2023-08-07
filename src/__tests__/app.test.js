import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect"; // for DOM matchers
import { rest } from "msw";
import { setupServer } from "msw/node";
import App from "../App";

// Set up the server to mock API requests
const server = setupServer(
  rest.get("https://dummyjson.com/users", (req, res, ctx) => {
    return res(
      ctx.json({
        users: [
          {
            id: 1,
            firstName: "John",
          },
          {
            id: 2,
            firstName: "Jane",
          },
        ],
      })
    );
  })
  // Add other API handlers if needed
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('renders the "Create New User" button', () => {
  render(<App />);
  const createButton = screen.getByText("Create New User");
  expect(createButton).toBeInTheDocument();
});

test("displays users fetched from the API", async () => {
  render(<App />);
  // Ensure that the users are fetched and displayed on the screen
  await waitFor(() => {
    const users = screen.getAllByTestId("user");
    expect(users.length).toBe(2); // Two users fetched from the mock API
  });
});

test('opens the "New User" drawer when "Create New User" button is clicked', () => {
  render(<App />);
  const createButton = screen.getByText("Create New User");
  fireEvent.click(createButton);

  const newUserDrawer = screen.getByText("New User");
  expect(newUserDrawer).toBeInTheDocument();
});

// test('opens the "Edit User" drawer with user data when "Edit" button is clicked', async () => {
//   await render(<App />);
//   const editButton = screen.getByText("Edit");
//   fireEvent.click(editButton);

//   const editUserDrawer = screen.getByText("Edit User");
//   expect(editUserDrawer).toBeInTheDocument();

//   const firstNameInput = screen.getByLabelText("First name");
//   expect(firstNameInput).toHaveValue("John"); // Assuming the first user has the name "John"
// });

// test('deletes a user when "Delete" button is clicked', async () => {
//   render(<App />);
//   const deleteButton = screen.getByText("Delete");
//   fireEvent.click(deleteButton);

//   // Ensure that the user is deleted and no longer displayed on the screen
//   await waitFor(() => {
//     const users = screen.queryAllByTestId("user");
//     expect(users.length).toBe(1); // Only one user left after deletion
//   });
// });
