import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, CommonActions } from '@react-navigation/native';
import SignOut from '../SignOut';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
  CommonActions: { reset: jest.fn() },
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  removeItem: jest.fn(),
}));

const mockDispatch = jest.fn();
(useNavigation as jest.Mock).mockReturnValue({ dispatch: mockDispatch });

describe('SignOut Screen', () => {
  it('clears AsyncStorage and resets navigation', async () => {
    render(<SignOut />);

    await waitFor(() => {
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('@user_email');
      expect(mockDispatch).toHaveBeenCalled();
    });
  });
});