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
        menuView: 'نمایش',
        menuZoomIn: 'بزرگنمایی',
        menuZoomOut: 'کوچکنمایی',
        menuZoomReset: 'تنظیم پیش‌فرض',
        menuWordWrap: 'شکستن خودکار خطوط',
        menuToggleLines: 'نمایش شماره خطوط',
        menuToggleStatus: 'نمایش نوار وضعیت',
        menuThemeToggle: 'تغییر تم (تاریک/روشن)',
        menuSettings: 'تنظیمات',
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
        
        modalSettingsTitle: 'تنظیمات وب‌اپ',
        settingFontLabel: 'فونت ویرایشگر',
        settingFontSizeLabel: 'اندازه فونت (پیکسل)',
        settingLineHeightLabel: 'فاصله بین خطوط',
        settingLangLabel: 'زبان برنامه',
        settingSave: 'ذخیره تنظیمات',
        
        modalGotoTitle: 'برو به خط',
        modalGotoLabel: 'شماره خط را وارد کنید:',
        modalGotoBtn: 'برو',
        
        defaultTabTitle: 'سند جدید',
        unsavedWarning: 'تغییرات ذخیره نشده‌اند. آیا مایل به بستن هستید؟'
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
        menuView: 'View',
        menuZoomIn: 'Zoom In',
        menuZoomOut: 'Zoom Out',
        menuZoomReset: 'Restore Default Zoom',
        menuWordWrap: 'Word Wrap',
        menuToggleLines: 'Show Line Numbers',
        menuToggleStatus: 'Show Status Bar',
        menuThemeToggle: 'Toggle Theme (Dark/Light)',
        menuSettings: 'Settings',
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
        
        modalSettingsTitle: 'Web App Settings',
        settingFontLabel: 'Editor Font',
        settingFontSizeLabel: 'Font Size (px)',
        settingLineHeightLabel: 'Line Height',
        settingLangLabel: 'App Language',
        settingSave: 'Save Settings',
        
        modalGotoTitle: 'Go to Line',
        modalGotoLabel: 'Enter line number:',
        modalGotoBtn: 'Go',
        
        defaultTabTitle: 'Untitled',
        unsavedWarning: 'Changes have not been saved. Do you want to close this tab?'
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
    fontFamily: "'Vazir', sans-serif"
};

const editor = document.getElementById('editor');
const gutter = document.getElementById('gutter');
const tabContainer = document.getElementById('tab-container');
const statusbar = document.getElementById('statusbar');
const searchPanel = document.getElementById('search-panel');
const findInput = document.getElementById('find-input');
const replaceInput = document.getElementById('replace-input');
const replaceRow = document.getElementById('replace-row');
const matchCaseChk = document.getElementById('match-case-chk');
const resultsCount = document.getElementById('search-results-count');

let searchState = {
    matches: [],
    currentIndex: -1,
    query: ''
};

function init() {
    loadSettings();
    applyTheme();
    applySettingsStyles();
    applyLocalization(state.lang);
    
    if (state.tabs.length === 0) {
        createNewTab();
    } else {
        renderTabs();
        selectTab(state.tabs[0].id);
    }
    
    registerEvents();
}

function saveSettings() {
    localStorage.setItem('notepad_pwa_settings', JSON.stringify({
        zoom: state.zoom,
        wordWrap: state.wordWrap,
        showLines: state.showLines,
        showStatus: state.showStatus,
        theme: state.theme,
        lang: state.lang,
        fontSize: state.fontSize,
        lineHeight: state.lineHeight,
        fontFamily: state.fontFamily
    }));
}

function loadSettings() {
    const saved = localStorage.getItem('notepad_pwa_settings');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            state = { ...state, ...parsed };
        } catch (e) {
            console.error("error restoring settings", e);
        }
    }
}

