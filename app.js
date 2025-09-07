// app.js

// --- 状態管理 ---
let allTasks = [];
let filterAndSortState = {
    keyword: '',
    status: 'all',
    tag: '',
    sortBy: 'created_at_desc'
};

// --- 初期化 ---
document.addEventListener('DOMContentLoaded', initializeApp);

function initializeApp() {
    setupEventListeners();
    allTasks = fetchAllTasks();
    refreshView();
}

// --- イベントリスナー設定 ---
function setupEventListeners() {
    dom.addTaskForm.addEventListener('submit', handleAddTask);
    dom.taskListBody.addEventListener('click', handleTaskAction);
    dom.exportCsvBtn.addEventListener('click', handleExportCsv);

    // Filters and Sort
    dom.filterKeyword.addEventListener('input', (e) => {
        filterAndSortState.keyword = e.target.value;
        refreshView();
    });
    dom.filterStatus.addEventListener('change', (e) => {
        filterAndSortState.status = e.target.value;
        refreshView();
    });
    dom.filterTag.addEventListener('input', (e) => {
        filterAndSortState.tag = e.target.value;
        refreshView();
    });
    dom.sortBy.addEventListener('change', (e) => {
        filterAndSortState.sortBy = e.target.value;
        refreshView();
    });
    dom.clearFiltersBtn.addEventListener('click', () => {
        clearFilters();
        filterAndSortState.keyword = '';
        filterAndSortState.status = 'all';
        filterAndSortState.tag = '';
        refreshView();
    });
}

// --- イベントハンドラ ---
function handleAddTask(event) {
    event.preventDefault();
    const { title, due, tags, status } = getFormValues();
    if (!title) {
        alert('タスクのタイトルは必須です。');
        return;
    }

    const now = getCurrentISOTime();
    const newTask = {
        id: generateUUID(),
        title,
        due: due || null,
        tags,
        status,
        created_at: now,
        updated_at: now
    };

    allTasks.push(newTask);
    saveAllTasks(allTasks);
    refreshView();
    clearForm();
}

function handleTaskAction(event) {
    const target = event.target;
    const taskRow = target.closest('.task-item');
    if (!taskRow) return;
    const taskId = taskRow.dataset.id;

    if (target.matches('.delete-btn')) {
        if (confirm('本当にこのタスクを削除しますか？')) {
            allTasks = allTasks.filter(t => t.id !== taskId);
            saveAllTasks(allTasks);
            refreshView();
        }
    } else if (target.matches('.status-toggle')) {
        const task = allTasks.find(t => t.id === taskId);
        if (task) {
            task.status = target.checked ? 'done' : 'todo';
            task.updated_at = getCurrentISOTime();
            saveAllTasks(allTasks);
            refreshView();
        }
    } else if (target.matches('.edit-btn')) {
        // Should-have: モーダルまたはインライン編集UIを実装
        alert(`タスクID: ${taskId} の編集機能は未実装です。`);
    }
}

function handleExportCsv() {
    const csvContent = generateCSV(allTasks);
    triggerCsvDownload(csvContent, `todo-tasks-${new Date().toISOString().split('T')[0]}.csv`);
}

// --- 表示更新 ---
function refreshView() {
    const filteredTasks = applyFilter(allTasks, filterAndSortState);
    const sortedTasks = applySort(filteredTasks, filterAndSortState.sortBy);
    renderTasks(sortedTasks);
    renderCounters(allTasks);
}

function applyFilter(tasks, state) {
    return tasks.filter(task => {
        const keywordMatch = state.keyword ? 
            task.title.includes(state.keyword) || task.tags.some(t => t.includes(state.keyword)) : true;
        const statusMatch = state.status !== 'all' ? task.status === state.status : true;
        const tagMatch = state.tag ? task.tags.includes(state.tag) : true;
        return keywordMatch && statusMatch && tagMatch;
    });
}

function applySort(tasks, sortBy) {
    const sortedTasks = [...tasks];
    switch (sortBy) {
        case 'created_at_desc':
            sortedTasks.sort((a, b) => b.created_at.localeCompare(a.created_at));
            break;
        case 'created_at_asc':
            sortedTasks.sort((a, b) => a.created_at.localeCompare(b.created_at));
            break;
        case 'due_asc':
            sortedTasks.sort((a, b) => {
                if (!a.due) return 1;
                if (!b.due) return -1;
                return a.due.localeCompare(b.due);
            });
            break;
        case 'title_asc':
            sortedTasks.sort((a, b) => a.title.localeCompare(b.title));
            break;
    }
    return sortedTasks;
}
