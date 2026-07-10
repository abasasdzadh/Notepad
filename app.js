// State & Storage Configuration
const DB_NAME = 'NotepadOfflineDB';
const DB_VERSION = 1;

let state = {
    tabs: [],
    activeTabId: null,
    settings: {
        theme: 'dark',
        fontFamily: "Tahoma, Geneva, sans-serif",
        fontSize: 14,
        lineHeight: 1.5,
        wordWrap: true,
        showStatusBar: true,
        showLineNumbers: true,
        defaultDir: 'rtl'
    },
    zoom: 100,
    findQuery: '',
    findMatches: [],
    findCurrentIndex: -1
};

// IndexedDB Handler for Offline Preservation
class StorageManager {
    static async init() {
        return new Promise((resolve) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);
            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains('app_state')) {
                    db.createObjectStore('app_state');
                }
            };
            request.onsuccess = (e) => {
                resolve(e.target.result);
            };
        });
    }

    static async save(key, value) {
        const db = await this.init();
        return new Promise((resolve) => {
            const tx = db.transaction('app_state', 'readwrite');
            tx.objectStore('app_state').put(value, key);
            tx.oncomplete = () => resolve(true);
        });
    }

    static async load(key) {
        const db = await this.init();
        return new Promise((resolve) => {
            const tx = db.transaction('app_state', 'readonly');
            const req = tx.objectStore('app_state').get(key);
            req.onsuccess = () => resolve(req.result);
        });
    }
}

// Global UI Selectors
const el = {
    editor: document.getElementById('editor'),
    gutter: document.getElementById('gutter'),
    tabContainer: document.getElementById('tab-container'),
    addTabBtn: document.getElementById('add-tab'),
    statusbar: document.getElementById('statusbar'),
    statusCaret: document.getElementById('status-caret'),
    statusStats: document.getElementById('status-stats'),
    statusZoom: document.getElementById('status-zoom'),
    statusDirection: document.getElementById('status-direction'),
    searchPanel: document.getElementById('search-panel'),
    findInput: document.getElementById('find-input'),
    replaceInput: document.getElementById('replace-input'),
    replaceRow: document.getElementById('replace-row'),
    findMatchesCount: document.getElementById('search-results-count'),
    modalAbout: document.getElementById('modal-about'),
    modalSettings: document.getElementById('modal-settings'),
    modalGoto: document.getElementById('modal-goto'),
    gotoLineInput: document.getElementById('goto-line-input')
};

// Initialize Application
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Load Settings
    const savedSettings = await StorageManager.load('settings');
    if (savedSettings) state.settings = { ...state.settings, ...savedSettings };
    applySettings();

    // 2. Load Active Tabs
    const savedTabs = await StorageManager.load('tabs');
    const lastActiveId = await StorageManager.load('activeTabId');

    if (savedTabs && savedTabs.length > 0) {
        state.tabs = savedTabs;
        state.activeTabId = lastActiveId || savedTabs[0].id;
    } else {
        createNewTab('بی‌نام ۱.txt', '');
    }

    renderTabs();
    switchTab(state.activeTabId);
    setupMenuHandlers();
    setupKeyboardShortcuts();
    registerEventListeners();
    updateStatistics();
    updateLineNumbers();

    // Register Service Worker for PWA
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js').catch(err => console.log("SW Reg Error:", err));
    }
});

// Settings Management
function applySettings() {
    document.body.setAttribute('data-theme', state.settings.theme);
    el.editor.style.fontFamily = state.settings.fontFamily;
    el.editor.style.fontSize = `${state.settings.fontSize * (state.zoom / 100)}px`;
    el.editor.style.lineHeight = state.settings.lineHeight;
    
    if (state.settings.wordWrap) {
        el.editor.classList.add('word-wrap');
    } else {
        el.editor.classList.remove('word-wrap');
    }

    el.gutter.style.display = state.settings.showLineNumbers ? 'block' : 'none';
    el.statusbar.style.display = state.settings.showStatusBar ? 'flex' : 'none';
    el.editor.style.direction = state.settings.defaultDir;
    el.statusDirection.textContent = state.settings.defaultDir === 'rtl' ? 'راست‌چین (RTL)' : 'چپ‌چین (LTR)';
}

