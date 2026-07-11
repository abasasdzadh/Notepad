// START OF FILE Notepad-main/app.js

const locales = {
    fa: {
        dir: 'rtl',
        lang: 'fa',
        fontFamily: "'Vazir', sans-serif",
        menuFile: 'فایل',
        menuNew: 'جدید',
        menuOpen: 'باز کردن...',
        menuSave: 'ذخیره',
        menuSaveAs: 'ذخیره به عنوان...',
        menuPrint: 'چاپ',
        menuClose: 'بستن تب',
        menuEdit: 'ویرایش',
        menuUndo: 'واگرد',
        menuRedo: 'مجدد',
        menuFind: 'جستجو',
        menuReplace: 'جایگزینی',
        menuGoto: 'برو به خط...',
        menuSelectAll: 'انتخاب همه',
        menuInsertDate: 'درج تاریخ/ساعت',
        menuRename: 'تغییر نام فایل',
        menuView: 'نمایش',
        menuZoomIn: 'بزرگنمایی',
        menuZoomOut: 'کوچکنمایی',
        menuZoomReset: 'تنظیم پیش‌فرض',
        menuWordWrap: 'شکستن خودکار خطوط',
        menuToggleLines: 'نمایش شماره خطوط',
        menuToggleStatus: 'نمایش نوار وضعیت',
        menuToggleEditorDir: 'تغییر جهت ویرایشگر',
        menuHelp: 'راهنما',
        menuAbout: 'درباره Notepad',
        findPlaceholder: 'جستجو...',
        replacePlaceholder: 'جایگزینی با...',
        findBtnReplace: 'جایگزینی',
        findBtnReplaceAll: 'همه',
        matchCaseLabel: 'تطابق بزرگی/کوچکی حروف',
        statusCaret: 'خط {line}، ستون {col}',
        statusStats: 'تعداد کاراکتر: {chars} | کلمات: {words}',
        statusDirection: 'راست‌چین (RTL)',
        modalAboutTitle: 'درباره Notepad وب',
        modalAboutText1: 'Notepad (PWA) نسخه وب',
        modalAboutText2: 'یک ویرایشگر متن سبک و سریع با ظاهر مدرن ویندوز ۱۱.',
        modalAboutText3: 'سازگار با وب، پیاده‌سازی شده به‌صورت آفلاین و دارای قابلیت نصب به صورت PWA.',
        modalAboutText4: 'توسعه‌یافته با جاوااسکریپت استاندارد.',
        modalClose: 'بستن',
        modalCancel: 'لغو',
        modalGotoTitle: 'برو به خط',
        modalGotoLabel: 'شماره خط را وارد کنید:',
        modalGotoBtn: 'برو',
        defaultTabTitle: 'سند جدید',
        unsavedWarning: 'تغییرات ذخیره نشده‌اند. آیا مایل به بستن هستید؟',
        settingsTitle: 'تنظیمات',
        fontLabel: 'فونت',
        fontSizeLabel: 'اندازه فونت',
        lineHeightLabel: 'فاصله خطوط',
        langLabel: 'زبان',
        themeLabel: 'تم',
        themeDark: 'تاریک',
        themeLight: 'روشن',
        langFa: 'فارسی',
        langEn: 'انگلیسی'
    },
    en: {
        dir: 'ltr',
        lang: 'en',
        fontFamily: "Consolas, monospace",
        menuFile: 'File',
        menuNew: 'New',
        menuOpen: 'Open...',
        menuSave: 'Save',
        menuSaveAs: 'Save As...',
        menuPrint: 'Print',
        menuClose: 'Close Tab',
        menuEdit: 'Edit',
        menuUndo: 'Undo',
        menuRedo: 'Redo',
        menuFind: 'Find',
        menuReplace: 'Replace',
        menuGoto: 'Go To Line...',
        menuSelectAll: 'Select All',
        menuInsertDate: 'Insert Date/Time',
        menuRename: 'Rename File',
        menuView: 'View',
        menuZoomIn: 'Zoom In',
        menuZoomOut: 'Zoom Out',
        menuZoomReset: 'Restore Default Zoom',
        menuWordWrap: 'Word Wrap',
        menuToggleLines: 'Show Line Numbers',
        menuToggleStatus: 'Show Status Bar',
        menuToggleEditorDir: 'Toggle Editor Direction',
        menuHelp: 'Help',
        menuAbout: 'About Notepad',
        findPlaceholder: 'Find...',
        replacePlaceholder: 'Replace with...',
        findBtnReplace: 'Replace',
        findBtnReplaceAll: 'Replace All',
        matchCaseLabel: 'Match case',
        statusCaret: 'Ln {line}, Col {col}',
        statusStats: 'Chars: {chars} | Words: {words}',
        statusDirection: 'Left-to-Right (LTR)',
        modalAboutTitle: 'About Web Notepad',
        modalAboutText1: 'Notepad (PWA) Web Edition',
        modalAboutText2: 'A lightweight and fast text editor with a modern Windows 11 style.',
        modalAboutText3: 'Web compatible, offline-first, and installable as a PWA.',
        modalAboutText4: 'Developed with standard modern JavaScript.',
        modalClose: 'Close',
        modalCancel: 'Cancel',
        modalGotoTitle: 'Go to Line',
        modalGotoLabel: 'Enter line number:',
        modalGotoBtn: 'Go',
        defaultTabTitle: 'Untitled',
        unsavedWarning: 'Changes have not been saved. Do you want to close this tab?',
        settingsTitle: 'Settings',
        fontLabel: 'Font',
        fontSizeLabel: 'Font Size',
        lineHeightLabel: 'Line Height',
        langLabel: 'Language',
        themeLabel: 'Theme',
        themeDark: 'Dark',
        themeLight: 'Light',
        langFa: 'Persian',
        langEn: 'English'
    }
};

