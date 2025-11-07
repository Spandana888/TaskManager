import SignIn from "../screens/SignIn";
import TaskStack from "./TaskStack";
import ErrorList from "../screens/ErrorList";
import { useAuth } from "../hooks/useAuth";
import { createDrawerNavigator } from "@react-navigation/drawer";
import SignOut from "../screens/SignOut";
import React from "react";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useTranslation } from "react-i18next";

const Drawer = createDrawerNavigator();

export default function AppTabs() {
  const { role } = useAuth();
  const { t } = useTranslation();
  if (!role) {
    return (
      <Drawer.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Drawer.Screen
          name={t("SignIn")}
          component={SignIn}
        />
      </Drawer.Navigator>
    );
  }

  //ROLE_ADMIN

  if (role === "ROLE_ADMIN") {
    return (
      <Drawer.Navigator
        screenOptions={{
          drawerType: "front",
        }}
      >
        <Drawer.Screen name={t("tasks")} component={TaskStack}  />
        <Drawer.Screen name={t("errors")} component={ErrorList} options={{}}/>
        <Drawer.Screen name={t("signOut")} component={SignOut} options={{
          headerShown: false,
        }}/>
      </Drawer.Navigator>
    );
  }

  //ROLE_MEMBER
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerType: "front",
      }}
    >
      <Drawer.Screen name={t("tasks")} component={TaskStack}/>
      <Drawer.Screen name={t("signOut")} component={SignOut} options={{
          headerShown: false,
        }}/>
    </Drawer.Navigator>
  );
}