async function saveSettings() {
    state.settings.fontFamily = document.getElementById('setting-font').value;
    state.settings.fontSize = parseInt(document.getElementById('setting-fontsize').value, 10);
    state.settings.lineHeight = parseFloat(document.getElementById('setting-lineheight').value);
    state.settings.defaultDir = document.getElementById('setting-dir').value;

    applySettings();
    await StorageManager.save('settings', state.settings);
    closeModals();
}

// Tab Management
function createNewTab(title = 'بی‌نام.txt', content = '', fileHandle = null) {
    const id = 'tab-' + Date.now();
    const newTab = { id, title, content, fileHandle, isModified: false };
    state.tabs.push(newTab);
    state.activeTabId = id;
    renderTabs();
    switchTab(id);
    saveSession();
}

function switchTab(id) {
    // Save current content to active tab object before switching
    const activeTabObj = state.tabs.find(t => t.id === state.activeTabId);
    if (activeTabObj) {
        activeTabObj.content = el.editor.value;
    }

    state.activeTabId = id;
    const tab = state.tabs.find(t => t.id === id);
    if (tab) {
        el.editor.value = tab.content;
        updateLineNumbers();
        updateStatistics();
        updateCaretStatus();
    }
    renderTabs();
    saveSession();
}

function closeTab(id, e) {
    if (e) e.stopPropagation();
    const tabIndex = state.tabs.findIndex(t => t.id === id);
    if (tabIndex === -1) return;

    const tab = state.tabs[tabIndex];
    if (tab.isModified) {
        if (!confirm(`تغییرات فایل "${tab.title}" ذخیره نشده است. آیا مایل به بستن تب هستید؟`)) return;
    }

    state.tabs.splice(tabIndex, 1);
    if (state.tabs.length === 0) {
        createNewTab('بی‌نام ۱.txt', '');
    } else if (state.activeTabId === id) {
        const nextActive = state.tabs[tabIndex] || state.tabs[tabIndex - 1];
        state.activeTabId = nextActive.id;
    }
    renderTabs();
    switchTab(state.activeTabId);
    saveSession();
}

function renderTabs() {
    el.tabContainer.innerHTML = '';
    state.tabs.forEach(tab => {
        const tabEl = document.createElement('div');
        tabEl.className = `tab ${tab.id === state.activeTabId ? 'active' : ''}`;
        tabEl.onclick = () => switchTab(tab.id);

        const titleEl = document.createElement('span');
        titleEl.className = 'tab-title';
        titleEl.textContent = `${tab.title}${tab.isModified ? ' *' : ''}`;
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'tab-close';
        closeBtn.innerHTML = '✕';
        closeBtn.onclick = (e) => closeTab(tab.id, e);

        tabEl.appendChild(titleEl);
        tabEl.appendChild(closeBtn);
        el.tabContainer.appendChild(tabEl);
    });
}

async function saveSession() {
    await StorageManager.save('tabs', state.tabs);
    await StorageManager.save('activeTabId', state.activeTabId);
}

// Line Numbers Engine
function updateLineNumbers() {
    if (!state.settings.showLineNumbers) return;
    const lines = el.editor.value.split('\n');
    const lineCount = lines.length;
    let gutterHTML = '';
    for (let i = 1; i <= lineCount; i++) {
        gutterHTML += `<div>${i}</div>`;
    }
    el.gutter.innerHTML = gutterHTML;
}

// File Access APIs (Modern + Fallback)
async function triggerOpenFile() {
    if ('showOpenFilePicker' in window) {
        try {
            const [handle] = await window.showOpenFilePicker({
                types: [{ description: 'متون متنی', accept: { 'text/plain': ['.txt', '.js', '.css', '.html', '.json'] } }],
            });
            const file = await handle.getFile();
            const content = await file.text();
            createNewTab(file.name, content, handle);
        } catch (err) {
            console.log("File open aborted or blocked.", err);
        }
    } else {
        const input = document.createElement('input');
        input.type = 'file';
        input.onchange = (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (evt) => {
                createNewTab(file.name, evt.target.result, null);
            };
            reader.readAsText(file);
        };
        input.click();
    }
}