let state = {
    tabs: [],
    activeTabId: null,
    zoom: 100,
    wordWrap: true,
    showLines: true,
    showStatus: true,
    theme: 'dark',
    lang: 'fa',
    fontSize: 14,
    lineHeight: 1.5,
    fontFamily: "'Vazir', sans-serif",
    dir: 'rtl',
    editorDir: 'rtl'
};

const editor = document.getElementById('editor');
const gutter = document.getElementById('gutter');
const gutterWrapper = document.getElementById('gutter-wrapper');
const tabContainer = document.getElementById('tab-container');
const statusbar = document.getElementById('statusbar');
const searchPanel = document.getElementById('search-panel');
const findInput = document.getElementById('find-input');
const replaceInput = document.getElementById('replace-input');
const replaceRow = document.getElementById('replace-row');
const matchCaseChk = document.getElementById('match-case-chk');
const resultsCount = document.getElementById('search-results-count');

let searchState = { matches: [], currentIndex: -1, query: '' };
let autoSaveTimer = null;

function init() {
    loadSettings();
    applyTheme();
    applySettingsStyles();
    applyLocalization(state.lang);
    
    loadTabsFromStorage();
    
    if (state.tabs.length === 0) {
        createNewTab();
    } else {
        renderTabs();
        selectTab(state.activeTabId || state.tabs[0].id);
    }
    
    registerEvents();
    startAutoSave();
}

function saveSettings() {
    localStorage.setItem('notepad_pwa_settings', JSON.stringify({
        zoom: state.zoom, wordWrap: state.wordWrap, showLines: state.showLines,
        showStatus: state.showStatus, theme: state.theme, lang: state.lang,
        fontSize: state.fontSize, lineHeight: state.lineHeight,
        fontFamily: state.fontFamily, dir: state.dir, editorDir: state.editorDir
    }));
    updateSettingsDisplay();
}

function loadSettings() {
    const saved = localStorage.getItem('notepad_pwa_settings');
    if (saved) try { state = { ...state, ...JSON.parse(saved) }; } catch(e) {}
}

function saveTabsToStorage() {
    const cleanTabs = state.tabs.map(t => ({
        id: t.id,
        title: t.title,
        content: t.content,
        path: t.path,
        isDirty: t.isDirty
    }));
    localStorage.setItem('notepad_pwa_tabs', JSON.stringify(cleanTabs));
    localStorage.setItem('notepad_pwa_active_tab_id', state.activeTabId);
}

function loadTabsFromStorage() {
    const savedTabs = localStorage.getItem('notepad_pwa_tabs');
    const savedActiveId = localStorage.getItem('notepad_pwa_active_tab_id');
    if (savedTabs) {
        try {
            const parsed = JSON.parse(savedTabs);
            state.tabs = parsed.map(t => ({
                ...t,
                history: [t.content],
                historyIndex: 0
            }));
            if (savedActiveId && state.tabs.some(t => t.id === savedActiveId)) {
                state.activeTabId = savedActiveId;
            }
        } catch(e) {
            console.error("Failed to load tabs", e);
        }
    }
}

