import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import {
  Button,
  Card,
  DefaultTheme,
  IconButton,
  Provider as PaperProvider,
  SegmentedButtons,
  Text,
  TextInput,
} from "react-native-paper";
import { loadTasks, saveTasks } from "../database/db";

// Tema global para deixar texto escuro e fundo claro
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    text: "#111827",        // texto escuro
    placeholder: "#6B7280", // placeholder cinza
    primary: "#2563EB",     // azul moderno
    background: "#FFFFFF",  // fundo branco
  },
};

export default function HomeScreen() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    (async () => {
      const storedTasks = await loadTasks();
      setTasks(storedTasks);
    })();
  }, []);

  const addTask = () => {
    if (text.trim()) {
      const newTask = {
        id: Date.now(),
        title: text,
        completed: false,
        createdAt: date,
      };
      const updatedTasks = [...tasks, newTask].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
      setTasks(updatedTasks);
      saveTasks(updatedTasks);
      setText("");
    }
  };

  const toggleTask = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const deleteTask = (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    return true;
  });

  return (
    <PaperProvider theme={theme}>
      <View style={styles.container}>
        <Text style={styles.title}>✨ Minha Lista de Tarefas</Text>

        <TextInput
          mode="outlined"
          label="Nova tarefa"
          value={text}
          onChangeText={setText}
          style={styles.input}
        />

        <Button
          mode="contained"
          onPress={() => setShowPicker("date")}
          style={styles.button}
          labelStyle={styles.buttonText}
        >
          Escolher Data
        </Button>
        <Button
          mode="contained"
          onPress={() => setShowPicker("time")}
          style={styles.button}
          labelStyle={styles.buttonText}
        >
          Escolher Hora
        </Button>

        <Text style={styles.dateText}>
          {date.toLocaleDateString("pt-BR")} {date.toLocaleTimeString("pt-BR")}
        </Text>

        {showPicker && (
          <DateTimePicker
            value={date}
            mode={showPicker}
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event, selected) => {
              setShowPicker(null);
              if (selected) {
                const newDate = new Date(date);
                if (showPicker === "date") {
                  newDate.setFullYear(selected.getFullYear());
                  newDate.setMonth(selected.getMonth());
                  newDate.setDate(selected.getDate());
                } else {
                  newDate.setHours(selected.getHours());
                  newDate.setMinutes(selected.getMinutes());
                }
                setDate(newDate);
              }
            }}
          />
        )}

        <Button
          mode="contained"
          onPress={addTask}
          style={styles.button}
          labelStyle={styles.buttonText}
        >
          Adicionar
        </Button>

        <SegmentedButtons
          value={filter}
          onValueChange={setFilter}
          style={{ marginBottom: 15 }}
          buttons={[
            { value: "all", label: "Todas" },
            { value: "completed", label: "Concluídas" },
            { value: "pending", label: "Pendentes" },
          ]}
        />

        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Card
              style={[
                styles.card,
                item.completed ? styles.cardCompleted : styles.cardPending,
              ]}
            >
              <Card.Title
                title={item.title}
                subtitle={`Agendada: ${new Date(item.createdAt).toLocaleDateString(
                  "pt-BR"
                )} ${new Date(item.createdAt).toLocaleTimeString("pt-BR")}`}
                titleStyle={[
                  styles.taskText,
                  item.completed && styles.completed,
                ]}
                right={() => (
                  <View style={{ flexDirection: "row" }}>
                    <IconButton
                      icon={item.completed ? "check-circle" : "circle-outline"}
                      onPress={() => toggleTask(item.id)}
                    />
                    <IconButton
                      icon="delete"
                      iconColor="red"
                      onPress={() => deleteTask(item.id)}
                    />
                  </View>
                )}
              />
            </Card>
          )}
        />
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 40, backgroundColor: "#F9FAFB" },
  title: {
    fontSize: 26,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
    color: "#111827",
  },
  input: {
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  button: {
    marginBottom: 10,
    borderRadius: 25,
    backgroundColor: "#2563EB",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  dateText: {
    textAlign: "center",
    marginVertical: 10,
    color: "#374151",
  },
  card: {
    marginVertical: 5,
    borderRadius: 25,
    paddingHorizontal: 10,
  },
  cardPending: { backgroundColor: "#ffffff" },
  cardCompleted: { backgroundColor: "#D1FAE5" },
  taskText: { fontSize: 18, color: "#111827" },
  completed: { textDecorationLine: "line-through", color: "#6B7280" },
});
