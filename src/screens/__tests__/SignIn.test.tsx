import { render, fireEvent, waitFor } from "@testing-library/react-native";
import React from "react";
import SignIn from "../SignIn";
import { useAuth } from "../../hooks/useAuth";

// ✅ mock dependencies
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock("../../utlis/EmailValidation", () => ({
  isValidEmail: (email: string) => email.includes("@"),
}));

jest.mock("../../mock/data.json", () => ({
  users: [{ email: "test@example.com" }],
}));

const mockSignIn = jest.fn();
jest.mock("../../hooks/useAuth", () => ({
  useAuth: jest.fn(),
}));

const mockedUseAuth = useAuth as jest.Mock;

describe("SigIn", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseAuth.mockReturnValue({
      signIn: mockSignIn,
      loading: false,
    });
  });

  it("renders the title and input fields", () => {
    const { getByText, getByPlaceholderText } = render(<SignIn />);
    expect(getByText("taskManager")).toBeTruthy();
    expect(getByPlaceholderText("emailPlaceholder")).toBeTruthy();
  });

  it("shows error when email is empty", () => {
    const { getByText, getByTestId } = render(<SignIn />);
    fireEvent.press(getByTestId("signInButton"));
    expect(getByText("emailRequired")).toBeTruthy();
  });

  it("shows error when email format is invalid", () => {
    const { getByText, getByPlaceholderText, getByTestId } = render(<SignIn />);
    fireEvent.changeText(getByPlaceholderText("emailPlaceholder"), "invalidemail");
    fireEvent.press(getByTestId("signInButton"));
    expect(getByText("Invalid email format")).toBeTruthy();
  });

  it("shows error when email is not found in mockData", async () => {
    const { getByText, getByPlaceholderText, getByTestId } = render(<SignIn />);
    fireEvent.changeText(getByPlaceholderText("emailPlaceholder"), "unknown@example.com");
    fireEvent.press(getByTestId("signInButton"));
    await waitFor(() => expect(getByText("emailNotFound")).toBeTruthy());
  });

  it("calls signIn with valid email", async () => {
    const { getByPlaceholderText, getByTestId } = render(<SignIn />);
    fireEvent.changeText(getByPlaceholderText("emailPlaceholder"), "test@example.com");
    fireEvent.press(getByTestId("signInButton"));
    await waitFor(() => expect(mockSignIn).toHaveBeenCalledWith("test@example.com"));
  });

  it("shows loading indicator when loading=true", () => {
    mockedUseAuth.mockReturnValue({
      signIn: mockSignIn,
      loading: true,
    });
    const { getByTestId } = render(<SignIn />);
    expect(getByTestId("ActivityIndicator")).toBeTruthy();
  });
});
