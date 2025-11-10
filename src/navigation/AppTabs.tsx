import React from "react";
import { useAuth } from "../hooks/useAuth";
import { useTranslation } from "react-i18next";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";

import SignIn from "../screens/SignIn";
import TaskStack from "./TaskStack";
import ErrorList from "../screens/ErrorList";
import SignOut from "../screens/SignOut";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

export default function AppTabs() {
  const { role } = useAuth();
  const { t } = useTranslation();

  // 👇 If no user is logged in
  if (!role) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SignIn" component={SignIn} />
      </Stack.Navigator>
    );
  }

  // 👇 For Admin users
  if (role === "ROLE_ADMIN") {
    return (
      <Drawer.Navigator screenOptions={{ headerShown: true }}>
        <Drawer.Screen name={t("tasks")} component={TaskStack} />
        <Drawer.Screen name={t("errors")} component={ErrorList} />
        <Drawer.Screen name={t("signOut")} component={SignOut} />
      </Drawer.Navigator>
    );
  }

  // 👇 For Member users
  return (
    <Drawer.Navigator screenOptions={{ headerShown: true }}>
      <Drawer.Screen name={t("taskList")} component={TaskStack} />
      <Drawer.Screen name={t("signOut")} component={SignOut} />
    </Drawer.Navigator>
  );
}
