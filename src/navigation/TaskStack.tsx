import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TaskList from '../screens/TaskList';
import TaskDetail from '../screens/TaskDetail';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useTranslation } from 'react-i18next';


export type TaskStackParamList = {
  Tasks: undefined;
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
  const { t } = useTranslation()
  return (
    <Drawer.Navigator>
      <Drawer.Screen name={t("taskList")} component={TaskList} options={{
          headerShown: false,
        }}/>
      <Drawer.Screen name={t("taskDetails")} component={TaskDetail} options={{  headerShown: false }} />
    </Drawer.Navigator>
  );
}