function applyLocalization(lang) {
    const t = locales[lang]; if (!t) return;
    state.dir = t.dir;
    document.body.setAttribute('dir', state.dir);
    document.body.setAttribute('lang', t.lang);
    if (lang === 'fa') state.fontFamily = "'Vazir', sans-serif";
    else if (state.fontFamily === "'Vazir', sans-serif") state.fontFamily = "Consolas, monospace";

    document.querySelector('#root-menu-file .menu-title').textContent = t.menuFile;
    document.querySelector('#root-menu-edit .menu-title').textContent = t.menuEdit;
    document.querySelector('#root-menu-view .menu-title').textContent = t.menuView;
    document.querySelector('#root-menu-help .menu-title').textContent = t.menuHelp;
    document.querySelector('#root-menu-settings .menu-title').textContent = t.settingsTitle;

    updateMenuShortcut('menu-new', t.menuNew, 'Ctrl+N');
    updateMenuShortcut('menu-open', t.menuOpen, 'Ctrl+O');
    updateMenuShortcut('menu-save', t.menuSave, 'Ctrl+S');
    updateMenuShortcut('menu-save-as', t.menuSaveAs, 'Ctrl+Shift+S');
    updateMenuShortcut('menu-print', t.menuPrint, 'Ctrl+P');
    updateMenuShortcut('menu-close', t.menuClose, 'Ctrl+W');
    updateMenuShortcut('menu-undo', t.menuUndo, 'Ctrl+Z');
    updateMenuShortcut('menu-redo', t.menuRedo, 'Ctrl+Y');
    updateMenuShortcut('menu-find', t.menuFind, 'Ctrl+F');
    updateMenuShortcut('menu-replace', t.menuReplace, 'Ctrl+H');
    updateMenuShortcut('menu-goto', t.menuGoto, 'Ctrl+G');
    updateMenuShortcut('menu-select-all', t.menuSelectAll, 'Ctrl+A');
    updateMenuShortcut('menu-insert-date', t.menuInsertDate, 'F5');
    updateMenuShortcut('menu-rename', t.menuRename, 'F2');
    updateMenuShortcut('menu-zoom-in', t.menuZoomIn, 'Ctrl++');
    updateMenuShortcut('menu-zoom-out', t.menuZoomOut, 'Ctrl+-');
    updateMenuShortcut('menu-zoom-reset', t.menuZoomReset, 'Ctrl+0');
    updateMenuShortcut('menu-toggle-editor-dir', t.menuToggleEditorDir, 'Ctrl+Shift+R');
    document.getElementById('menu-about').textContent = t.menuAbout;
    updateToggleMenuTexts();

    findInput.placeholder = t.findPlaceholder;
    replaceInput.placeholder = t.replacePlaceholder;
    document.getElementById('replace-btn').textContent = t.findBtnReplace;
    document.getElementById('replace-all-btn').textContent = t.findBtnReplaceAll;
    document.getElementById('match-case-label').innerHTML = `<input type="checkbox" id="match-case-chk" ${matchCaseChk.checked ? 'checked' : ''}> ` + t.matchCaseLabel;
    document.getElementById('search-btn').textContent = t.menuFind;

    const aboutModal = document.getElementById('modal-about');
    aboutModal.querySelector('.dialog-header').textContent = t.modalAboutTitle;
    const ps = aboutModal.querySelectorAll('.dialog-body p');
    ps[0].innerHTML = `<strong>${t.modalAboutText1}</strong>`;
    ps[1].textContent = t.modalAboutText2;
    ps[2].textContent = t.modalAboutText3;
    ps[3].textContent = t.modalAboutText4;
    aboutModal.querySelector('.modal-close-btn').textContent = t.modalClose;

    const gotoModal = document.getElementById('modal-goto');
    gotoModal.querySelector('.dialog-header').textContent = t.modalGotoTitle;
    document.getElementById('goto-line-label').textContent = t.modalGotoLabel;
    document.getElementById('goto-confirm-btn').textContent = t.modalGotoBtn;
    gotoModal.querySelector('.modal-close-btn').textContent = t.modalCancel;

    editor.placeholder = lang === 'fa' ? 'تایپ کنید...' : 'Type here...';
    state.editorDir = state.dir;
    editor.style.direction = state.editorDir;
    updateStatusBar();
    updateSettingsDisplay();
}

function updateMenuShortcut(id, text, shortcut) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = `${text} <span class="shortcut-hint">${shortcut}</span>`;
}

function updateToggleMenuTexts() {
    const t = locales[state.lang];
    document.getElementById('menu-word-wrap').textContent = (state.wordWrap ? '✓ ' : '') + t.menuWordWrap;
    document.getElementById('menu-toggle-lines').textContent = (state.showLines ? '✓ ' : '') + t.menuToggleLines;
    document.getElementById('menu-toggle-status').textContent = (state.showStatus ? '✓ ' : '') + t.menuToggleStatus;
}

function applyTheme() {
    document.body.setAttribute('data-theme', state.theme);
    document.getElementById('theme-icon').textContent = state.theme === 'dark' ? '🌙' : '☀️';
}

