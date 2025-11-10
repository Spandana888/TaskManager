import { fireEvent, render, waitFor } from "@testing-library/react-native";
import SignIn from "../SignIn";

jest.mock("../../hooks/useAuth", () => ({
  useAuth: jest.fn(),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key, // simply return the key
  }),
}));

jest.mock("../../utlis/EmailValidation", () => ({
  isValidEmail: jest.fn(),
}));

jest.mock("../../mock/data.json", () => ({
  users: [{ email: "test@example.com" }],
}));

jest.mock('@rneui/themed', () => ({
  Button: ({ title, onPress }: { title: string; onPress: () => void }) => (
    <button onClick={onPress}>{title}</button>
  ),
}));

const flushPromises = () => new Promise(setImmediate);

describe("SigIn", () => {
  const mockSignIn = jest.fn();
  const { useAuth } = require("../../hooks/useAuth");
  const { isValidEmail } = require("../../utlis/EmailValidation");

  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({
      signIn: mockSignIn,
      loading: false,
    });
  });

  
  it("renders the title and input fields", () => {
    const { getByText, getByPlaceholderText } = render(<SignIn />);
    expect(getByText("taskManager")).toBeTruthy();
    expect(getByText("signIn")).toBeTruthy();
    expect(getByPlaceholderText("emailPlaceholder")).toBeTruthy();
  });

  it("shows error when email is empty", async () => {
    const { getByText } = render(<SignIn />);
    const button = getByText("signIn");
    fireEvent.press(button);
    expect(getByText("emailRequired")).toBeTruthy();
  });

  it("shows error when email format is invalid", async () => {
    isValidEmail.mockReturnValue(false);
    const { getByText, getByPlaceholderText } = render(<SignIn />);
    const input = getByPlaceholderText("emailPlaceholder");
    const button = getByText("signIn");

    fireEvent.changeText(input, "invalidemail");
    fireEvent.press(button);

    expect(getByText("Invalid email format")).toBeTruthy();
  });

  it("shows error when email is not found in mockData", async () => {
    isValidEmail.mockReturnValue(true);
    const { getByText, getByPlaceholderText } = render(<SignIn />);
    const input = getByPlaceholderText("emailPlaceholder");
    const button = getByText("signIn");

    fireEvent.changeText(input, "unknown@example.com");
    fireEvent.press(button);

    await waitFor(() => {
      expect(getByText("emailNotFound")).toBeTruthy();
    });
  });

 it("calls signIn with valid email", async () => {
  (isValidEmail as jest.Mock).mockReturnValue(true);

  const { getByTestId, getByPlaceholderText } = render(<SignIn />);
  const input = getByPlaceholderText("emailPlaceholder");
  const button = getByTestId("signInButton");

  fireEvent.changeText(input, "test@example.com");
  fireEvent.press(button);

  await flushPromises();

  expect(mockSignIn).toHaveBeenCalledWith("test@example.com");
});

  it("shows loading indicator when loading=true", () => {
    useAuth.mockReturnValue({
      signIn: mockSignIn,
      loading: true,
    });
    const { getByTestId } = render(<SignIn />);
    expect(getByTestId("ActivityIndicator")).toBeTruthy();
  });
  
  it("matches the rendered snapshot", () => {
    const tree = render(<SignIn />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});


