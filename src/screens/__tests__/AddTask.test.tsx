import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../hooks/useAuth";
import { useTranslation } from "react-i18next";
import AddTask from "../AddTask";
import uuid from "react-native-uuid";

// ✅ Mock dependencies
jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
}));

jest.mock("../../hooks/useAuth", () => ({
  useAuth: jest.fn(),
}));

jest.mock("react-native-uuid", () => ({
  v4: jest.fn(() => "mocked-uuid"),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key, // simple translation mock
  }),
}));

describe("AddTask Screen", () => {
  const mockNavigate = jest.fn();
  const mockReset = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigation as jest.Mock).mockReturnValue({ navigate: mockNavigate });
    (useAuth as jest.Mock).mockReturnValue({ role: "ROLE_ADMIN" });
  });

  it("saves new task to AsyncStorage when fields are filled", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    const { getByPlaceholderText, getByText } = render(<AddTask />);

    const titleInput = getByPlaceholderText("title");
    const descInput = getByPlaceholderText("description");

    fireEvent.changeText(titleInput, "New Task");
    fireEvent.changeText(descInput, "Do something");
    fireEvent.press(getByText("Save Task"));

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "@tasks",
        JSON.stringify([
          {
            userId: "mocked-uuid",
            title: "New Task",
            description: "Do something",
            status: "Incomplete",
            email: "newuser@gmail.com",
            role: "admin",
          },
        ])
      );
    });

    expect(mockNavigate).toHaveBeenCalledWith("Tasks");
  });

  it("handles existing stored tasks", async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify([
        { userId: "1", title: "Old Task", description: "desc", status: "Incomplete" },
      ])
    );

    const { getByPlaceholderText, getByText } = render(<AddTask />);

    const titleInput = getByPlaceholderText("title");
    const descInput = getByPlaceholderText("description");

    fireEvent.changeText(titleInput, "New Task");
    fireEvent.changeText(descInput, "More work");
    fireEvent.press(getByText("Save Task"));

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "@tasks",
        JSON.stringify([
          {
            userId: "1",
            title: "Old Task",
            description: "desc",
            status: "Incomplete",
          },
          {
            userId: "mocked-uuid",
            title: "New Task",
            description: "More work",
            status: "Incomplete",
            email: "newuser@gmail.com",
            role: "admin",
          },
        ])
      );
    });

    expect(mockNavigate).toHaveBeenCalledWith("Tasks");
  });
});