async function triggerSaveFile(forceAs = false) {
    const activeTab = state.tabs.find(t => t.id === state.activeTabId);
    if (!activeTab) return;
    activeTab.content = el.editor.value;

    if ('showSaveFilePicker' in window && (!activeTab.fileHandle || forceAs)) {
        try {
            const handle = await window.showSaveFilePicker({
                suggestedName: activeTab.title,
                types: [{ description: 'متون متنی', accept: { 'text/plain': ['.txt'] } }],
            });
            activeTab.fileHandle = handle;
            activeTab.title = handle.name;
        } catch (err) {
            console.log("File save aborted.", err);
            return;
        }
    }

    if (activeTab.fileHandle) {
        try {
            const writable = await activeTab.fileHandle.createWritable();
            await writable.write(activeTab.content);
            await writable.close();
            activeTab.isModified = false;
        } catch (err) {
            console.error("Save failure using FileSystemHandle:", err);
            fallbackSave(activeTab);
        }
    } else {
        fallbackSave(activeTab);
    }
    renderTabs();
    saveSession();
}

function fallbackSave(tab) {
    const blob = new Blob([tab.content], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = tab.title.endsWith('.txt') ? tab.title : tab.title + '.txt';
    a.click();
    tab.isModified = false;
}

// Custom Context & Event Listeners
function registerEventListeners() {
    el.editor.addEventListener('input', () => {
        const activeTab = state.tabs.find(t => t.id === state.activeTabId);
        if (activeTab) {
            activeTab.content = el.editor.value;
            if (!activeTab.isModified) {
                activeTab.isModified = true;
                renderTabs();
            }
        }
        updateLineNumbers();
        updateStatistics();
    });

    el.editor.addEventListener('scroll', () => {
        el.gutter.scrollTop = el.editor.scrollTop;
    });

    el.editor.addEventListener('keyup', updateCaretStatus);
    el.editor.addEventListener('click', updateCaretStatus);

    el.addTabBtn.onclick = () => createNewTab(`بی‌نام ${state.tabs.length + 1}.txt`, '');

    // Setup Custom UI Modals
    document.querySelectorAll('.modal-close-btn').forEach(btn => {
        btn.onclick = closeModals;
    });

    window.onclick = (e) => {
        if (e.target.classList.contains('modal')) {
            closeModals();
        }
        // Menu item blur
        if (!e.target.closest('.menu-item')) {
            document.querySelectorAll('.menu-item').forEach(el => el.classList.remove('active'));
        }
    };

    // Drag and Drop integration
    window.addEventListener('dragover', (e) => e.preventDefault());
    window.addEventListener('drop', (e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            const reader = new FileReader();
            reader.onload = (evt) => {
                createNewTab(file.name, evt.target.result, null);
            };
            reader.readAsText(file);
        }
    });
}

function updateCaretStatus() {
    const pos = el.editor.selectionStart;
    const textBefore = el.editor.value.substring(0, pos);
    const lines = textBefore.split('\n');
    const row = lines.length;
    const col = lines[lines.length - 1].length + 1;
    el.statusCaret.textContent = `خط ${row}، ستون ${col}`;
}

function updateStatistics() {
    const val = el.editor.value;
    const chars = val.length;
    const words = val.trim() === "" ? 0 : val.trim().split(/\s+/).length;
    el.statusStats.textContent = `تعداد کاراکتر: ${chars} | کلمات: ${words}`;
}