function applyLocalization(lang) {
    const t = locales[lang];
    if (!t) return;

    document.body.setAttribute('dir', t.dir);
    document.body.setAttribute('lang', t.lang);
    
    if (lang === 'fa') {
        state.fontFamily = "'Vazir', sans-serif";
    } else if (state.fontFamily === "'Vazir', sans-serif") {
        state.fontFamily = "Consolas, monospace";
    }
    
    // بروزرسانی امن عنوان منوهای ریشه بر اساس ساختار جدید
    const fileTitle = document.querySelector('#root-menu-file .menu-title');
    if (fileTitle) fileTitle.textContent = t.menuFile;

    const editTitle = document.querySelector('#root-menu-edit .menu-title');
    if (editTitle) editTitle.textContent = t.menuEdit;

    const viewTitle = document.querySelector('#root-menu-view .menu-title');
    if (viewTitle) viewTitle.textContent = t.menuView;

    const helpTitle = document.querySelector('#root-menu-help .menu-title');
    if (helpTitle) helpTitle.textContent = t.menuHelp;

    const menuSettingsTrigger = document.getElementById('menu-settings-trigger');
    if (menuSettingsTrigger) menuSettingsTrigger.textContent = t.menuSettings;

    // دراپ‌دان‌ها
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

    updateMenuShortcut('menu-zoom-in', t.menuZoomIn, 'Ctrl++');
    updateMenuShortcut('menu-zoom-out', t.menuZoomOut, 'Ctrl+-');
    updateMenuShortcut('menu-zoom-reset', t.menuZoomReset, 'Ctrl+0');

    document.getElementById('menu-about').textContent = t.menuAbout;

    updateToggleMenuTexts();

    findInput.placeholder = t.findPlaceholder;
    replaceInput.placeholder = t.replacePlaceholder;
    document.getElementById('replace-btn').textContent = t.findBtnReplace;
    document.getElementById('replace-all-btn').textContent = t.findBtnReplaceAll;
    document.getElementById('match-case-label').innerHTML = `<input type="checkbox" id="match-case-chk" ${matchCaseChk.checked ? 'checked' : ''}> ` + t.matchCaseLabel;

    // مودال‌ها
    const aboutModal = document.getElementById('modal-about');
    aboutModal.querySelector('.dialog-header').textContent = t.modalAboutTitle;
    const aboutBodyPs = aboutModal.querySelectorAll('.dialog-body p');
    aboutBodyPs[0].innerHTML = `<strong>${t.modalAboutText1}</strong>`;
    aboutBodyPs[1].textContent = t.modalAboutText2;
    aboutBodyPs[2].textContent = t.modalAboutText3;
    aboutBodyPs[3].textContent = t.modalAboutText4;
    aboutModal.querySelector('.modal-close-btn').textContent = t.modalClose;

    const settingsModal = document.getElementById('modal-settings');
    settingsModal.querySelector('.dialog-header').textContent = t.modalSettingsTitle;
    document.getElementById('setting-font-label').textContent = t.settingFontLabel;
    document.getElementById('setting-fontsize-label').textContent = t.settingFontSizeLabel;
    document.getElementById('setting-lineheight-label').textContent = t.settingLineHeightLabel;
    document.getElementById('setting-lang-label').textContent = t.settingLangLabel;
    document.getElementById('save-settings-btn').textContent = t.settingSave;
    settingsModal.querySelector('.modal-close-btn').textContent = t.modalCancel;

    const gotoModal = document.getElementById('modal-goto');
    gotoModal.querySelector('.dialog-header').textContent = t.modalGotoTitle;
    document.getElementById('goto-line-label').textContent = t.modalGotoLabel;
    document.getElementById('goto-confirm-btn').textContent = t.modalGotoBtn;
    gotoModal.querySelector('.modal-close-btn').textContent = t.modalCancel;

    populateFontOptions(lang);

    editor.placeholder = lang === 'fa' ? 'تایپ کنید...' : 'Type here...';

    updateStatusBar();
}

function updateMenuShortcut(id, text, shortcut) {
    const el = document.getElementById(id);
    if (el) {
        el.innerHTML = `${text} <span class="shortcut-hint">${shortcut}</span>`;
    }
}

