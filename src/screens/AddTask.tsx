import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { useForm, Controller } from "react-hook-form";
import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";
import { Button } from '@rneui/themed';
import { useAuth } from "../hooks/useAuth";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

const STORAGE_TASK_KEY = "@tasks";

type FormValues = {
  title: string;
  description: string;
};

export default function AddTask() {
  const { t } = useTranslation()
  const navigation = useNavigation();
  const { role, email } = useAuth();
  const {
    control,        
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { title: "", description: "" },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_TASK_KEY)
      const existingTasks = stored ? JSON.parse(stored) : [];
    
    const newTask = { 
      userId: String(uuid.v4()), 
      title: data.title,
      description: data.description,
      status: (t("Incomplete")),
      email: email || "unknown",
      role: role === "ROLE_ADMIN" ? (t("admin")) : (t("member"))
    }
     const updated = [...existingTasks, newTask];
    await AsyncStorage.setItem(STORAGE_TASK_KEY, JSON.stringify(updated));
    reset();
    navigation.navigate("Tasks" as never);
    } catch(err) {
      console.error((t("errorSavingTask:")), err);
    }
  };

  return (
    <View>
      <Text style={styles.header}>Add Task</Text>
      <Controller
        control={control}
        name="title"
        rules={{ required: (t("titleRequired")) }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder={t("title")}
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.title && <Text style={styles.error}>{errors.title.message}</Text>}

      <Controller
        control={control}
        name="description"
        rules={{ required: (t("descriptionRequired")) }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={[styles.input, { height: 80 }]}
            placeholder={t("description")}
            multiline
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.description && (
        <Text style={styles.error}>{errors.description.message}</Text>
      )}

      <Button title="Save Task" onPress={handleSubmit(onSubmit)} color={"success"}/>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  error: { color: "red", marginBottom: 8 },
});