// Menu Action Bindings
function setupMenuHandlers() {
    document.querySelectorAll('.menu-item').forEach(item => {
        item.onclick = (e) => {
            if (e.target.closest('.dropdown')) return;
            const alreadyOpen = item.classList.contains('active');
            document.querySelectorAll('.menu-item').forEach(el => el.classList.remove('active'));
            if (!alreadyOpen) item.classList.add('active');
        };
    });

    document.getElementById('menu-new').onclick = () => createNewTab(`بی‌نام ${state.tabs.length + 1}.txt`, '');
    document.getElementById('menu-open').onclick = triggerOpenFile;
    document.getElementById('menu-save').onclick = () => triggerSaveFile(false);
    document.getElementById('menu-save-as').onclick = () => triggerSaveFile(true);
    document.getElementById('menu-close').onclick = () => closeTab(state.activeTabId);
    
    document.getElementById('menu-print').onclick = () => {
        window.print();
    };

    document.getElementById('menu-undo').onclick = () => document.execCommand('undo');
    document.getElementById('menu-redo').onclick = () => document.execCommand('redo');
    document.getElementById('menu-select-all').onclick = () => {
        el.editor.focus();
        el.editor.select();
    };
    
    document.getElementById('menu-insert-date').onclick = () => {
        const stamp = new Date().toLocaleString('fa-IR');
        const start = el.editor.selectionStart;
        const end = el.editor.selectionEnd;
        el.editor.value = el.editor.value.substring(0, start) + stamp + el.editor.value.substring(end);
        el.editor.dispatchEvent(new Event('input'));
    };

    document.getElementById('menu-find').onclick = () => openSearchPanel(false);
    document.getElementById('menu-replace').onclick = () => openSearchPanel(true);
    document.getElementById('menu-goto').onclick = () => openModal(el.modalGoto);

    document.getElementById('menu-zoom-in').onclick = () => changeZoom(10);
    document.getElementById('menu-zoom-out').onclick = () => changeZoom(-10);
    document.getElementById('menu-zoom-reset').onclick = () => {
        state.zoom = 100;
        applySettings();
        el.statusZoom.textContent = '۱۰۰٪';
    };

    document.getElementById('menu-word-wrap').onclick = () => {
        state.settings.wordWrap = !state.settings.wordWrap;
        applySettings();
    };

    document.getElementById('menu-toggle-lines').onclick = () => {
        state.settings.showLineNumbers = !state.settings.showLineNumbers;
        applySettings();
    };

    document.getElementById('menu-toggle-status').onclick = () => {
        state.settings.showStatusBar = !state.settings.showStatusBar;
        applySettings();
    };

    document.getElementById('menu-theme-toggle').onclick = () => {
        state.settings.theme = state.settings.theme === 'dark' ? 'light' : 'dark';
        applySettings();
        StorageManager.save('settings', state.settings);
    };

    document.getElementById('menu-settings-trigger').onclick = () => {
        document.getElementById('setting-font').value = state.settings.fontFamily;
        document.getElementById('setting-fontsize').value = state.settings.fontSize;
        document.getElementById('setting-lineheight').value = state.settings.lineHeight;
        document.getElementById('setting-dir').value = state.settings.defaultDir;
        openModal(el.modalSettings);
    };

    document.getElementById('save-settings-btn').onclick = saveSettings;

    document.getElementById('menu-about').onclick = () => openModal(el.modalAbout);

    document.getElementById('goto-confirm-btn').onclick = () => {
        const lineNo = parseInt(el.gotoLineInput.value, 10);
        goToLine(lineNo);
        closeModals();
    };
}

// Key Shortcuts
function setupKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key.toLowerCase() === 'n') {
            e.preventDefault();
            createNewTab(`بی‌نام ${state.tabs.length + 1}.txt`, '');
        } else if (e.ctrlKey && e.key.toLowerCase() === 'o') {
            e.preventDefault();
            triggerOpenFile();
        } else if (e.ctrlKey && e.key.toLowerCase() === 's') {
            e.preventDefault();
            triggerSaveFile(e.shiftKey);
        } else if (e.ctrlKey && e.key.toLowerCase() === 'f') {
            e.preventDefault();
            openSearchPanel(false);
        } else if (e.ctrlKey && e.key.toLowerCase() === 'h') {
            e.preventDefault();
            openSearchPanel(true);
        } else if (e.ctrlKey && e.key.toLowerCase() === 'g') {
            e.preventDefault();
            openModal(el.modalGoto);
        } else if (e.key === 'F5') {
            e.preventDefault();
            document.getElementById('menu-insert-date').click();
        } else if (e.key === 'Escape') {
            closeModals();
            el.searchPanel.style.display = 'none';
        }
    });
}