function updateToggleMenuTexts() {
    const t = locales[state.lang];
    document.getElementById('menu-word-wrap').textContent = (state.wordWrap ? '✓ ' : '') + t.menuWordWrap;
    document.getElementById('menu-toggle-lines').textContent = (state.showLines ? '✓ ' : '') + t.menuToggleLines;
    document.getElementById('menu-toggle-status').textContent = (state.showStatus ? '✓ ' : '') + t.menuToggleStatus;
}

function populateFontOptions(lang) {
    const fontSelect = document.getElementById('setting-font');
    if (!fontSelect) return;
    fontSelect.innerHTML = '';
    
    if (lang === 'fa') {
        const opt = document.createElement('option');
        opt.value = "'Vazir', sans-serif";
        opt.textContent = "Vazir (وزیر)";
        fontSelect.appendChild(opt);
    } else {
        const options = [
            { name: "Segoe UI", value: "'Segoe UI', sans-serif" },
            { name: "Consolas (Monospace)", value: "Consolas, monospace" },
            { name: "Courier New", value: "'Courier New', monospace" }
        ];
        options.forEach(item => {
            const opt = document.createElement('option');
            opt.value = item.value;
            opt.textContent = item.name;
            fontSelect.appendChild(opt);
        });
    }
    fontSelect.value = state.fontFamily;
}

function applyTheme() {
    document.body.setAttribute('data-theme', state.theme);
}

function applySettingsStyles() {
    const dynamicSize = state.fontSize * (state.zoom / 100);
    document.documentElement.style.setProperty('--font-size', dynamicSize + 'px');
    document.documentElement.style.setProperty('--line-height', state.lineHeight);
    document.documentElement.style.setProperty('--font-family', state.fontFamily);
    
    if (state.wordWrap) {
        editor.classList.add('word-wrap');
    } else {
        editor.classList.remove('word-wrap');
    }

    gutter.style.display = state.showLines ? 'block' : 'none';
    statusbar.style.display = state.showStatus ? 'flex' : 'none';
    
    updateGutter();
}

function createNewTab(title = null, content = '', path = null) {
    // ایجاد آیدی منحصر به فرد مطمئن تر برای جلوگیری از هم‌پوشانی آیدی تب‌ها
    const newId = Date.now().toString() + Math.random().toString(36).substring(2, 7);
    const newTab = {
        id: newId,
        title: title || (state.lang === 'fa' ? 'سند جدید' : 'Untitled'),
        content: content,
        path: path,
        isDirty: false,
        history: [content],
        historyIndex: 0
    };
    state.tabs.push(newTab);
    renderTabs();
    selectTab(newId);
}

function renderTabs() {
    tabContainer.innerHTML = '';
    state.tabs.forEach(tab => {
        const tabEl = document.createElement('div');
        tabEl.className = `tab ${tab.id === state.activeTabId ? 'active' : ''}`;
        
        const titleSpan = document.createElement('span');
        titleSpan.className = 'tab-title';
        titleSpan.textContent = (tab.isDirty ? '* ' : '') + tab.title;
        titleSpan.addEventListener('click', () => selectTab(tab.id));
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'tab-close';
        closeBtn.innerHTML = '✕';
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeTab(tab.id);
        });

        tabEl.appendChild(titleSpan);
        tabEl.appendChild(closeBtn);
        tabContainer.appendChild(tabEl);
    });
}

function selectTab(id) {
    if (state.activeTabId) {
        const currentTab = state.tabs.find(t => t.id === state.activeTabId);
        if (currentTab) {
            currentTab.content = editor.value;
        }
    }
    
    state.activeTabId = id;
    const tab = state.tabs.find(t => t.id === id);
    if (tab) {
        editor.value = tab.content;
    }
    
    renderTabs();
    updateGutter();
    updateStatusBar();
    editor.focus();
}

function closeTab(id) {
    const tabIndex = state.tabs.findIndex(t => t.id === id);
    if (tabIndex === -1) return;
    
    const tab = state.tabs[tabIndex];
    if (tab.isDirty) {
        const t = locales[state.lang];
        if (!confirm(t.unsavedWarning)) return;
    }
    
    state.tabs.splice(tabIndex, 1);
    
    if (state.tabs.length === 0) {
        createNewTab();
    } else {
        if (state.activeTabId === id) {
            const nextActive = state.tabs[Math.max(0, tabIndex - 1)];
            selectTab(nextActive.id);
        } else {
            renderTabs();
        }
    }
}

