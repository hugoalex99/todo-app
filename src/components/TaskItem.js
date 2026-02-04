import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function TaskItem({ task, toggleTask, deleteTask }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => toggleTask(task.id)}>
        <Text style={[styles.text, task.completed && styles.completed]}>
          {task.title}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => deleteTask(task.id)}>
        <Text style={styles.delete}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', justifyContent: 'space-between', margin: 8 },
  text: { fontSize: 18 },
  completed: { textDecorationLine: 'line-through', color: 'gray' },
  delete: { fontSize: 20, color: 'red' }
});
