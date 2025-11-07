import React, { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { TaskStackParamList } from "../navigation/TaskStack";
import AsyncStorage from "@react-native-async-storage/async-storage";
type TaskDetailsRouteProp = RouteProp<TaskStackParamList, "TaskDetails">;
import { Button } from '@rneui/themed';
import { useTranslation } from "react-i18next";

export default function TaskDetail() {
  const { t } = useTranslation()
  const route = useRoute<TaskDetailsRouteProp>();
  const { userId, title, description, email, initialStatus, role } = route.params;
  const [status, setStatus] = useState(initialStatus)
  const navigation = useNavigation();
  

  const handleMarkComplete = async () =>{
    try{
       setStatus(t("completed"))
       const storedTasks = await AsyncStorage.getItem('@tasks');
       let tasks = storedTasks ? JSON.parse(storedTasks) : [];

        // Find this task by userId 
      const index = tasks.findIndex(
        (t: any) => t.userId === userId || t.title === title
      );

      if (index !== -1) {
        tasks[index].status = (t("completed"));
      } else {
        // adding tasks
        tasks.push({
          userId,
          email,
          role,
          title,
          description,
          status: (t("completed")),
        });
      }

      await AsyncStorage.setItem('@tasks', JSON.stringify(tasks));
    } catch (err) {

    }
  }

  const handleDelete = async () => {
    try {
      const stored = await AsyncStorage.getItem('@tasks');
      let tasks = stored ? JSON.parse(stored) : [];
      const updatedTasks = tasks.filter(
        (t: any) => !(t.userId === userId && t.title === title)
      );
      navigation.goBack()
      await AsyncStorage.setItem('@tasks', JSON.stringify(updatedTasks));
    } catch (err) {
      console.error((t('errorDeletingTasks:')), err);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.header}>(t("taskDetails"))</Text>
        <Text style={styles.label}>{t("title:")}</Text>
        <Text style={styles.value}>{t("title:")}</Text>

        <Text style={styles.label}>{t("description")}</Text>
        <Text style={styles.value}>{t("description")}</Text>

        <Text style={styles.label}>{t("email")}</Text>
        <Text style={styles.value}>{t("email")}</Text>

        <Text style={styles.label}>{t("role:")}</Text>
        <Text style={styles.value}>{role === "ROLE_ADMIN" ? (t("admin")) : (t("member"))}</Text>

        <Text style={styles.label}>Status:</Text>
        <Text
          style={[
            styles.value,
            { color: status?.toLowerCase() === "completed" ? "green" : "red" },
          ]}
        >
          {status}
        </Text>
        <View style={styles.bottonContainer}>
          {status === "Incomplete" && (
            <Button
              title={t("markAsCompleted")}
              onPress={handleMarkComplete}
              color={"success"}
              buttonStyle={{
                marginRight: 40
              }}
            />
          )}
          <Button title="Delete" color={"error"} onPress={handleDelete}></Button>
        </View>
      </View>
      <Button title="Go Back" color={"success"} onPress={() => navigation.goBack()} />
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 30 },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  label: { fontSize: 16, fontWeight: "600", marginTop: 10 },
  value: { fontSize: 16, color: "#333", marginTop: 4 },
  button: { padding: 30 },
  bottonContainer: {
    flexDirection: "row",
    marginTop: 30,
  }
});
