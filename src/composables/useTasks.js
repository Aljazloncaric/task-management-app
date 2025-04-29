import { collection, addDoc, serverTimestamp, query, where, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { formatDate } from './methods.js';

// CREATE TASK
export async function createTask(taskData, projectId) {
  const dateObj = new Date();
  const task = {
    ...taskData,
    projectId,                      
    date: formatDate(dateObj),
    time: dateObj.toLocaleTimeString(),
    createdAt: serverTimestamp(),
  };
  return await addDoc(collection(db, 'tasks'), task);
}

// FETCH ALL TASKS TGAT BELONG TO THE PROJECT WE'RE CURRENTLY VIEWING
export async function fetchTasksByProject(projectId) {
  try {
    const q = query(collection(db, 'tasks'), where('projectId', '==', projectId));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (err) {
    console.error("Error fetching tasks:", err);
    return [];
  }
}

// UPDATE TASK STATUS UPON DRAG-AND-DROP
export async function updateTaskStatus(taskId, newStatus) {
  const taskRef = doc(db, 'tasks', taskId)
  console.log("updating task")
  await updateDoc(taskRef, { status: newStatus })
}

// DELETE ALL TASKS IN "DONE" COLUMN
export async function deleteDoneTasks(projectId) {
  const tasksRef = collection(db, 'tasks');
  const q = query(tasksRef, where('projectId', '==', projectId), where('status', '==', 'done'));

  try {
    const snapshot = await getDocs(q);

    const deletePromises = snapshot.docs.map(docSnap => {
      return deleteDoc(doc(db, 'tasks', docSnap.id));
    });

    await Promise.all(deletePromises);
    console.log('Done tasks deleted!');
  } catch (err) {
    console.error('Error deleting done tasks:', err);
  }
}

export async function deleteTasksByProject(projectId) {
  try {
    const q = query(collection(db, 'tasks'), where('projectId', '==', projectId));
    const snapshot = await getDocs(q);

    const deletePromises = snapshot.docs.map(docSnap => deleteDoc(doc(db, 'tasks', docSnap.id)));
    await Promise.all(deletePromises);

    console.log(`All tasks for project ${projectId} deleted.`);
  } catch (error) {
    console.error('Error deleting tasks by project:', error);
    throw error;
  }
}
