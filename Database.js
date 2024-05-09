import * as SQLite from 'expo-sqlite';
import NetInfo from "@react-native-community/netinfo";
import dbfirebase from './firebaseConfig';

const db = SQLite.openDatabase("bd.db");

const initDB = () => {
  db.transaction(tx => {
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY NOT NULL, title TEXT NOT NULL, complete BOOLEAN NOT NULL);",
      [],
      () => console.log("Tabela criada com sucesso"),
      error => console.log("Erro: " + error.message)
    );
  });
};

const insertTask = (title, complete, callback) => {
  db.transaction(tx => {
    tx.executeSql(
      "INSERT INTO tasks (title, complete) VALUES (?, ?);",
      [title, complete],
      (_, result) => callback(true, result),
      (_, error) => callback(false, error)
    );
  });
};

const fetchTasks = callback => {
  db.transaction(tx => {
    tx.executeSql(
      "SELECT * FROM tasks;",
      [],
      (_, { rows }) => callback(true, rows._array),
      (_, error) => callback(false, error)
    );
  });
};

const deleteTask = (id, callback) => {
  db.transaction(tx => {
    tx.executeSql(
      "DELETE FROM tasks WHERE id = ?;",
      [id],
      (_, result) => callback(true, result),
      (_, error) => callback(false, error)
    );
  });
};

const updateTask = (id, title, complete, callback) => {
  db.transaction(tx => {
    tx.executeSql(
      "UPDATE tasks SET title = ?, complete = ? WHERE id = ?;",
      [title, complete, id],
      (_, result) => callback(true, result),
      (_, error) => callback(false, error)
    );
  });
};

const syncTasksWithFirebase = async () => {
  const connection = await NetInfo.fetch();
  if (connection.isConnected) {
    fetchTasks((success, tasks) => {
      if (success) {
        tasks.forEach(task => {
          // Verifica se a tarefa já existe no Firebase antes de adicionar ou atualizar
          const docRef = dbfirebase.collection('tasks').doc(`${task.id}`);
          docRef.get().then(doc => {
            if (doc.exists) {
              // Atualiza a tarefa no Firebase se já existir
              docRef.update({
                title: task.title,
                complete: task.complete
              }).then(() => console.log('Task atualzada no Firebase'))
                .catch(error => console.log('Falha ao atualizar task no Firebase', error));
            } else {
              // Adiciona uma nova tarefa ao Firebase se não existir
              docRef.set({
                title: task.title,
                complete: task.complete
              }).then(() => console.log('Task adicionada no Firebase'))
                .catch(error => console.log('Falha ao adicionar task no Firebase', error));
            }
          });
        });
      } else {
        console.log('Falha na sincronnização');
      }
    });
  }
};

export { initDB, insertTask, fetchTasks, deleteTask, updateTask, syncTasksWithFirebase };

