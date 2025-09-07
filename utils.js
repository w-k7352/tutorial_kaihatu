// utils.js

/**
 * UUID v4を生成する
 * @returns {string} 一意なID
 */
function generateUUID() {
    return crypto.randomUUID();
}

/**
 * ISO 8601形式の現在時刻を取得する
 * @returns {string}
 */
function getCurrentISOTime() {
    return new Date().toISOString();
}

/**
 * タスク配列をCSV文字列に変換する
 * @param {Array<Object>} tasks
 * @returns {string} CSV形式の文字列
 */
function generateCSV(tasks) {
    const header = 'id,title,due,tags,status,created_at,updated_at';
    const rows = tasks.map(task => {
        const title = `"${task.title.replace(/"/g, '""')}"`;
        const tags = `"${task.tags.join(',').replace(/"/g, '""')}"`;
        return [
            task.id,
            title,
            task.due || '',
            tags,
            task.status,
            task.created_at,
            task.updated_at
        ].join(',');
    });
    return [header, ...rows].join('\n');
}

/**
 * CSVダウンロードをトリガーする
 * @param {string} csvContent
 * @param {string} fileName
 */
function triggerCsvDownload(csvContent, fileName) {
    const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
    const blob = new Blob([bom, csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
