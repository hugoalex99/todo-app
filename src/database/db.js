import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveTasks = async (tasks) => {
  try {
    await AsyncStorage.setItem('TASKS', JSON.stringify(tasks));
  } catch (e) {
    console.error("Erro ao salvar tarefas", e);
  }
};

export const loadTasks = async () => {
  try {
    const tasks = await AsyncStorage.getItem('TASKS');
    return tasks ? JSON.parse(tasks) : [];
  } catch (e) {
    console.error("Erro ao carregar tarefas", e);
    return [];
  }
};
