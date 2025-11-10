// Example: The Button component file

import React from 'react';
import { View } from 'react-native';

// Define the component's props interface
interface ButtonProps {
  primary?: boolean;
  size?: 'small' | 'medium' | 'large';
  backgroundColor?: string;
  label: string;
  onPress: () => void;
  // Include any style prop if used
  style?: any; 
}

// 🛑 FIX: Explicitly define the component as a React Functional Component
const Button = ({ primary, size, backgroundColor, label, style, onPress }: ButtonProps) => {
   return (
    <View>
      <Text>{label}</Text>
    </View>
  );
};

export default Button; // Or export { Button };