function updateGutter() {
    if (!state.showLines) return;
    const lines = editor.value.split('\n');
    const totalLines = lines.length;
    let html = '';
    for (let i = 1; i <= totalLines; i++) {
        html += `<div>${i}</div>`;
    }
    gutter.innerHTML = html;
    gutter.scrollTop = editor.scrollTop;
}

function updateStatusBar() {
    const t = locales[state.lang];
    
    const textBeforeCaret = editor.value.substring(0, editor.selectionStart);
    const lines = textBeforeCaret.split('\n');
    const currentLine = lines.length;
    const currentCol = lines[lines.length - 1].length + 1;
    
    document.getElementById('status-caret').textContent = t.statusCaret
        .replace('{line}', currentLine)
        .replace('{col}', currentCol);
        
    const charCount = editor.value.length;
    const words = editor.value.trim() ? editor.value.trim().split(/\s+/).length : 0;
    
    document.getElementById('status-stats').textContent = t.statusStats
        .replace('{chars}', charCount)
        .replace('{words}', words);
        
    document.getElementById('status-zoom').textContent = `${state.zoom}%`;
    document.getElementById('status-direction').textContent = state.lang === 'fa' ? t.statusDirection : 'LTR';
}

let historyTimer = null;
function handleTyping() {
    const tab = state.tabs.find(t => t.id === state.activeTabId);
    if (!tab) return;

    const currentText = editor.value;
    if (currentText !== tab.content) {
        tab.content = currentText;
        tab.isDirty = true;
        renderTabs();
        updateGutter();
        updateStatusBar();

        clearTimeout(historyTimer);
        historyTimer = setTimeout(() => {
            if (tab.history[tab.historyIndex] !== currentText) {
                tab.history = tab.history.slice(0, tab.historyIndex + 1);
                tab.history.push(currentText);
                if (tab.history.length > 50) tab.history.shift();
                tab.historyIndex = tab.history.length - 1;
            }
        }, 500);
    }
}

function triggerUndo() {
    const tab = state.tabs.find(t => t.id === state.activeTabId);
    if (!tab || !tab.history || tab.historyIndex <= 0) return;
    tab.historyIndex--;
    editor.value = tab.history[tab.historyIndex];
    tab.content = editor.value;
    updateGutter();
    updateStatusBar();
}

function triggerRedo() {
    const tab = state.tabs.find(t => t.id === state.activeTabId);
    if (!tab || !tab.history || tab.historyIndex >= tab.history.length - 1) return;
    tab.historyIndex++;
    editor.value = tab.history[tab.historyIndex];
    tab.content = editor.value;
    updateGutter();
    updateStatusBar();
}

function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.style.display = 'flex';
        
        if (id === 'modal-settings') {
            document.getElementById('setting-fontsize').value = state.fontSize;
            document.getElementById('setting-lineheight').value = state.lineHeight;
            document.getElementById('setting-lang').value = state.lang;
            populateFontOptions(state.lang);
        }
    }
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.style.display = 'none';
    }
}

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

    searchState.matches = matches;
    searchState.query = query;

    if (matches.length > 0) {
        if (searchState.currentIndex < 0 || searchState.currentIndex >= matches.length) {
            searchState.currentIndex = 0;
        }
        highlightMatch(searchState.currentIndex);
    } else {
        searchState.currentIndex = -1;
    }
    
    updateSearchUI();
}

function highlightMatch(idx) {
    if (idx < 0 || idx >= searchState.matches.length) return;
    const current = searchState.matches[idx];
    editor.focus();
    editor.setSelectionRange(current.start, current.end);
}

function updateSearchUI() {
    if (searchState.matches.length > 0) {
        resultsCount.textContent = `${searchState.currentIndex + 1}/${searchState.matches.length}`;
    } else {
        resultsCount.textContent = '0/0';
    }
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
    const current = searchState.matches[searchState.currentIndex];
    const repl = replaceInput.value;
    const text = editor.value;

    editor.value = text.substring(0, current.start) + repl + text.substring(current.end);
    handleTyping();
    performSearch();
}