function applySettingsStyles() {
    const dynamicSize = state.fontSize * (state.zoom / 100);
    document.documentElement.style.setProperty('--font-size', dynamicSize + 'px');
    document.documentElement.style.setProperty('--line-height', state.lineHeight);
    document.documentElement.style.setProperty('--font-family', state.fontFamily);
    if (state.wordWrap) editor.classList.add('word-wrap');
    else editor.classList.remove('word-wrap');
    gutterWrapper.style.display = state.showLines ? 'block' : 'none';
    statusbar.style.display = state.showStatus ? 'flex' : 'none';
    updateGutter();
}

/* ========== CHANGE: تابع شماره گذاری خطوط با روش جدید و بدون خطای انباشت ========== */
function updateGutter() {
    if (!state.showLines) return;
    const lines = editor.value.split('\n');
    
    let mirror = document.getElementById('textarea-mirror');
    if (!mirror) {
        mirror = document.createElement('div');
        mirror.id = 'textarea-mirror';
        mirror.style.position = 'absolute';
        mirror.style.visibility = 'hidden';
        mirror.style.top = '-9999px';
        mirror.style.left = '-9999px';
        mirror.style.boxSizing = 'border-box';
        document.body.appendChild(mirror);
    }
    
    const styles = window.getComputedStyle(editor);
    mirror.style.whiteSpace = styles.whiteSpace;
    mirror.style.wordBreak = styles.wordBreak;
    mirror.style.wordWrap = styles.wordWrap;
    mirror.style.fontFamily = styles.fontFamily;
    mirror.style.fontSize = styles.fontSize;
    mirror.style.lineHeight = styles.lineHeight;
    mirror.style.padding = styles.padding; // برای هماهنگی کامل با پدینگ ادیتور
    
    const paddingLeft = parseFloat(styles.paddingLeft) || 0;
    const paddingRight = parseFloat(styles.paddingRight) || 0;
    const innerWidth = editor.clientWidth - paddingLeft - paddingRight;
    mirror.style.width = innerWidth + 'px';
    
    let html = '';
    let accumulatedTop = 0;
    
    lines.forEach((lineText, idx) => {
        const cleanText = lineText === '' ? ' ' : lineText;
        mirror.textContent = cleanText;
        const lineHeightPx = mirror.offsetHeight;
        
        // کلید حل مشکل: استفاده از position: absolute و top به جای height محاسباتی
        html += `<div class="line-num" style="top: ${accumulatedTop + 10}px;">${idx + 1}</div>`;
        
        accumulatedTop += lineHeightPx;
    });
    
    gutter.innerHTML = html;
    gutter.style.height = Math.max(accumulatedTop, editor.scrollHeight) + 'px';
}
/* ======================== پایان تغییرات تابع ======================== */

function updateStatusBar() {
    const t = locales[state.lang];
    const before = editor.value.substring(0, editor.selectionStart);
    const lines = before.split('\n');
    const line = lines.length;
    const col = lines[lines.length-1].length + 1;
    document.getElementById('status-caret').textContent = t.statusCaret.replace('{line}', line).replace('{col}', col);
    const chars = editor.value.length;
    const words = editor.value.trim() ? editor.value.trim().split(/\s+/).length : 0;
    document.getElementById('status-stats').textContent = t.statusStats.replace('{chars}', chars).replace('{words}', words);
    document.getElementById('status-zoom').textContent = state.zoom + '%';
    document.getElementById('status-direction').textContent = state.editorDir === 'rtl' ? t.statusDirection : 'LTR';
}

function updateSettingsDisplay() {
    const t = locales[state.lang];
    const fontName = state.fontFamily.includes('Vazir') ? 'Vazir' :
                     state.fontFamily.includes('Consolas') ? 'Consolas' :
                     state.fontFamily.includes('Segoe') ? 'Segoe UI' : 'Custom';
    document.getElementById('settings-font-display').textContent = fontName;
    document.getElementById('settings-fontsize-display').textContent = state.fontSize;
    document.getElementById('settings-lineheight-display').textContent = state.lineHeight;
    document.getElementById('settings-lang-display').textContent = state.lang === 'fa' ? t.langFa : t.langEn;
    document.getElementById('settings-theme-display').textContent = state.theme === 'dark' ? t.themeDark : t.themeLight;
    document.getElementById('lang-label').textContent = state.lang === 'fa' ? 'فا' : 'En';
}

// ---- مدیریت تب‌ها ----
function createNewTab(title = null, content = '', path = null) {
    const id = Date.now().toString() + Math.random().toString(36).substring(2,7);
    const tab = {
        id, title: title || (state.lang === 'fa' ? 'سند جدید' : 'Untitled'),
        content, path, isDirty: false,
        history: [content], historyIndex: 0
    };
    state.tabs.push(tab);
    renderTabs();
    selectTab(id);
    saveTabsToStorage();
}