// Find and Replace Subsystem
function openSearchPanel(withReplace = false) {
    el.searchPanel.style.display = 'flex';
    el.replaceRow.style.display = withReplace ? 'flex' : 'none';
    el.findInput.focus();
}

function performSearch() {
    const query = el.findInput.value;
    const text = el.editor.value;
    if (!query) {
        state.findMatches = [];
        state.findCurrentIndex = -1;
        el.findMatchesCount.textContent = '0/0';
        return;
    }

    const flags = document.getElementById('match-case-chk').checked ? 'g' : 'gi';
    const regex = new RegExp(query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), flags);
    
    state.findMatches = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
        state.findMatches.push({ index: match.index, length: query.length });
    }

    if (state.findMatches.length > 0) {
        state.findCurrentIndex = 0;
        selectMatch();
    } else {
        state.findCurrentIndex = -1;
        el.findMatchesCount.textContent = '0/0';
    }
}

function selectMatch() {
    if (state.findCurrentIndex < 0 || state.findCurrentIndex >= state.findMatches.length) return;
    const match = state.findMatches[state.findCurrentIndex];
    el.editor.focus();
    el.editor.setSelectionRange(match.index, match.index + match.length);
    el.findMatchesCount.textContent = `${state.findCurrentIndex + 1}/${state.findMatches.length}`;
}

// Find Button Handlers
document.getElementById('find-next-btn').onclick = () => {
    if (state.findMatches.length === 0) performSearch();
    else {
        state.findCurrentIndex = (state.findCurrentIndex + 1) % state.findMatches.length;
        selectMatch();
    }
};

document.getElementById('find-prev-btn').onclick = () => {
    if (state.findMatches.length === 0) performSearch();
    else {
        state.findCurrentIndex = (state.findCurrentIndex - 1 + state.findMatches.length) % state.findMatches.length;
        selectMatch();
    }
};

el.findInput.addEventListener('input', performSearch);
document.getElementById('match-case-chk').onchange = performSearch;

document.getElementById('replace-btn').onclick = () => {
    if (state.findCurrentIndex === -1 || state.findMatches.length === 0) return;
    const match = state.findMatches[state.findCurrentIndex];
    const replVal = el.replaceInput.value;
    const origVal = el.editor.value;
    
    el.editor.value = origVal.substring(0, match.index) + replVal + origVal.substring(match.index + match.length);
    performSearch();
};

document.getElementById('replace-all-btn').onclick = () => {
    const query = el.findInput.value;
    if (!query) return;
    const replVal = el.replaceInput.value;
    const flags = document.getElementById('match-case-chk').checked ? 'g' : 'gi';
    const regex = new RegExp(query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), flags);
    el.editor.value = el.editor.value.replace(regex, replVal);
    performSearch();
};

document.getElementById('close-search-btn').onclick = () => {
    el.searchPanel.style.display = 'none';
};

// Utilities
function openModal(modalEl) {
    closeModals();
    modalEl.style.display = 'flex';
}

function closeModals() {
    document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
}

function changeZoom(amount) {
    state.zoom = Math.max(50, Math.min(200, state.zoom + amount));
    applySettings();
    el.statusZoom.textContent = `${state.zoom}%`;
}

function goToLine(lineNo) {
    const lines = el.editor.value.split('\n');
    if (lineNo < 1 || lineNo > lines.length) return;
    let index = 0;
    for (let i = 0; i < lineNo - 1; i++) {
        index += lines[i].length + 1;
    }
    el.editor.focus();
    el.editor.setSelectionRange(index, index);
}
