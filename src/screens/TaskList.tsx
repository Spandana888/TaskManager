import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import mockData from "../mock/data.json";
import AddTask from "./AddTask";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { TaskStackParamList } from "../navigation/TaskStack";
import { Button } from "@rneui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";

type TaskListNavProp = DrawerNavigationProp<TaskStackParamList, "Tasks">;

type Task = {
  userId: number;
  email: string;
  role: string;
  title: string;
  description: string;
  initialStatus?: string;
  completed?: boolean;
};

const ITEMS_PER_PAGE = 5;

export default function TaskList() {
  const { t } = useTranslation();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const navigation = useNavigation<TaskListNavProp>();

  const fetchTasks = useCallback(async () => {
    try {
      const staticTasks: Task[] = mockData.users.map((task: any) => ({
        userId: task.userId,
        email: task.email,
        role: task.role,
        title: task.title || task.Title,
        description: task.description,
        initialStatus:
          task.status || (task.completed ? "Completed" : "Incomplete"),
      }));
      const stored = await AsyncStorage.getItem("@tasks");
      const storedTasks = stored ? JSON.parse(stored) : [];
      const allTasks = [...staticTasks, ...storedTasks];
      setTasks(allTasks);
    } catch (err) {
      console.error("Error loading tasks:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Use useFocusEffect (not nested!)
  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, [fetchTasks])
  );

  // ✅ Optional: initial load too (only once)
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

  const totalPages = Math.ceil(tasks.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const visibleTasks = tasks.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const nextPage = () => setPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setPage((prev) => Math.max(prev - 1, 1));

  return (
    <View style={styles.container}>
      <AddTask />
      <View style={styles.taskListContainer}>
        <FlatList
          data={visibleTasks}
          keyExtractor={(item) => String(item.userId)}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.taskCard}
              onPress={() =>
                navigation.navigate("TaskDetails", {
                  userId: item.userId,
                  email: item.email,
                  role: item.role,
                  title: item.title,
                  description: item.description,
                  initialStatus: item.initialStatus,
                })
              }
            >
              <Text style={styles.title}>{item.title}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <View style={styles.paginationContainer}>
        <Button
          title={t("previous")}
          onPress={prevPage}
          disabled={page === 1}
          color={"success"}
        />
        <Text style={styles.pageText}>
          Page {page} of {totalPages}
        </Text>
        <Button
          title={t("next")}
          onPress={nextPage}
          disabled={page === totalPages}
          color={"success"}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 30 },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  taskCard: {
    backgroundColor: "#fff",
    padding: 20,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  title: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  email: { color: "#555", marginTop: 2 },
  initialStatus: { fontWeight: "bold", marginTop: 6 },
  noText: {
    textAlign: "center",
    marginTop: 20,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    paddingHorizontal: 20,
  },
  pageText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  taskListContainer: {
    marginBottom: 50,
    marginTop: 50,
  },
});