function renderTabs() {
    tabContainer.innerHTML = '';
    state.tabs.forEach(tab => {
        const el = document.createElement('div');
        el.className = `tab ${tab.id === state.activeTabId ? 'active' : ''}`;
        const title = document.createElement('span');
        title.className = 'tab-title';
        title.textContent = (tab.isDirty ? '* ' : '') + tab.title;
        title.addEventListener('click', () => selectTab(tab.id));
        const close = document.createElement('button');
        close.className = 'tab-close';
        close.innerHTML = '✕';
        close.addEventListener('click', (e) => { e.stopPropagation(); closeTab(tab.id); });
        el.appendChild(title);
        el.appendChild(close);
        tabContainer.appendChild(el);
    });
}

function selectTab(id) {
    if (state.activeTabId) {
        const cur = state.tabs.find(t => t.id === state.activeTabId);
        if (cur) cur.content = editor.value;
    }
    state.activeTabId = id;
    const tab = state.tabs.find(t => t.id === id);
    if (tab) editor.value = tab.content;
    renderTabs();
    updateGutter();
    updateStatusBar();
    editor.focus();
    saveTabsToStorage();
}

function closeTab(id) {
    const idx = state.tabs.findIndex(t => t.id === id);
    if (idx === -1) return;
    const tab = state.tabs[idx];
    if (tab.isDirty) {
        const t = locales[state.lang];
        if (!confirm(t.unsavedWarning)) return;
    }
    localStorage.removeItem('notepad_autosave_' + id);
    state.tabs.splice(idx, 1);
    if (state.tabs.length === 0) createNewTab();
    else {
        if (state.activeTabId === id) {
            const next = state.tabs[Math.max(0, idx - 1)];
            selectTab(next.id);
        } else renderTabs();
    }
    saveTabsToStorage();
}

function renameTab() {
    const tab = state.tabs.find(t => t.id === state.activeTabId);
    if (!tab) return;
    const t = locales[state.lang];
    const newName = prompt(t.menuRename + ':', tab.title);
    if (newName && newName.trim()) {
        tab.title = newName.trim();
        tab.isDirty = true;
        renderTabs();
        saveSettings();
        saveTabsToStorage();
    }
}

function toggleEditorDirection() {
    state.editorDir = state.editorDir === 'rtl' ? 'ltr' : 'rtl';
    editor.style.direction = state.editorDir;
    updateStatusBar();
    saveSettings();
}

// ---- منوی تنظیمات مدرن دراپ‌دان زنده ----
function setupSettingsDropdown() {
    document.querySelectorAll('#settings-dropdown .dropdown-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            const setting = item.dataset.setting;
            switch(setting) {
                case 'font': {
                    if (state.lang === 'fa') {
                        state.fontFamily = "'Vazir', sans-serif";
                    } else {
                        const fonts = ["Consolas, monospace", "'Segoe UI', sans-serif", "'Courier New', monospace"];
                        let idx = fonts.indexOf(state.fontFamily);
                        idx = (idx + 1) % fonts.length;
                        state.fontFamily = fonts[idx];
                    }
                    applySettingsStyles(); saveSettings(); break;
                }
                case 'fontsize': {
                    const sizes = [12,14,16,18,20];
                    let si = sizes.indexOf(state.fontSize);
                    si = (si + 1) % sizes.length;
                    state.fontSize = sizes[si];
                    applySettingsStyles(); saveSettings(); break;
                }
                case 'lineheight': {
                    const lh = [1,1.2,1.5,2];
                    let li = lh.indexOf(state.lineHeight);
                    li = (li + 1) % lh.length;
                    state.lineHeight = lh[li];
                    applySettingsStyles(); saveSettings(); break;
                }
                case 'lang': {
                    state.lang = state.lang === 'fa' ? 'en' : 'fa';
                    applyLocalization(state.lang);
                    applySettingsStyles(); saveSettings(); break;
                }
                case 'theme': {
                    state.theme = state.theme === 'dark' ? 'light' : 'dark';
                    applyTheme(); saveSettings(); break;
                }
            }
            updateSettingsDisplay();
        });
    });
}

// ---- جستجو و جایگزینی ----
function performSearch() {
    const query = findInput.value;
    if (!query) {
        searchState = { matches: [], currentIndex: -1, query: '' };
        resultsCount.textContent = '0/0';
        return;
    }
    const text = editor.value;
    const matchCase = matchCaseChk.checked;
    const findStr = matchCase ? query : query.toLowerCase();
    const targetStr = matchCase ? text : text.toLowerCase();
    const matches = [];
    let idx = targetStr.indexOf(findStr);
    while (idx !== -1) {
        matches.push({ start: idx, end: idx + findStr.length });
        idx = targetStr.indexOf(findStr, idx + findStr.length || idx + 1);
    }
    searchState = { matches, currentIndex: matches.length > 0 ? 0 : -1, query };
    if (matches.length > 0) highlightMatch(0);
    updateSearchUI();
}

