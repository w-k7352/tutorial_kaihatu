// storage.js

const STORAGE_KEY = 'todo_tasks_v1';

/**
 * localStorageから全てのタスクを取得する
 * @returns {Array<Object>} Taskオブジェクトの配列
 */
function fetchAllTasks() {
    const tasksJson = localStorage.getItem(STORAGE_KEY);
    try {
        return tasksJson ? JSON.parse(tasksJson) : [];
    } catch (e) {
        console.error('Failed to parse tasks from localStorage:', e);
        return [];
    }
}

/**
 * 全てのタスクをlocalStorageに保存する
 * @param {Array<Object>} tasks - 保存するTaskオブジェクトの配列
 */
function saveAllTasks(tasks) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
        console.error('Failed to save tasks to localStorage:', e);
    }
}
