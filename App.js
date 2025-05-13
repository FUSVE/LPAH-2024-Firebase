import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { db } from './firebaseConfig';
import { ref, push, onValue, remove, update } from 'firebase/database';

export default function App() {
  const [task, setTask] = useState('');
  const [savedTasks, setSavedTasks] = useState([]);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const tasksRef = ref(db, 'tasks');

    const unsubscribe = onValue(tasksRef, snapshot => {
      const data = snapshot.val();
      if (data) {
        const parsedTasks = Object.keys(data).map(key => ({
          id: key,
          description: data[key].description
        }));
        setSavedTasks(parsedTasks.reverse());
      } else {
        setSavedTasks([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleAddOrEditTask = async () => {
    if (task.trim() === '') return;

    try {
      const tasksRef = ref(db, 'tasks');
      if (editId) {
        const editRef = ref(db, `tasks/${editId}`);
        await update(editRef, { description: task });
        setEditId(null);
      } else {
        await push(tasksRef, {
          description: task,
          createdAt: new Date().toISOString()
        });
      }
      setTask('');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a tarefa.');
      console.error(error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      const taskRef = ref(db, `tasks/${id}`);
      await remove(taskRef);
      if (editId === id) {
        setTask('');
        setEditId(null);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível remover a tarefa.');
      console.error(error);
    }
  };

  const handleEditPress = (item) => {
    setTask(item.description);
    setEditId(item.id);
  };

  const renderItem = ({ item }) => (
    <View style={styles.taskContainer}>
      <TouchableOpacity onPress={() => handleEditPress(item)}>
        <Text style={styles.taskText}>{item.description}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleDeleteTask(item.id)} style={styles.deleteButton}>
        <Text style={styles.deleteText}>Remover</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tarefas</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite sua tarefa"
        value={task}
        onChangeText={setTask}
      />
      <Button title={editId ? "Salvar edição" : "Adicionar"} onPress={handleAddOrEditTask} />
      <FlatList
        data={savedTasks}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    paddingHorizontal: 20,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold'
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5
  },
  taskContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    borderBottomWidth: 0.5,
    borderColor: '#ccc'
  },
  taskText: {
    fontSize: 16,
    maxWidth: '100%'
  },
  deleteButton: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold'
  }
});