function highlightMatch(idx) {
    if (idx < 0 || idx >= searchState.matches.length) return;
    const m = searchState.matches[idx];
    editor.focus();
    editor.setSelectionRange(m.start, m.end);
}

function updateSearchUI() {
    resultsCount.textContent = searchState.matches.length > 0 ?
        `${searchState.currentIndex + 1}/${searchState.matches.length}` : '0/0';
}

function findNext() {
    if (searchState.matches.length === 0) return;
    searchState.currentIndex = (searchState.currentIndex + 1) % searchState.matches.length;
    highlightMatch(searchState.currentIndex);
    updateSearchUI();
}
function findPrev() {
    if (searchState.matches.length === 0) return;
    searchState.currentIndex = (searchState.currentIndex - 1 + searchState.matches.length) % searchState.matches.length;
    highlightMatch(searchState.currentIndex);
    updateSearchUI();
}

function replaceCurrent() {
    if (searchState.currentIndex === -1 || searchState.matches.length === 0) return;
    const m = searchState.matches[searchState.currentIndex];
    const repl = replaceInput.value;
    const text = editor.value;
    editor.value = text.substring(0, m.start) + repl + text.substring(m.end);
    handleTyping();
    performSearch();
}

// همه
function replaceAll() {
    const query = findInput.value;
    if (!query) return;
    const repl = replaceInput.value;
    const matchCase = matchCaseChk.checked;
    let text = editor.value;
    let updated;
    if (matchCase) updated = text.replaceAll(query, repl);
    else {
        const escaped = query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        updated = text.replace(new RegExp(escaped, 'gi'), repl);
    }
    editor.value = updated;
    handleTyping();
    performSearch();
}

// ---- Auto-save ----
function startAutoSave() {
    if (autoSaveTimer) clearInterval(autoSaveTimer);
    autoSaveTimer = setInterval(() => {
        const tab = state.tabs.find(t => t.id === state.activeTabId);
        if (tab) {
            localStorage.setItem('notepad_autosave_' + tab.id, editor.value);
            saveTabsToStorage();
        }
    }, 5000);
}

// ---- Drag & Drop ----
function setupDragDrop() {
    editor.addEventListener('dragover', e => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; });
    editor.addEventListener('drop', e => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            const reader = new FileReader();
            reader.onload = evt => createNewTab(file.name, evt.target.result, file.name);
            reader.readAsText(file);
        }
    });
}

// ---- باز/بستن فایل ----
function triggerOpenFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt,.html,.css,.js,.json,.md';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = evt => createNewTab(file.name, evt.target.result, file.name);
        reader.readAsText(file);
    };
    input.click();
}

