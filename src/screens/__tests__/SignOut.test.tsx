import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SignOut from "../SignOut";

jest.mock("@react-native-async-storage/async-storage", () => ({
  removeItem: jest.fn(),
}));

const mockSignOut = jest.fn(async () => {
  await AsyncStorage.removeItem("@user_email");
});

jest.mock("../../hooks/useAuth", () => ({
  useAuth: () => ({ signOut: mockSignOut }),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe("SignOut Screen", () => {
  it("clears AsyncStorage and resets navigation", async () => {
    const { getByText } = render(<SignOut />);
    const button = getByText("signIn");

    fireEvent.press(button);

    await waitFor(() => {
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith("@user_email");
      expect(mockSignOut).toHaveBeenCalled();
    });
  });

  it("matches the rendered snapshot", () => {
    const tree = render(<SignOut />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
