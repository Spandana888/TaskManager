import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TaskList from '../screens/TaskList';
import TaskDetail from '../screens/TaskDetail';
import { createDrawerNavigator } from '@react-navigation/drawer';

export type TaskStackParamList = {
  TaskList: undefined;
  TaskDetails: {
    userId: number;
    email: string;
    role: string;
    title: string;
    description: string;
    initialStatus?: string;
  };
};

const Drawer = createDrawerNavigator();



export default function TaskStack() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="TaskList" component={TaskList} options={{
          headerShown: false,
        }}/>
      <Drawer.Screen name="TaskDetails" component={TaskDetail} options={{  headerShown: false }} />
    </Drawer.Navigator>
  );
}