function triggerSave(saveAs = false) {
    const tab = state.tabs.find(t => t.id === state.activeTabId);
    if (!tab) return;
    if (saveAs || !tab.path) {
        const promptTitle = state.lang === 'fa' ? 'نام فایل برای ذخیره سازی را وارد کنید:' : 'Enter file name to save:';
        const filename = prompt(promptTitle, tab.path || tab.title + '.txt');
        if (!filename) return;
        tab.title = filename;
        tab.path = filename;
    }
    const blob = new Blob([editor.value], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = tab.path || tab.title;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    tab.isDirty = false;
    renderTabs();
    saveTabsToStorage();
}

// ---- تاریخچه (Undo/Redo) ----
let historyTimer = null;
function handleTyping() {
    const tab = state.tabs.find(t => t.id === state.activeTabId);
    if (!tab) return;
    const text = editor.value;
    if (text !== tab.content) {
        tab.content = text;
        tab.isDirty = true;
        renderTabs();
        updateGutter();
        updateStatusBar();
        clearTimeout(historyTimer);
        historyTimer = setTimeout(() => {
            if (tab.history[tab.historyIndex] !== text) {
                tab.history = tab.history.slice(0, tab.historyIndex + 1);
                tab.history.push(text);
                if (tab.history.length > 50) tab.history.shift();
                tab.historyIndex = tab.history.length - 1;
            }
            saveTabsToStorage();
        }, 500);
    }
}
function triggerUndo() {
    const tab = state.tabs.find(t => t.id === state.activeTabId);
    if (!tab || !tab.history || tab.historyIndex <= 0) return;
    tab.historyIndex--;
    editor.value = tab.history[tab.historyIndex];
    tab.content = editor.value;
    updateGutter(); updateStatusBar();
    saveTabsToStorage();
}
function triggerRedo() {
    const tab = state.tabs.find(t => t.id === state.activeTabId);
    if (!tab || !tab.history || tab.historyIndex >= tab.history.length - 1) return;
    tab.historyIndex++;
    editor.value = tab.history[tab.historyIndex];
    tab.content = editor.value;
    updateGutter(); updateStatusBar();
    saveTabsToStorage();
}

// ---- مودال‌ها ----
function openModal(id) { document.getElementById(id).style.display = 'flex'; }
function closeModal(id) { document.getElementById(id).style.display = 'none'; }

// ---- ثبت رویدادها ----
function registerEvents() {
    setupDragDrop();

    /* ========== CHANGE: رویداد اسکرول ادیتور برای رفع لگ در موبایل ========== */
    let isScrolling = false;
    editor.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                gutterWrapper.scrollTop = editor.scrollTop;
                isScrolling = false;
            });
            isScrolling = true;
        }
    });
    /* ======================== پایان تغییرات اسکرول ======================== */

    editor.addEventListener('input', handleTyping);
    editor.addEventListener('keyup', updateStatusBar);
    editor.addEventListener('click', updateStatusBar);
    editor.addEventListener('focus', updateStatusBar);

    // به‌روزرسانی ارتفاع خانه‌های سایدبار با تغییر سایز مرورگر
    window.addEventListener('resize', () => {
        updateGutter();
    });

    document.getElementById('add-tab').addEventListener('click', () => createNewTab());

    // منوهای کشویی
    let activeDropdown = null;
    document.querySelectorAll('.menubar .menu-item').forEach(root => {
        const dd = root.querySelector('.dropdown');
        if (!dd) return;
        root.addEventListener('click', (e) => {
            if (dd.contains(e.target)) return;
            e.stopPropagation();
            const isActive = root.classList.contains('active');
            document.querySelectorAll('.menubar .menu-item').forEach(m => m.classList.remove('active'));
            if (!isActive) { root.classList.add('active'); activeDropdown = root; }
            else activeDropdown = null;
        });
        root.addEventListener('mouseenter', () => {
            if (activeDropdown) {
                document.querySelectorAll('.menubar .menu-item').forEach(m => m.classList.remove('active'));
                root.classList.add('active');
                activeDropdown = root;
            }
        });
    });
    document.addEventListener('click', () => {
        document.querySelectorAll('.menubar .menu-item').forEach(m => m.classList.remove('active'));
        activeDropdown = null;
    });

    // دکمه‌های نوار منو مستقل
    document.getElementById('theme-toggle-btn').addEventListener('click', () => {
        state.theme = state.theme === 'dark' ? 'light' : 'dark';
        applyTheme(); saveSettings(); updateSettingsDisplay();
    });
    document.getElementById('lang-toggle-btn').addEventListener('click', () => {
        state.lang = state.lang === 'fa' ? 'en' : 'fa';
        applyLocalization(state.lang);
        applySettingsStyles(); saveSettings(); updateSettingsDisplay();
    });

    setupSettingsDropdown();

    // آیتم‌های منو
    document.getElementById('menu-new').addEventListener('click', () => createNewTab());
    document.getElementById('menu-open').addEventListener('click', triggerOpenFile);
    document.getElementById('menu-save').addEventListener('click', () => triggerSave(false));
    document.getElementById('menu-save-as').addEventListener('click', () => triggerSave(true));
    document.getElementById('menu-print').addEventListener('click', () => window.print());
    document.getElementById('menu-close').addEventListener('click', () => closeTab(state.activeTabId));
    document.getElementById('menu-undo').addEventListener('click', triggerUndo);
    document.getElementById('menu-redo').addEventListener('click', triggerRedo);
    document.getElementById('menu-find').addEventListener('click', () => {
        replaceRow.style.display = 'none';
        searchPanel.style.display = 'flex';
        findInput.focus();
    });
    document.getElementById('menu-replace').addEventListener('click', () => {
        replaceRow.style.display = 'flex';
        searchPanel.style.display = 'flex';
        findInput.focus();
    });
    document.getElementById('menu-goto').addEventListener('click', () => openModal('modal-goto'));
    document.getElementById('menu-select-all').addEventListener('click', () => { editor.focus(); editor.select(); });
    document.getElementById('menu-insert-date').addEventListener('click', () => {
        const dateStr = new Date().toLocaleString(state.lang === 'fa' ? 'fa-IR' : 'en-US');
        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        editor.value = editor.value.substring(0, start) + dateStr + editor.value.substring(end);
        editor.setSelectionRange(start + dateStr.length, start + dateStr.length);
        handleTyping();
    });
    document.getElementById('menu-rename').addEventListener('click', renameTab);
    document.getElementById('menu-zoom-in').addEventListener('click', () => {
        state.zoom = Math.min(300, state.zoom + 10);
        applySettingsStyles(); updateStatusBar();
    });
    document.getElementById('menu-zoom-out').addEventListener('click', () => {
        state.zoom = Math.max(50, state.zoom - 10);
        applySettingsStyles(); updateStatusBar();
    });
    document.getElementById('menu-zoom-reset').addEventListener('click', () => {
        state.zoom = 100;
        applySettingsStyles(); updateStatusBar();
    });
    document.getElementById('menu-word-wrap').addEventListener('click', () => {
        state.wordWrap = !state.wordWrap;
        applySettingsStyles(); updateToggleMenuTexts(); saveSettings();
    });
    document.getElementById('menu-toggle-lines').addEventListener('click', () => {
        state.showLines = !state.showLines;
        applySettingsStyles(); updateToggleMenuTexts(); saveSettings();
    });
    document.getElementById('menu-toggle-status').addEventListener('click', () => {
        state.showStatus = !state.showStatus;
        applySettingsStyles(); updateToggleMenuTexts(); saveSettings();
    });
    document.getElementById('menu-toggle-editor-dir').addEventListener('click', toggleEditorDirection);
    document.getElementById('menu-about').addEventListener('click', () => openModal('modal-about'));

    // مودال‌ها
    document.querySelectorAll('.modal-close-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            if (modal) closeModal(modal.id);
        });
    });

    document.getElementById('goto-confirm-btn').addEventListener('click', () => {
        const lineNum = parseInt(document.getElementById('goto-line-input').value) || 1;
        const lines = editor.value.split('\n');
        const target = Math.min(lines.length, Math.max(1, lineNum));
        let pos = 0;
        for (let i = 0; i < target - 1; i++) pos += lines[i].length + 1;
        editor.focus();
        editor.setSelectionRange(pos, pos);
        closeModal('modal-goto');
        const fs = state.fontSize * (state.zoom / 100);
        editor.scrollTop = (target - 1) * (fs * state.lineHeight);
    });

    // جستجو
    document.getElementById('search-btn').addEventListener('click', performSearch);
    findInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); performSearch(); } });
    matchCaseChk.addEventListener('change', performSearch);
    document.getElementById('find-next-btn').addEventListener('click', findNext);
    document.getElementById('find-prev-btn').addEventListener('click', findPrev);
    document.getElementById('replace-btn').addEventListener('click', replaceCurrent);
    document.getElementById('replace-all-btn').addEventListener('click', replaceAll);
    document.getElementById('close-search-btn').addEventListener('click', () => {
        searchPanel.style.display = 'none';
        searchState = { matches: [], currentIndex: -1, query: '' };
        editor.focus();
    });

    // کلیدهای میانبر استاندارد
    window.addEventListener('keydown', (e) => {
        if (e.ctrlKey) {
            const key = e.key.toLowerCase();
            switch(key) {
                case 'n': e.preventDefault(); createNewTab(); break;
                case 'o': e.preventDefault(); triggerOpenFile(); break;
                case 's': e.preventDefault(); triggerSave(e.shiftKey); break;
                case 'w': e.preventDefault(); closeTab(state.activeTabId); break;
                case 'p': e.preventDefault(); window.print(); break;
                case 'z': e.preventDefault(); triggerUndo(); break;
                case 'y': e.preventDefault(); triggerRedo(); break;
                case 'f': e.preventDefault(); replaceRow.style.display = 'none'; searchPanel.style.display = 'flex'; findInput.focus(); break;
                case 'h': e.preventDefault(); replaceRow.style.display = 'flex'; searchPanel.style.display = 'flex'; findInput.focus(); break;
                case 'g': e.preventDefault(); openModal('modal-goto'); break;
                case '0': e.preventDefault(); state.zoom = 100; applySettingsStyles(); updateStatusBar(); break;
                case '=': case '+': e.preventDefault(); state.zoom = Math.min(300, state.zoom + 10); applySettingsStyles(); updateStatusBar(); break;
                case '-': e.preventDefault(); state.zoom = Math.max(50, state.zoom - 10); applySettingsStyles(); updateStatusBar(); break;
                case 'r': if (e.shiftKey) { e.preventDefault(); toggleEditorDirection(); } break;
            }
        } else if (e.key === 'F5') { e.preventDefault(); document.getElementById('menu-insert-date').click(); }
        else if (e.key === 'F2') { e.preventDefault(); renameTab(); }
    });
}

// ========== PWA Install & Service Worker ==========
let deferredPrompt = null;
const installBtn = document.getElementById('install-btn');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.classList.remove('hidden');
});

installBtn.addEventListener('click', async () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') installBtn.classList.add('hidden');
        deferredPrompt = null;
    }
});

window.addEventListener('appinstalled', () => installBtn.classList.add('hidden'));

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
        .then(reg => console.log('SW registered:', reg))
        .catch(err => console.error('SW registration failed:', err));
}

// شروع و راه‌اندازی برنامه
init();