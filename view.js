// view.js

const dom = {
    // Counters
    counterTodo: document.getElementById('counter-todo'),
    counterDoing: document.getElementById('counter-doing'),
    counterDone: document.getElementById('counter-done'),
    // Form
    addTaskForm: document.getElementById('add-task-form'),
    formTitle: document.getElementById('form-title'),
    formDue: document.getElementById('form-due'),
    formTags: document.getElementById('form-tags'),
    formStatus: document.getElementById('form-status'),
    // Filters & Sort
    filterKeyword: document.getElementById('filter-keyword'),
    filterStatus: document.getElementById('filter-status'),
    filterTag: document.getElementById('filter-tag'),
    sortBy: document.getElementById('sort-by'),
    clearFiltersBtn: document.getElementById('clear-filters-btn'),
    // Task List
    taskListBody: document.getElementById('task-list-body'),
    // Footer
    exportCsvBtn: document.getElementById('export-csv-btn'),
};

/**
 * タスク一覧を描画する
 * @param {Array<Object>} tasks - 描画するタスクの配列
 */
function renderTasks(tasks) {
    dom.taskListBody.innerHTML = '';
    if (tasks.length === 0) {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.colSpan = 6;
        td.textContent = '表示するタスクがありません。';
        td.style.textAlign = 'center';
        tr.appendChild(td);
        dom.taskListBody.appendChild(tr);
        return;
    }

    tasks.forEach(task => {
        const tr = createTaskRowElement(task);
        dom.taskListBody.appendChild(tr);
    });
}

/**
 * 1つのタスク行(tr)を生成する
 * @param {Object} task
 * @returns {HTMLElement} tr要素
 */
function createTaskRowElement(task) {
    const tr = document.createElement('tr');
    tr.className = 'task-item';
    tr.dataset.id = task.id;
    if (task.status === 'done') {
        tr.classList.add('task-item--completed');
    }

    // Status Toggle
    const tdToggle = document.createElement('td');
    tdToggle.dataset.label = '完了';
    const toggleCheckbox = document.createElement('input');
    toggleCheckbox.type = 'checkbox';
    toggleCheckbox.className = 'status-toggle';
    toggleCheckbox.checked = task.status === 'done';
    tdToggle.appendChild(toggleCheckbox);

    // Title
    const tdTitle = document.createElement('td');
    tdTitle.dataset.label = 'タイトル';
    tdTitle.className = 'task-item__title';
    tdTitle.textContent = task.title;

    // Due Date
    const tdDue = document.createElement('td');
    tdDue.dataset.label = '期限';
    const dueBadge = getDueBadge(task.due);
    if (task.due) {
        tdDue.textContent = task.due + ' ';
        tdDue.appendChild(dueBadge);
    } else {
        tdDue.textContent = 'なし';
    }

    // Tags
    const tdTags = document.createElement('td');
    tdTags.dataset.label = 'タグ';
    tdTags.textContent = task.tags.join(', ');

    // Status
    const tdStatus = document.createElement('td');
    tdStatus.dataset.label = 'ステータス';
    const statusBadge = document.createElement('span');
    statusBadge.className = `status-badge status-badge--${task.status}`;
    statusBadge.textContent = { todo: '未着手', doing: '進行中', done: '完了' }[task.status];
    tdStatus.appendChild(statusBadge);

    // Actions
    const tdActions = document.createElement('td');
    tdActions.dataset.label = '操作';
    const editBtn = document.createElement('button');
    editBtn.className = 'action-button edit-btn';
    editBtn.innerHTML = '✏️';
    editBtn.ariaLabel = '編集';
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'action-button delete-btn';
    deleteBtn.innerHTML = '🗑️';
    deleteBtn.ariaLabel = '削除';
    tdActions.appendChild(editBtn);
    tdActions.appendChild(deleteBtn);

    tr.append(tdToggle, tdTitle, tdDue, tdTags, tdStatus, tdActions);
    return tr;
}

function getDueBadge(dueDate) {
    const badge = document.createElement('span');
    if (!dueDate) return badge;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);

    badge.className = 'due-badge';
    if (due < today) {
        badge.classList.add('due-badge--overdue');
        badge.textContent = '期限切れ';
    } else if (due.getTime() === today.getTime()) {
        badge.classList.add('due-badge--today');
        badge.textContent = '本日';
    } else {
        badge.classList.add('due-badge--future');
    }
    return badge;
}

/**
 * タスクカウンターを更新する
 * @param {Array<Object>} tasks - 全てのタスク
 */
function renderCounters(tasks) {
    const counts = tasks.reduce((acc, task) => {
        acc[task.status] = (acc[task.status] || 0) + 1;
        return acc;
    }, { todo: 0, doing: 0, done: 0 });

    dom.counterTodo.textContent = counts.todo;
    dom.counterDoing.textContent = counts.doing;
    dom.counterDone.textContent = counts.done;
}

/**
 * 新規登録フォームをクリアする
 */
function clearForm() {
    dom.addTaskForm.reset();
}

/**
 * フォームから値を取得する
 * @returns {{title: string, due: string, tags: string[], status: string}}
 */
function getFormValues() {
    const title = dom.formTitle.value.trim();
    const due = dom.formDue.value;
    const tags = dom.formTags.value.trim().split(',').filter(Boolean);
    const status = dom.formStatus.value;
    return { title, due, tags, status };
}

/**
 * フィルタ入力欄をリセットする
 */
function clearFilters() {
    dom.filterKeyword.value = '';
    dom.filterStatus.value = 'all';
    dom.filterTag.value = '';
}