function replaceAll() {
    const query = findInput.value;
    if (!query) return;
    const repl = replaceInput.value;
    const matchCase = matchCaseChk.checked;
    const text = editor.value;

    let updatedText = "";
    if (matchCase) {
        updatedText = text.replaceAll(query, repl);
    } else {
        const escaped = query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const regex = new RegExp(escaped, 'gi');
        updatedText = text.replace(regex, repl);
    }

    editor.value = updatedText;
    handleTyping();
    performSearch();
}

function triggerOpenFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt,.html,.css,.js,.json,.md';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
            createNewTab(file.name, evt.target.result, file.name);
        };
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
}

function registerEvents() {
    editor.addEventListener('scroll', () => {
        gutter.scrollTop = editor.scrollTop;
    });

    editor.addEventListener('input', () => {
        handleTyping();
    });

    editor.addEventListener('keyup', updateStatusBar);
    editor.addEventListener('click', updateStatusBar);
    editor.addEventListener('focus', updateStatusBar);

    document.getElementById('add-tab').addEventListener('click', () => createNewTab());

    // عملکرد اصلاح‌شده و کاملاً بدون باگ منو دسکتاپ
    let activeDropdownRoot = null;
    document.querySelectorAll('.menubar .menu-item').forEach(menuRoot => {
        const dropdown = menuRoot.querySelector('.dropdown');
        if (!dropdown) return; // چشم‌پوشی از آیتم‌هایی مثل تنظیمات که دراپ‌دان ندارند

        menuRoot.addEventListener('click', (e) => {
            // اگر کاربر دقیقا روی گزینه‌های درونی کلیک کرد، این متد را متوقف کن تا هندلر گزینه اجرا شود
            if (dropdown.contains(e.target)) return;
            
            e.stopPropagation();
            const isActive = menuRoot.classList.contains('active');
            closeAllMenus();
            if (!isActive) {
                menuRoot.classList.add('active');
                activeDropdownRoot = menuRoot;
            } else {
                activeDropdownRoot = null;
            }
        });

        menuRoot.addEventListener('mouseenter', () => {
            if (activeDropdownRoot) {
                closeAllMenus();
                menuRoot.classList.add('active');
                activeDropdownRoot = menuRoot;
            }
        });
    });

    document.addEventListener('click', () => {
        closeAllMenus();
        activeDropdownRoot = null;
    });

    function closeAllMenus() {
        document.querySelectorAll('.menubar .menu-item').forEach(m => m.classList.remove('active'));
    }

    // انتساب کارهای دکمه‌های منوبار
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
    document.getElementById('menu-select-all').addEventListener('click', () => {
        editor.focus();
        editor.select();
    });

    document.getElementById('menu-insert-date').addEventListener('click', () => {
        const dateStr = new Date().toLocaleString(state.lang === 'fa' ? 'fa-IR' : 'en-US');
        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        editor.value = editor.value.substring(0, start) + dateStr + editor.value.substring(end);
        editor.setSelectionRange(start + dateStr.length, start + dateStr.length);
        handleTyping();
    });

    document.getElementById('menu-zoom-in').addEventListener('click', () => {
        state.zoom = Math.min(300, state.zoom + 10);
        applySettingsStyles();
        updateStatusBar();
    });

    document.getElementById('menu-zoom-out').addEventListener('click', () => {
        state.zoom = Math.max(50, state.zoom - 10);
        applySettingsStyles();
        updateStatusBar();
    });

    document.getElementById('menu-zoom-reset').addEventListener('click', () => {
        state.zoom = 100;
        applySettingsStyles();
        updateStatusBar();
    });

    document.getElementById('menu-word-wrap').addEventListener('click', () => {
        state.wordWrap = !state.wordWrap;
        applySettingsStyles();
        updateToggleMenuTexts();
        saveSettings();
    });

    document.getElementById('menu-toggle-lines').addEventListener('click', () => {
        state.showLines = !state.showLines;
        applySettingsStyles();
        updateToggleMenuTexts();
        saveSettings();
    });

    document.getElementById('menu-toggle-status').addEventListener('click', () => {
        state.showStatus = !state.showStatus;
        applySettingsStyles();
        updateToggleMenuTexts();
        saveSettings();
    });

    document.getElementById('menu-theme-toggle').addEventListener('click', () => {
        state.theme = state.theme === 'dark' ? 'light' : 'dark';
        applyTheme();
        saveSettings();
    });

    document.getElementById('menu-settings-trigger').addEventListener('click', () => openModal('modal-settings'));
    document.getElementById('menu-about').addEventListener('click', () => openModal('modal-about'));

    document.querySelectorAll('.modal-close-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            if (modal) closeModal(modal.id);
        });
    });

    document.getElementById('save-settings-btn').addEventListener('click', () => {
        state.fontSize = parseInt(document.getElementById('setting-fontsize').value) || 14;
        state.lineHeight = parseFloat(document.getElementById('setting-lineheight').value) || 1.5;
        
        const nextLang = document.getElementById('setting-lang').value;
        const fontChoice = document.getElementById('setting-font').value;
        
        state.lang = nextLang;
        state.fontFamily = fontChoice;

        applyLocalization(nextLang);
        applySettingsStyles();
        saveSettings();
        closeModal('modal-settings');
    });

    document.getElementById('goto-confirm-btn').addEventListener('click', () => {
        const lineNum = parseInt(document.getElementById('goto-line-input').value) || 1;
        const lines = editor.value.split('\n');
        const target = Math.min(lines.length, Math.max(1, lineNum));
        
        let targetIdx = 0;
        for (let i = 0; i < target - 1; i++) {
            targetIdx += lines[i].length + 1;
        }

        editor.focus();
        editor.setSelectionRange(targetIdx, targetIdx);
        closeModal('modal-goto');
        
        const fontSizeVal = state.fontSize * (state.zoom / 100);
        editor.scrollTop = (target - 1) * (fontSizeVal * state.lineHeight);
    });

    document.getElementById('setting-lang').addEventListener('change', (e) => {
        populateFontOptions(e.target.value);
    });

    findInput.addEventListener('input', performSearch);
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

    window.addEventListener('keydown', (e) => {
        if (e.ctrlKey) {
            const key = e.key.toLowerCase();
            switch (key) {
                case 'n':
                    e.preventDefault();
                    createNewTab();
                    break;
                case 'o':
                    e.preventDefault();
                    triggerOpenFile();
                    break;
                case 's':
                    e.preventDefault();
                    triggerSave(e.shiftKey);
                    break;
                case 'w':
                    e.preventDefault();
                    closeTab(state.activeTabId);
                    break;
                case 'p':
                    e.preventDefault();
                    window.print();
                    break;
                case 'z':
                    e.preventDefault();
                    triggerUndo();
                    break;
                case 'y':
                    e.preventDefault();
                    triggerRedo();
                    break;
                case 'f':
                    e.preventDefault();
                    replaceRow.style.display = 'none';
                    searchPanel.style.display = 'flex';
                    findInput.focus();
                    break;
                case 'h':
                    e.preventDefault();
                    replaceRow.style.display = 'flex';
                    searchPanel.style.display = 'flex';
                    findInput.focus();
                    break;
                case 'g':
                    e.preventDefault();
                    openModal('modal-goto');
                    break;
                case '0':
                    e.preventDefault();
                    state.zoom = 100;
                    applySettingsStyles();
                    updateStatusBar();
                    break;
                case '=':
                case '+':
                    e.preventDefault();
                    state.zoom = Math.min(300, state.zoom + 10);
                    applySettingsStyles();
                    updateStatusBar();
                    break;
                case '-':
                    e.preventDefault();
                    state.zoom = Math.max(50, state.zoom - 10);
                    applySettingsStyles();
                    updateStatusBar();
                    break;
            }
        } else if (e.key === 'F5') {
            e.preventDefault();
            document.getElementById('menu-insert-date').click();
        }
    });
}

init();