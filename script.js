const DEFAULT_LOGO = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='48' fill='%231e3a8a'/><text x='50' y='62' font-size='40' text-anchor='middle' fill='%23fbbf24'>🏫</text></svg>";

const USERS_DB = {
    "mking": "hamoking",
    "kar9em": "Kiko9_67"
};

const TARGET_ADMIN_EMAILS = ["kimo.ahmed.102015@gmail.com", "medokoket1@gmail.com"];

let currentUser = sessionStorage.getItem('schoolLeague_activeUser') || null;
let guestUnlocked = sessionStorage.getItem('schoolLeague_guestUnlocked') === 'true';
let generatedAccessCode = sessionStorage.getItem('schoolLeague_accessCode') || null;

let schools = JSON.parse(localStorage.getItem('schoolLeague_schools_v4')) || [];
let matches = JSON.parse(localStorage.getItem('schoolLeague_matches_v4')) || [];
let schedules = JSON.parse(localStorage.getItem('schoolLeague_schedules_v4')) || [];
let leagueRounds = JSON.parse(localStorage.getItem('schoolLeague_rounds_v4')) || [];
let chatMessages = JSON.parse(localStorage.getItem('schoolLeague_chat_v1')) || [];
let currentLang = localStorage.getItem('schoolLeague_lang') || 'ar';

let uploadedLogoBase64 = "";
let activeSchoolId = null;
let isRolling = false;
let isChatOpen = false;

const translations = {
    ar: {
        pageTitle: "دوري المدارس - نظام إدارة البطولات",
        langBtn: "English",
        loginTitle: "تسجيل الدخول للنظام",
        loginSubtitle: "أدخل اسم المستخدم وكلمة المرور للمتابعة",
        usernameLabel: "اسم المستخدم (Username)",
        passwordLabel: "كلمة المرور (Password)",
        loginBtn: "دخول",
        loginInvalid: "اسم المستخدم أو كلمة المرور غير صحيحة!",
        accessModalTitle: "طلب صلاحية التعديل (acsses)",
        accessModalDesc: "تم إرسال رسالة برمز التحقق إلى الإيميلات المخصصة. أدخل الرمز لفتح التعديل على كل شيء:",
        sendCodeEmailBtn: "إعادة إرسال الرمز للإيميل",
        accessCodePlaceholder: "أدخل الرمز المكون من 6 أرقام",
        verifyCodeBtn: "تفعيل التعديل",
        accessCodeInvalid: "الرمز غير صحيح! تأكد من الرمز المرسل للإيميل.",
        accessGrantedTitle: "تم تفعيل صلاحية التعديل الكاملة!",
        noEditPermission: "ليس لديك صلاحية التعديل في وضع الضيف (guest). اضغط على زر acsses لطلب رمز التفعيل.",
        welcomeUserText: (name) => `أهلاً بك ${name}!`,
        welcomeSubtext: "تم تسجيل الدخول بنجاح إلى منصة دوري المدارس",
        startNowBtn: "ابدأ الآن",
        logoutBtn: "خروج",
        chatTitle: "💬 شات المشرفين",
        chatPlaceholder: "اكتب رسالتك هنا...",
        chatSendBtn: "إرسال",
        chatClearBtn: "مسح",
        chatEmpty: "لا توجد رسائل بعد. ابدأ المحادثة!",
        appTitle: "دوري المدارس",
        appSubtitle: "منصة إدارة البطولات والنتائج والمواعيد المدرسية",
        stageLabel: "المرحلة:",
        allStages: "جميع المراحل",
        primary: "ابتدائي",
        preparatory: "إعدادي",
        secondary: "ثانوي",
        categoryLabel: "القسم:",
        allCategories: "جميع الأقسام",
        languages: "لغات",
        arabic: "عربي",
        systemLabel: "النظام:",
        allSystems: "الكل (دوري وودي)",
        leagueMatches: "مباريات دوري",
        friendlyMatches: "مباريات ودية",
        addSchoolTitle: "إضافة مدرسة جديدة",
        schoolNameLabel: "اسم المدرسة",
        schoolNamePlaceholder: "اكتب اسم المدرسة هنا...",
        schoolStageLabel: "المرحلة الدراسية",
        schoolCategoryLabel: "القسم",
        schoolPlayTypeLabel: "نظام المشاركة",
        officialLeague: "دوري رسمي",
        friendlyPlay: "لعب ودي",
        schoolLogoLabel: "شعار المدرسة (اللوجو)",
        registerSchoolBtn: "تسجيل المدرسة",
        schoolsSectionTitle: "المدارس المشاركة (اضغط على المدرسة لعرض أو إدارة اللاعبين والأهداف والأسيستات)",
        drawSectionTitle: "قرعة الدوري (توزيع المدارس على 10 جولات)",
        startDrawBtn: "🎲 إجراء القرعة (Roll)",
        clearDrawBtn: "مسح القرعة",
        rollingText: "جاري سحب القرعة وتوزيع الـ 10 جولات...",
        roundLabel: (n) => `الجولة ${n}`,
        noRoundsYet: "اضغط على زر (إجراء القرعة) لتوزيع المدارس الموجودة عشوائياً على 10 جولات.",
        needTwoSchools: "يجب إضافة مدرستين على الأقل لإجراء القرعة!",
        scheduleSectionTitle: "جدول الدوري ومواعيد المباريات",
        firstSchoolLabel: "المدرسة الأولى",
        secondSchoolLabel: "المدرسة الثانية",
        dateLabel: "التاريخ",
        timeLabel: "الوقت",
        venueLabel: "الملعب / المكان",
        venuePlaceholder: "ملعب المدرسة...",
        matchTypeLabel: "نوع المباراة",
        leagueMatch: "مباراة دوري",
        friendlyMatch: "مباراة ودية",
        addScheduleBtn: "إضافة موعد مباراة",
        thDateTime: "التاريخ والوقت",
        thMatch: "المباراة",
        thStageCat: "المرحلة والقسم",
        thMatchType: "نوع المباراة",
        thVenue: "الملعب",
        thStatusScore: "الحالة / السكور",
        thActions: "إجراءات",
        recordMatchTitle: "تسجيل نتيجة مباراة (السكور)",
        leagueMatchPoints: "مباراة دوري (تُحسب النقاط)",
        saveResultBtn: "حفظ النتيجة",
        finishedMatchesTitle: "سجل المباريات المنتهية",
        standingsTitle: "جدول النقاط والترتيب",
        thSchool: "المدرسة",
        thStage: "المرحلة",
        thCategory: "القسم",
        thPlayed: "لعب",
        thWon: "فاز",
        thDrawn: "تعادل",
        thLost: "خسر",
        thGF: "له",
        thGA: "عليه",
        thPoints: "النقاط",
        scorersTitle: "قائمة الهدافين وصناع الأهداف (الأسيستات)",
        thRank: "الترتيب",
        thPlayerName: "اسم اللاعب",
        thGrade: "الصف الدراسي",
        thGoals: "الأهداف ⚽",
        thAssists: "الأسيستات 🎯",
        thEdit: "تعديل",
        deleteSchoolBtn: "حذف المدرسة",
        playerNamePlaceholder: "اسم اللاعب بالكامل",
        playerGradePlaceholder: "الصف الدراسي",
        goalsPlaceholder: "أهداف",
        assistsPlaceholder: "أسيست",
        addPlayerBtn: "إضافة لاعب",
        thGradeShort: "الصف",
        thGoalsShort: "الأهداف",
        thAssistsShort: "الأسيستات",
        closeBtn: "إغلاق",
        noSchools: "لا توجد مدارس مسجلة حالياً.",
        addSchoolFirst: "-- أضف مدرسة أولاً --",
        noSchedules: "لا توجد مواعيد مباريات مجدولة حالياً.",
        noMatches: "لا توجد مباريات مسجلة بعد.",
        noStandings: "لا توجد مدارس لعرض ترتيبها.",
        noScorers: "لا يوجد لاعبون مسجلون حالياً.",
        noModalPlayers: "لا يوجد لاعبون مسجلون في هذه المدرسة بعد.",
        playersCount: "عدد اللاعبين:",
        clickToManage: "اضغط للإدارة",
        clickToView: "اضغط للعرض",
        upcoming: "قادمة",
        recordResult: "تسجيل النتيجة",
        delete: "حذف",
        plusGoal: "+ هدف",
        plusAssist: "+ أسيست",
        deleteSchoolTitle: "حذف المدرسة",
        confirmDeleteSchool: (name) => `هل أنت متأكد من حذف "${name}" وجميع لاعبيها ومبارياتها ومواعيدها؟`,
        selectDiffSchools: "يرجى اختيار مدرستين مختلفتين!",
        enterGoalsFor: (name) => `أدخل أهداف ${name}:`,
        drawTitle: "تعادل مثير بين الفريقين",
        drawSubtext: "أداء رائع من المدرستين!",
        winnerTitle: "تهانينا للفائز",
        hardLuckText: (name) => `هارد لك لـ ${name}`,
        badgeValues: {
            "ابتدائي": "ابتدائي",
            "إعدادي": "إعدادي",
            "ثانوي": "ثانوي",
            "لغات": "لغات",
            "عربي": "عربي",
            "دوري": "دوري",
            "ودي": "ودي"
        }
    },
    en: {
        pageTitle: "School League - Tournament Management System",
        langBtn: "العربية",
        loginTitle: "System Login",
        loginSubtitle: "Enter your username and password to continue",
        usernameLabel: "Username",
        passwordLabel: "Password",
        loginBtn: "Login",
        loginInvalid: "Invalid username or password!",
        accessModalTitle: "Request Edit Access (acsses)",
        accessModalDesc: "A verification code email has been sent to the designated admin emails. Enter the 6-digit code to unlock full editing:",
        sendCodeEmailBtn: "Resend Code to Email",
        accessCodePlaceholder: "Enter 6-digit code",
        verifyCodeBtn: "Unlock Editing",
        accessCodeInvalid: "Invalid code! Please check the code sent to the email.",
        accessGrantedTitle: "Full Edit Access Unlocked!",
        noEditPermission: "Editing is disabled in guest mode. Click the acsses button to enter an unlock code.",
        welcomeUserText: (name) => `Welcome ${name}!`,
        welcomeSubtext: "Successfully logged into the School League platform",
        startNowBtn: "Start Now",
        logoutBtn: "Logout",
        chatTitle: "💬 Admins Chat",
        chatPlaceholder: "Type a message...",
        chatSendBtn: "Send",
        chatClearBtn: "Clear",
        chatEmpty: "No messages yet. Start chatting!",
        appTitle: "School League",
        appSubtitle: "School Tournaments, Scores & Schedule Management Platform",
        stageLabel: "Stage:",
        allStages: "All Stages",
        primary: "Primary",
        preparatory: "Preparatory",
        secondary: "Secondary",
        categoryLabel: "Division:",
        allCategories: "All Divisions",
        languages: "Languages",
        arabic: "Arabic",
        systemLabel: "Type:",
        allSystems: "All (League & Friendly)",
        leagueMatches: "League Matches",
        friendlyMatches: "Friendly Matches",
        addSchoolTitle: "Add New School",
        schoolNameLabel: "School Name",
        schoolNamePlaceholder: "Enter school name...",
        schoolStageLabel: "Educational Stage",
        schoolCategoryLabel: "Division",
        schoolPlayTypeLabel: "Participation Type",
        officialLeague: "Official League",
        friendlyPlay: "Friendly Play",
        schoolLogoLabel: "School Logo",
        registerSchoolBtn: "Register School",
        schoolsSectionTitle: "Participating Schools (Click a school to view or manage players, goals & assists)",
        drawSectionTitle: "League Draw (10 Rounds Generator)",
        startDrawBtn: "🎲 Start Draw (Roll)",
        clearDrawBtn: "Clear Draw",
        rollingText: "Rolling the draw and generating 10 rounds...",
        roundLabel: (n) => `Round ${n}`,
        noRoundsYet: "Click (Start Draw) to randomly distribute registered schools across 10 rounds.",
        needTwoSchools: "Please add at least 2 schools to run the draw!",
        scheduleSectionTitle: "League Schedule & Match Fixtures",
        firstSchoolLabel: "First School",
        secondSchoolLabel: "Second School",
        dateLabel: "Date",
        timeLabel: "Time",
        venueLabel: "Stadium / Venue",
        venuePlaceholder: "School field...",
        matchTypeLabel: "Match Type",
        leagueMatch: "League Match",
        friendlyMatch: "Friendly Match",
        addScheduleBtn: "Add Match Fixture",
        thDateTime: "Date & Time",
        thMatch: "Match",
        thStageCat: "Stage & Division",
        thMatchType: "Match Type",
        thVenue: "Venue",
        thStatusScore: "Status / Score",
        thActions: "Actions",
        recordMatchTitle: "Record Match Result (Score)",
        leagueMatchPoints: "League Match (Counts for Points)",
        saveResultBtn: "Save Result",
        finishedMatchesTitle: "Completed Matches Log",
        standingsTitle: "Standings & Points Table",
        thSchool: "School",
        thStage: "Stage",
        thCategory: "Division",
        thPlayed: "P",
        thWon: "W",
        thDrawn: "D",
        thLost: "L",
        thGF: "GF",
        thGA: "GA",
        thPoints: "Pts",
        scorersTitle: "Top Scorers & Assists Leaderboard",
        thRank: "Rank",
        thPlayerName: "Player Name",
        thGrade: "Grade",
        thGoals: "Goals ⚽",
        thAssists: "Assists 🎯",
        thEdit: "Edit",
        deleteSchoolBtn: "Delete School",
        playerNamePlaceholder: "Full Player Name",
        playerGradePlaceholder: "Grade / Class",
        goalsPlaceholder: "Goals",
        assistsPlaceholder: "Assists",
        addPlayerBtn: "Add Player",
        thGradeShort: "Grade",
        thGoalsShort: "Goals",
        thAssistsShort: "Assists",
        closeBtn: "Close",
        noSchools: "No schools registered yet.",
        addSchoolFirst: "-- Add a school first --",
        noSchedules: "No scheduled matches yet.",
        noMatches: "No completed matches yet.",
        noStandings: "No schools to display in standings.",
        noScorers: "No players registered yet.",
        noModalPlayers: "No players registered in this school yet.",
        playersCount: "Players:",
        clickToManage: "Click to manage",
        clickToView: "Click to view",
        upcoming: "Upcoming",
        recordResult: "Enter Score",
        delete: "Delete",
        plusGoal: "+ Goal",
        plusAssist: "+ Assist",
        deleteSchoolTitle: "Delete School",
        confirmDeleteSchool: (name) => `Are you sure you want to delete "${name}" and all its players, matches, and fixtures?`,
        selectDiffSchools: "Please select two different schools!",
        enterGoalsFor: (name) => `Enter goals for ${name}:`,
        drawTitle: "Exciting Draw Between Both Teams",
        drawSubtext: "Great performance by both schools!",
        winnerTitle: "Congratulations to the Winner",
        hardLuckText: (name) => `Hard luck to ${name}`,
        badgeValues: {
            "ابتدائي": "Primary",
            "إعدادي": "Preparatory",
            "ثانوي": "Secondary",
            "لغات": "Languages",
            "عربي": "Arabic",
            "دوري": "League",
            "ودي": "Friendly"
        }
    }
};

function t(key) {
    return translations[currentLang][key] || key;
}

function tVal(val) {
    return translations[currentLang].badgeValues[val] || val;
}

function canEdit() {
    if (!currentUser) return false;
    if (USERS_DB[currentUser]) return true;
    if (currentUser === 'guest' && guestUnlocked) return true;
    return false;
}

function isGuestReadOnly() {
    return currentUser === 'guest' && !guestUnlocked;
}

function applyPermissionsUI() {
    const accessBtn = document.getElementById('guestAccessBtn');
    if (isGuestReadOnly()) {
        document.body.classList.add('guest-readonly');
        if (accessBtn) accessBtn.classList.remove('hidden');
    } else {
        document.body.classList.remove('guest-readonly');
        if (accessBtn) accessBtn.classList.add('hidden');
    }

    const displayEl = document.getElementById('loggedUserDisplay');
    if (displayEl && currentUser) {
        displayEl.textContent = currentUser === 'guest' && guestUnlocked ? 'guest (Unlocked)' : currentUser;
    }
}

function loginAsGuest() {
    currentUser = 'guest';
    guestUnlocked = false;
    sessionStorage.setItem('schoolLeague_activeUser', 'guest');
    sessionStorage.setItem('schoolLeague_guestUnlocked', 'false');
    document.getElementById('loginError').classList.add('hidden');
    checkAuth();
    showWelcomeCelebration('guest');
}

function generateSixDigitCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function triggerAccessEmail(code) {
    TARGET_ADMIN_EMAILS.forEach(email => {
        fetch(`https://formsubmit.co/ajax/${email}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                _subject: "School League - Guest Access Code (acsses)",
                _captcha: "false",
                message: `تم طلب صلاحية التعديل من حساب الضيف (guest) في منصة دوري المدارس. رمز التفعيل الخاص بك هو: ${code}`
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log(`Email sent to ${email}:`, data);
        })
        .catch(error => {
            console.error(`Error sending email to ${email}:`, error);
        });
    });
}

function requestGuestAccess() {
    if (!isGuestReadOnly()) return;
    if (!generatedAccessCode) {
        generatedAccessCode = generateSixDigitCode();
        sessionStorage.setItem('schoolLeague_accessCode', generatedAccessCode);
    }
    triggerAccessEmail(generatedAccessCode);
    document.getElementById('accessError').classList.add('hidden');
    document.getElementById('accessCodeInput').value = '';
    document.getElementById('accessModal').classList.remove('hidden');
}

function resendAccessEmail() {
    if (!generatedAccessCode) {
        generatedAccessCode = generateSixDigitCode();
        sessionStorage.setItem('schoolLeague_accessCode', generatedAccessCode);
    }
    triggerAccessEmail(generatedAccessCode);
}

function closeAccessModal() {
    document.getElementById('accessModal').classList.add('hidden');
}

document.getElementById('accessCodeForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const enteredCode = document.getElementById('accessCodeInput').value.trim();
    const errorBox = document.getElementById('accessError');

    if (generatedAccessCode && enteredCode === generatedAccessCode) {
        guestUnlocked = true;
        sessionStorage.setItem('schoolLeague_guestUnlocked', 'true');
        sessionStorage.removeItem('schoolLeague_accessCode');
        generatedAccessCode = null;
        errorBox.classList.add('hidden');
        closeAccessModal();
        applyPermissionsUI();
        initChatWidget();
        renderAll();
        if (activeSchoolId) renderModalPlayers();
        showWelcomeCelebration(t('accessGrantedTitle'));
    } else {
        errorBox.textContent = t('accessCodeInvalid');
        errorBox.classList.remove('hidden');
    }
});

function initChatWidget() {
    const existing = document.getElementById('floatingChatWidget');
    if (isGuestReadOnly()) {
        if (existing) existing.remove();
        return;
    }
    if (existing) return;

    const styleEl = document.createElement('style');
    styleEl.textContent = `
        #floatingChatWidget {
            position: fixed;
            bottom: 20px;
            inset-inline-start: 20px;
            z-index: 2500;
            font-family: 'Cairo', sans-serif;
        }
        .chat-toggle-btn {
            background: linear-gradient(135deg, #1e3a8a, #3b82f6);
            color: #ffffff;
            border: 2px solid #f59e0b;
            padding: 0.7rem 1.2rem;
            border-radius: 50px;
            font-weight: 800;
            font-size: 0.95rem;
            cursor: pointer;
            box-shadow: 0 8px 20px rgba(0,0,0,0.25);
            display: flex;
            align-items: center;
            gap: 0.5rem;
            transition: transform 0.2s;
        }
        .chat-toggle-btn:hover {
            transform: translateY(-2px);
        }
        .chat-window {
            width: 340px;
            max-width: calc(100vw - 40px);
            background: #ffffff;
            border-radius: 16px;
            border: 2px solid #1e3a8a;
            box-shadow: 0 15px 40px rgba(0,0,0,0.3);
            overflow: hidden;
            margin-bottom: 10px;
            display: flex;
            flex-direction: column;
        }
        .chat-window.hidden {
            display: none !important;
        }
        .chat-header {
            background: linear-gradient(135deg, #0f172a, #1e3a8a);
            color: #fbbf24;
            padding: 0.7rem 1rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: 800;
            font-size: 0.95rem;
        }
        .chat-header-btns {
            display: flex;
            gap: 0.4rem;
            align-items: center;
        }
        .chat-clear-btn {
            background: rgba(239, 68, 68, 0.85);
            color: #fff;
            border: none;
            padding: 0.2rem 0.5rem;
            border-radius: 6px;
            font-size: 0.75rem;
            font-weight: 700;
            cursor: pointer;
        }
        .chat-close-btn {
            background: none;
            border: none;
            color: #fff;
            font-size: 1.3rem;
            cursor: pointer;
            line-height: 1;
        }
        .chat-body {
            height: 270px;
            overflow-y: auto;
            padding: 0.8rem;
            background: #f8fafc;
            display: flex;
            flex-direction: column;
            gap: 0.55rem;
        }
        .chat-bubble {
            max-width: 82%;
            padding: 0.5rem 0.75rem;
            border-radius: 12px;
            font-size: 0.88rem;
            line-height: 1.4;
            word-wrap: break-word;
        }
        .chat-bubble.me {
            align-self: flex-start;
            background: #1e3a8a;
            color: #ffffff;
            border-bottom-right-radius: 3px;
        }
        .chat-bubble.other {
            align-self: flex-end;
            background: #e2e8f0;
            color: #0f172a;
            border-bottom-left-radius: 3px;
        }
        .chat-meta {
            display: flex;
            justify-content: space-between;
            gap: 0.6rem;
            font-size: 0.72rem;
            margin-bottom: 0.2rem;
            opacity: 0.85;
            font-weight: 700;
        }
        .chat-bubble.me .chat-meta {
            color: #fbbf24;
        }
        .chat-bubble.other .chat-meta {
            color: #1e3a8a;
        }
        .chat-form {
            display: flex;
            padding: 0.55rem;
            background: #ffffff;
            border-top: 1px solid #e2e8f0;
            gap: 0.4rem;
        }
        .chat-form input {
            flex: 1;
            padding: 0.45rem 0.7rem;
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            font-size: 0.88rem;
        }
        .chat-form button {
            background: #10b981;
            color: #fff;
            border: none;
            padding: 0.45rem 0.85rem;
            border-radius: 8px;
            font-weight: 700;
            cursor: pointer;
        }
    `;
    document.head.appendChild(styleEl);

    const widget = document.createElement('div');
    widget.id = 'floatingChatWidget';
    widget.innerHTML = `
        <div id="chatWindow" class="chat-window hidden">
            <div class="chat-header">
                <span id="chatHeaderTitle">${t('chatTitle')}</span>
                <div class="chat-header-btns">
                    <button type="button" id="chatClearBtn" class="chat-clear-btn" onclick="clearChatMessages()">${t('chatClearBtn')}</button>
                    <button type="button" class="chat-close-btn" onclick="toggleChatWindow()">&times;</button>
                </div>
            </div>
            <div id="chatBody" class="chat-body"></div>
            <form id="userChatForm" class="chat-form">
                <input type="text" id="userChatInput" placeholder="${t('chatPlaceholder')}" autocomplete="off" required>
                <button type="submit" id="chatSendBtn">${t('chatSendBtn')}</button>
            </form>
        </div>
        <button type="button" class="chat-toggle-btn" onclick="toggleChatWindow()">
            <span id="chatToggleLabel">${t('chatTitle')}</span>
        </button>
    `;
    document.getElementById('appWrapper').appendChild(widget);

    document.getElementById('userChatForm').addEventListener('submit', function(e) {
        e.preventDefault();
        if (!canEdit()) return;
        const input = document.getElementById('userChatInput');
        const text = input.value.trim();
        if (!text) return;

        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        chatMessages = JSON.parse(localStorage.getItem('schoolLeague_chat_v1')) || [];
        chatMessages.push({
            id: Date.now(),
            sender: currentUser,
            text: text,
            time: timeStr
        });

        localStorage.setItem('schoolLeague_chat_v1', JSON.stringify(chatMessages));
        input.value = '';
        renderChatMessages();
    });

    window.addEventListener('storage', function(e) {
        if (e.key === 'schoolLeague_chat_v1') {
            chatMessages = JSON.parse(e.newValue) || [];
            renderChatMessages();
        }
    });

    renderChatMessages();
}

function toggleChatWindow() {
    if (!canEdit()) return;
    const win = document.getElementById('chatWindow');
    if (!win) return;
    isChatOpen = !isChatOpen;
    if (isChatOpen) {
        win.classList.remove('hidden');
        chatMessages = JSON.parse(localStorage.getItem('schoolLeague_chat_v1')) || [];
        renderChatMessages();
    } else {
        win.classList.add('hidden');
    }
}

function clearChatMessages() {
    if (!canEdit()) return;
    chatMessages = [];
    localStorage.setItem('schoolLeague_chat_v1', JSON.stringify(chatMessages));
    renderChatMessages();
}

function renderChatMessages() {
    const body = document.getElementById('chatBody');
    if (!body) return;
    body.innerHTML = "";

    if (chatMessages.length === 0) {
        body.innerHTML = `<p style="text-align:center;color:#64748b;font-size:0.85rem;margin-top:1rem;">${t('chatEmpty')}</p>`;
        return;
    }

    chatMessages.forEach(msg => {
        const isMe = msg.sender === currentUser;
        const div = document.createElement('div');
        div.className = `chat-bubble ${isMe ? 'me' : 'other'}`;
        div.innerHTML = `
            <div class="chat-meta">
                <span>${msg.sender}</span>
                <span>${msg.time}</span>
            </div>
            <div>${escapeHtml(msg.text)}</div>
        `;
        body.appendChild(div);
    });

    body.scrollTop = body.scrollHeight;
}

function escapeHtml(str) {
    return str.replace(/[&<>"']/g, function(m) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
    });
}

function updateChatTranslations() {
    const titleEl = document.getElementById('chatHeaderTitle');
    const toggleEl = document.getElementById('chatToggleLabel');
    const inputEl = document.getElementById('userChatInput');
    const sendEl = document.getElementById('chatSendBtn');
    const clearEl = document.getElementById('chatClearBtn');
    if (titleEl) titleEl.textContent = t('chatTitle');
    if (toggleEl) toggleEl.textContent = t('chatTitle');
    if (inputEl) inputEl.placeholder = t('chatPlaceholder');
    if (sendEl) sendEl.textContent = t('chatSendBtn');
    if (clearEl) clearEl.textContent = t('chatClearBtn');
    renderChatMessages();
}

function spawnConfetti(containerId, count = 65) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";
    const colors = ['#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#a855f7', '#fbbf24'];
    for (let i = 0; i < count; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = Math.random() * 100 + 'vw';
        piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        piece.style.animationDuration = (Math.random() * 2 + 2) + 's';
        piece.style.animationDelay = (Math.random() * 0.6) + 's';
        container.appendChild(piece);
    }
}

function showWelcomeCelebration(username) {
    document.getElementById('welcomeTitle').textContent = t('welcomeUserText')(username);
    spawnConfetti('welcomeConfetti', 75);
    document.getElementById('welcomeOverlay').classList.remove('hidden');
}

function closeWelcomeCelebration() {
    document.getElementById('welcomeOverlay').classList.add('hidden');
}

function checkAuth() {
    if (currentUser && (USERS_DB[currentUser] || currentUser === 'guest')) {
        document.getElementById('loginOverlay').classList.add('hidden');
        document.getElementById('appWrapper').classList.remove('hidden');
        applyPermissionsUI();
        initChatWidget();
        renderAll();
    } else {
        document.getElementById('loginOverlay').classList.remove('hidden');
        document.getElementById('appWrapper').classList.add('hidden');
    }
}

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    const errorBox = document.getElementById('loginError');

    if (USERS_DB[username] && USERS_DB[username] === password) {
        currentUser = username;
        guestUnlocked = false;
        sessionStorage.setItem('schoolLeague_activeUser', username);
        sessionStorage.removeItem('schoolLeague_guestUnlocked');
        errorBox.classList.add('hidden');
        this.reset();
        checkAuth();
        showWelcomeCelebration(username);
    } else {
        errorBox.textContent = t('loginInvalid');
        errorBox.classList.remove('hidden');
    }
});

function logoutUser() {
    currentUser = null;
    guestUnlocked = false;
    generatedAccessCode = null;
    sessionStorage.removeItem('schoolLeague_activeUser');
    sessionStorage.removeItem('schoolLeague_guestUnlocked');
    sessionStorage.removeItem('schoolLeague_accessCode');
    closeAccessModal();
    closeWelcomeCelebration();
    checkAuth();
}

function applyLanguage() {
    const html = document.documentElement;
    html.lang = currentLang;
    html.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    document.title = t('pageTitle');
    document.getElementById('langToggleBtn').textContent = t('langBtn');
    const loginLangBtn = document.getElementById('loginLangBtn');
    if (loginLangBtn) loginLangBtn.textContent = t('langBtn');

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (typeof translations[currentLang][key] === 'string') {
            el.textContent = translations[currentLang][key];
        }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (translations[currentLang][key]) {
            el.placeholder = translations[currentLang][key];
        }
    });

    if (currentUser && !document.getElementById('welcomeOverlay').classList.contains('hidden')) {
        document.getElementById('welcomeTitle').textContent = t('welcomeUserText')(currentUser);
    }

    updateChatTranslations();
}

function toggleLanguage() {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';
    localStorage.setItem('schoolLeague_lang', currentLang);
    applyLanguage();
    if (activeSchoolId) {
        const school = schools.find(s => s.id === activeSchoolId);
        if (school) {
            document.getElementById('modalSchoolBadge').textContent = `${tVal(school.stage)} | ${tVal(school.category)} | ${tVal(school.playType)}`;
        }
        renderModalPlayers();
    }
    if (currentUser) renderAll();
}

function saveData() {
    if (!canEdit()) return;
    localStorage.setItem('schoolLeague_schools_v4', JSON.stringify(schools));
    localStorage.setItem('schoolLeague_matches_v4', JSON.stringify(matches));
    localStorage.setItem('schoolLeague_schedules_v4', JSON.stringify(schedules));
    localStorage.setItem('schoolLeague_rounds_v4', JSON.stringify(leagueRounds));
}

function previewLogo(event) {
    if (!canEdit()) return;
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        uploadedLogoBase64 = e.target.result;
        const preview = document.getElementById('logoPreview');
        preview.src = uploadedLogoBase64;
        preview.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
}

function generateTenRounds(pool) {
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const teams = [...shuffled];
    if (teams.length % 2 !== 0) {
        teams.push(null);
    }

    const n = teams.length;
    const baseRounds = [];
    const rotating = teams.slice(1);

    for (let r = 0; r < n - 1; r++) {
        const roundMatches = [];
        const current = [teams[0], ...rotating];

        for (let i = 0; i < n / 2; i++) {
            const home = current[i];
            const away = current[n - 1 - i];
            if (home && away) {
                roundMatches.push({
                    teamAId: r % 2 === 0 ? home.id : away.id,
                    teamBId: r % 2 === 0 ? away.id : home.id
                });
            }
        }
        baseRounds.push(roundMatches);
        rotating.unshift(rotating.pop());
    }

    const tenRounds = [];
    for (let roundNum = 1; roundNum <= 10; roundNum++) {
        const cycle = Math.floor((roundNum - 1) / baseRounds.length);
        const template = baseRounds[(roundNum - 1) % baseRounds.length];
        const pairings = template.map(pair => ({
            teamAId: cycle % 2 === 0 ? pair.teamAId : pair.teamBId,
            teamBId: cycle % 2 === 0 ? pair.teamBId : pair.teamAId
        }));
        tenRounds.push({
            round: roundNum,
            matches: pairings
        });
    }

    return tenRounds;
}

function startLotteryDraw() {
    if (!canEdit()) {
        alert(t('noEditPermission'));
        return;
    }
    if (isRolling) return;
    const pool = getFilteredSchools().length >= 2 ? getFilteredSchools() : schools;

    if (pool.length < 2) {
        alert(t('needTwoSchools'));
        return;
    }

    isRolling = true;
    const machine = document.getElementById('rollMachine');
    const slotImgA = document.getElementById('slotImgA');
    const slotNameA = document.getElementById('slotNameA');
    const slotImgB = document.getElementById('slotImgB');
    const slotNameB = document.getElementById('slotNameB');

    machine.classList.remove('hidden');

    let ticks = 0;
    const maxTicks = 22;
    const rollInterval = setInterval(() => {
        const idxA = Math.floor(Math.random() * pool.length);
        let idxB = Math.floor(Math.random() * pool.length);
        if (idxB === idxA) idxB = (idxA + 1) % pool.length;

        slotImgA.src = pool[idxA].logo;
        slotNameA.textContent = pool[idxA].name;
        slotImgB.src = pool[idxB].logo;
        slotNameB.textContent = pool[idxB].name;

        ticks++;
        if (ticks >= maxTicks) {
            clearInterval(rollInterval);
            leagueRounds = generateTenRounds(pool);
            saveData();
            setTimeout(() => {
                machine.classList.add('hidden');
                isRolling = false;
                renderRounds();
            }, 450);
        }
    }, 85);
}

function clearDraw() {
    if (!canEdit()) {
        alert(t('noEditPermission'));
        return;
    }
    leagueRounds = [];
    saveData();
    renderRounds();
}

function renderRounds() {
    const container = document.getElementById('roundsContainer');
    container.innerHTML = "";

    if (!leagueRounds || leagueRounds.length === 0) {
        container.innerHTML = `<p>${t('noRoundsYet')}</p>`;
        return;
    }

    leagueRounds.forEach(r => {
        let matchesHtml = "";
        r.matches.forEach(m => {
            const sA = schools.find(s => s.id === m.teamAId);
            const sB = schools.find(s => s.id === m.teamBId);
            if (!sA || !sB) return;

            matchesHtml += `
                <div class="round-match-row">
                    <div class="round-team">
                        <img src="${sA.logo}" alt="">
                        <span title="${sA.name}">${sA.name}</span>
                    </div>
                    <span class="round-vs-pill">VS</span>
                    <div class="round-team away">
                        <span title="${sB.name}">${sB.name}</span>
                        <img src="${sB.logo}" alt="">
                    </div>
                </div>
            `;
        });

        if (matchesHtml) {
            container.innerHTML += `
                <div class="round-card">
                    <div class="round-card-header">
                        <span>${t('roundLabel')(r.round)}</span>
                        <span>⚽</span>
                    </div>
                    <div class="round-matches">${matchesHtml}</div>
                </div>
            `;
        }
    });
}

function showMatchResultAnimation(teamAId, teamBId, scoreA, scoreB) {
    const sA = schools.find(s => s.id === teamAId);
    const sB = schools.find(s => s.id === teamBId);
    if (!sA || !sB) return;

    const overlay = document.getElementById('celebrationOverlay');
    const icon = document.getElementById('celebrationIcon');
    const winnerTitle = document.getElementById('winnerTitle');
    const winnerLogo = document.getElementById('winnerLogo');
    const winnerName = document.getElementById('winnerName');
    const scoreBox = document.getElementById('celebrationScore');
    const loserText = document.getElementById('loserText');

    document.getElementById('confettiContainer').innerHTML = "";
    scoreBox.textContent = `${scoreA} - ${scoreB}`;

    if (scoreA === scoreB) {
        icon.textContent = "🤝";
        winnerTitle.textContent = t('drawTitle');
        winnerLogo.classList.add('hidden');
        winnerName.textContent = `${sA.name} & ${sB.name}`;
        loserText.textContent = t('drawSubtext');
    } else {
        const winner = scoreA > scoreB ? sA : sB;
        const loser = scoreA > scoreB ? sB : sA;

        icon.textContent = "🏆";
        winnerTitle.textContent = t('winnerTitle');
        winnerLogo.src = winner.logo;
        winnerLogo.classList.remove('hidden');
        winnerName.textContent = winner.name;
        loserText.textContent = t('hardLuckText')(loser.name);
        spawnConfetti('confettiContainer', 65);
    }

    overlay.classList.remove('hidden');
}

function closeCelebration() {
    document.getElementById('celebrationOverlay').classList.add('hidden');
}

document.getElementById('schoolForm').addEventListener('submit', function(e) {
    e.preventDefault();
    if (!canEdit()) {
        alert(t('noEditPermission'));
        return;
    }
    const name = document.getElementById('schoolName').value.trim();
    const stage = document.getElementById('schoolStage').value;
    const category = document.getElementById('schoolCategory').value;
    const playType = document.getElementById('schoolPlayType').value;

    if (!name) return;

    const newSchool = {
        id: Date.now(),
        name,
        stage,
        category,
        playType,
        logo: uploadedLogoBase64 || DEFAULT_LOGO,
        players: []
    };

    schools.push(newSchool);
    saveData();

    this.reset();
    uploadedLogoBase64 = "";
    document.getElementById('logoPreview').classList.add('hidden');
    renderAll();
});

function deleteSchool(schoolId, event) {
    if (event) event.stopPropagation();
    if (!canEdit()) {
        alert(t('noEditPermission'));
        return;
    }
    const school = schools.find(s => s.id === schoolId);
    if (!school) return;

    if (!confirm(t('confirmDeleteSchool')(school.name))) return;

    schools = schools.filter(s => s.id !== schoolId);
    matches = matches.filter(m => m.teamAId !== schoolId && m.teamBId !== schoolId);
    schedules = schedules.filter(sc => sc.teamAId !== schoolId && sc.teamBId !== schoolId);
    leagueRounds = leagueRounds.map(r => ({
        ...r,
        matches: r.matches.filter(m => m.teamAId !== schoolId && m.teamBId !== schoolId)
    })).filter(r => r.matches.length > 0);

    if (activeSchoolId === schoolId) closeModal();

    saveData();
    renderAll();
}

function deleteActiveSchool() {
    if (!canEdit()) {
        alert(t('noEditPermission'));
        return;
    }
    if (activeSchoolId) {
        deleteSchool(activeSchoolId);
    }
}

document.getElementById('scheduleForm').addEventListener('submit', function(e) {
    e.preventDefault();
    if (!canEdit()) {
        alert(t('noEditPermission'));
        return;
    }
    const teamAId = Number(document.getElementById('schedTeamA').value);
    const teamBId = Number(document.getElementById('schedTeamB').value);
    const date = document.getElementById('schedDate').value;
    const time = document.getElementById('schedTime').value;
    const venue = document.getElementById('schedVenue').value.trim();
    const type = document.getElementById('schedType').value;

    if (!teamAId || !teamBId || teamAId === teamBId) {
        alert(t('selectDiffSchools'));
        return;
    }

    schedules.push({
        id: Date.now(),
        teamAId,
        teamBId,
        date,
        time,
        venue,
        type,
        played: false,
        scoreA: null,
        scoreB: null
    });

    schedules.sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
    saveData();
    this.reset();
    renderAll();
});

function recordScheduledMatch(schedId) {
    if (!canEdit()) {
        alert(t('noEditPermission'));
        return;
    }
    const sched = schedules.find(s => s.id === schedId);
    if (!sched) return;

    const sA = schools.find(s => s.id === sched.teamAId);
    const sB = schools.find(s => s.id === sched.teamBId);
    if (!sA || !sB) return;

    const scoreAInput = prompt(t('enterGoalsFor')(sA.name), "0");
    if (scoreAInput === null) return;
    const scoreBInput = prompt(t('enterGoalsFor')(sB.name), "0");
    if (scoreBInput === null) return;

    const scoreA = Math.max(0, Number(scoreAInput) || 0);
    const scoreB = Math.max(0, Number(scoreBInput) || 0);

    sched.played = true;
    sched.scoreA = scoreA;
    sched.scoreB = scoreB;

    matches.unshift({
        id: Date.now(),
        teamAId: sched.teamAId,
        teamBId: sched.teamBId,
        scoreA,
        scoreB,
        type: sched.type
    });

    saveData();
    renderAll();
    showMatchResultAnimation(sched.teamAId, sched.teamBId, scoreA, scoreB);
}

function deleteSchedule(schedId) {
    if (!canEdit()) {
        alert(t('noEditPermission'));
        return;
    }
    schedules = schedules.filter(s => s.id !== schedId);
    saveData();
    renderAll();
}

document.getElementById('matchForm').addEventListener('submit', function(e) {
    e.preventDefault();
    if (!canEdit()) {
        alert(t('noEditPermission'));
        return;
    }
    const teamAId = Number(document.getElementById('teamA').value);
    const teamBId = Number(document.getElementById('teamB').value);
    const scoreA = Number(document.getElementById('scoreA').value);
    const scoreB = Number(document.getElementById('scoreB').value);
    const type = document.getElementById('matchType').value;

    if (!teamAId || !teamBId || teamAId === teamBId) {
        alert(t('selectDiffSchools'));
        return;
    }

    matches.unshift({
        id: Date.now(),
        teamAId,
        teamBId,
        scoreA,
        scoreB,
        type
    });

    saveData();
    this.reset();
    renderAll();
    showMatchResultAnimation(teamAId, teamBId, scoreA, scoreB);
});

function openModal(schoolId) {
    activeSchoolId = schoolId;
    const school = schools.find(s => s.id === schoolId);
    if (!school) return;

    document.getElementById('modalSchoolName').textContent = school.name;
    document.getElementById('modalSchoolLogo').src = school.logo;
    document.getElementById('modalSchoolBadge').textContent = `${tVal(school.stage)} | ${tVal(school.category)} | ${tVal(school.playType)}`;
    document.getElementById('playerStage').value = school.stage;
    document.getElementById('playerCategory').value = school.category;
    document.getElementById('playerMatchType').value = school.playType;

    renderModalPlayers();
    document.getElementById('playersModal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('playersModal').classList.add('hidden');
    activeSchoolId = null;
}

document.getElementById('playerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    if (!canEdit()) {
        alert(t('noEditPermission'));
        return;
    }
    if (!activeSchoolId) return;

    const school = schools.find(s => s.id === activeSchoolId);
    const name = document.getElementById('playerName').value.trim();
    const stage = document.getElementById('playerStage').value;
    const grade = document.getElementById('playerGrade').value.trim();
    const category = document.getElementById('playerCategory').value;
    const matchType = document.getElementById('playerMatchType').value;
    const goals = Number(document.getElementById('playerGoals').value) || 0;
    const assists = Number(document.getElementById('playerAssists').value) || 0;

    school.players.push({
        id: Date.now(),
        name,
        stage,
        grade,
        category,
        matchType,
        goals,
        assists
    });

    saveData();
    this.reset();
    document.getElementById('playerStage').value = school.stage;
    document.getElementById('playerCategory').value = school.category;
    document.getElementById('playerMatchType').value = school.playType;
    renderModalPlayers();
    renderAll();
});

function updatePlayerStat(schoolId, playerId, field, delta) {
    if (!canEdit()) {
        alert(t('noEditPermission'));
        return;
    }
    const school = schools.find(s => s.id === schoolId);
    if (!school) return;
    const player = school.players.find(p => p.id === playerId);
    if (!player) return;

    player[field] = Math.max(0, (player[field] || 0) + delta);
    saveData();
    if (activeSchoolId === schoolId) renderModalPlayers();
    renderAll();
}

function deletePlayer(schoolId, playerId) {
    if (!canEdit()) {
        alert(t('noEditPermission'));
        return;
    }
    const school = schools.find(s => s.id === schoolId);
    if (!school) return;
    school.players = school.players.filter(p => p.id !== playerId);
    saveData();
    renderModalPlayers();
    renderAll();
}

function renderModalPlayers() {
    const school = schools.find(s => s.id === activeSchoolId);
    const tbody = document.getElementById('modalPlayersList');
    tbody.innerHTML = "";
    const editable = canEdit();

    if (!school || school.players.length === 0) {
        tbody.innerHTML = `<tr><td colspan="${editable ? 8 : 7}">${t('noModalPlayers')}</td></tr>`;
        return;
    }

    school.players.forEach(p => {
        const actionsCell = editable ? `
            <td>
                <button class="btn-sm btn-plus" onclick="updatePlayerStat(${school.id}, ${p.id}, 'goals', 1)">${t('plusGoal')}</button>
                <button class="btn-sm btn-assist" onclick="updatePlayerStat(${school.id}, ${p.id}, 'assists', 1)">${t('plusAssist')}</button>
                <button class="btn-sm btn-del" onclick="deletePlayer(${school.id}, ${p.id})">${t('delete')}</button>
            </td>
        ` : ``;

        tbody.innerHTML += `
            <tr>
                <td><strong>${p.name}</strong></td>
                <td><span class="badge stage">${tVal(p.stage)}</span></td>
                <td>${p.grade}</td>
                <td><span class="badge">${tVal(p.category || school.category)}</span></td>
                <td><span class="badge ${p.matchType === 'ودي' ? 'friendly' : 'league'}">${tVal(p.matchType || 'دوري')}</span></td>
                <td><strong>${p.goals || 0}</strong></td>
                <td><strong>${p.assists || 0}</strong></td>
                ${actionsCell}
            </tr>
        `;
    });
}

function getFilteredSchools() {
    const stageFilter = document.getElementById('stageFilter').value;
    const catFilter = document.getElementById('categoryFilter').value;
    const playFilter = document.getElementById('playTypeFilter').value;

    return schools.filter(s => {
        const matchStage = stageFilter === "الكل" || s.stage === stageFilter;
        const matchCat = catFilter === "الكل" || s.category === catFilter;
        const matchPlay = playFilter === "الكل" || s.playType === playFilter;
        return matchStage && matchCat && matchPlay;
    });
}

function renderSchools() {
    const grid = document.getElementById('schoolsGrid');
    const filtered = getFilteredSchools();
    const editable = canEdit();
    grid.innerHTML = "";

    if (filtered.length === 0) {
        grid.innerHTML = `<p>${t('noSchools')}</p>`;
        return;
    }

    filtered.forEach(school => {
        const deleteBtnHtml = editable
            ? `<button class="delete-school-btn" title="${t('deleteSchoolTitle')}" onclick="deleteSchool(${school.id}, event)">&times;</button>`
            : ``;
        const hintText = editable ? t('clickToManage') : t('clickToView');

        grid.innerHTML += `
            <div class="school-card" onclick="openModal(${school.id})">
                ${deleteBtnHtml}
                <img src="${school.logo}" alt="${school.name}">
                <h4>${school.name}</h4>
                <div class="badges">
                    <span class="badge stage">${tVal(school.stage)}</span>
                    <span class="badge">${tVal(school.category)}</span>
                    <span class="badge ${school.playType === 'ودي' ? 'friendly' : 'league'}">${tVal(school.playType)}</span>
                </div>
                <div class="school-players-count">${t('playersCount')} ${school.players.length} | ${hintText}</div>
            </div>
        `;
    });
}

function renderSelectOptions() {
    const selects = [
        document.getElementById('teamA'),
        document.getElementById('teamB'),
        document.getElementById('schedTeamA'),
        document.getElementById('schedTeamB')
    ];

    if (schools.length === 0) {
        selects.forEach(sel => sel.innerHTML = `<option value="">${t('addSchoolFirst')}</option>`);
        return;
    }

    const options = schools.map(s => `<option value="${s.id}">${s.name} (${tVal(s.stage)} - ${tVal(s.category)})</option>`).join('');
    selects.forEach((sel, idx) => {
        sel.innerHTML = options;
        if (schools.length > 1 && idx % 2 === 1) sel.selectedIndex = 1;
    });
}

function renderSchedule() {
    const tbody = document.getElementById('scheduleBody');
    const stageFilter = document.getElementById('stageFilter').value;
    const catFilter = document.getElementById('categoryFilter').value;
    const playFilter = document.getElementById('playTypeFilter').value;
    const editable = canEdit();

    tbody.innerHTML = "";

    const filteredScheds = schedules.filter(sc => {
        const sA = schools.find(s => s.id === sc.teamAId);
        const sB = schools.find(s => s.id === sc.teamBId);
        if (!sA || !sB) return false;

        const matchStage = stageFilter === "الكل" || sA.stage === stageFilter || sB.stage === stageFilter;
        const matchCat = catFilter === "الكل" || sA.category === catFilter || sB.category === catFilter;
        const matchPlay = playFilter === "الكل" || sc.type === playFilter;
        return matchStage && matchCat && matchPlay;
    });

    if (filteredScheds.length === 0) {
        tbody.innerHTML = `<tr><td colspan="${editable ? 7 : 6}">${t('noSchedules')}</td></tr>`;
        return;
    }

    filteredScheds.forEach(sc => {
        const sA = schools.find(s => s.id === sc.teamAId);
        const sB = schools.find(s => s.id === sc.teamBId);
        const statusHtml = sc.played
            ? `<span class="match-score">${sc.scoreA} - ${sc.scoreB}</span>`
            : `<span class="badge upcoming">${t('upcoming')}</span>`;

        const actionBtn = sc.played
            ? ``
            : `<button class="btn-sm btn-plus" onclick="recordScheduledMatch(${sc.id})">${t('recordResult')}</button>`;

        const actionsCell = editable ? `
            <td>
                ${actionBtn}
                <button class="btn-sm btn-del" onclick="deleteSchedule(${sc.id})">${t('delete')}</button>
            </td>
        ` : ``;

        tbody.innerHTML += `
            <tr>
                <td><strong>${sc.date}</strong><br><small>${sc.time}</small></td>
                <td><strong>${sA.name}</strong> 🆚 <strong>${sB.name}</strong></td>
                <td><span class="badge stage">${tVal(sA.stage)}</span> <span class="badge">${tVal(sA.category)}</span></td>
                <td><span class="badge ${sc.type === 'ودي' ? 'friendly' : 'league'}">${tVal(sc.type)}</span></td>
                <td>${sc.venue}</td>
                <td>${statusHtml}</td>
                ${actionsCell}
            </tr>
        `;
    });
}

function renderMatches() {
    const list = document.getElementById('matchesList');
    const playFilter = document.getElementById('playTypeFilter').value;
    list.innerHTML = "";

    const filteredMatches = matches.filter(m => playFilter === "الكل" || m.type === playFilter);

    if (filteredMatches.length === 0) {
        list.innerHTML = `<p>${t('noMatches')}</p>`;
        return;
    }

    filteredMatches.forEach(m => {
        const sA = schools.find(s => s.id === m.teamAId);
        const sB = schools.find(s => s.id === m.teamBId);
        if (!sA || !sB) return;

        list.innerHTML += `
            <div class="match-item">
                <span>${sA.name}</span>
                <span class="match-score">${m.scoreA} - ${m.scoreB}</span>
                <span>${sB.name}</span>
                <span class="badge ${m.type === 'ودي' ? 'friendly' : 'league'}">${tVal(m.type)}</span>
            </div>
        `;
    });
}

function renderStandings() {
    const filtered = getFilteredSchools();
    const tbody = document.getElementById('standingsBody');
    tbody.innerHTML = "";

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="11">${t('noStandings')}</td></tr>`;
        return;
    }

    const stats = filtered.map(school => ({
        ...school,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        gf: 0,
        ga: 0,
        points: 0
    }));

    matches.forEach(m => {
        if (m.type === "ودي") return;
        const teamA = stats.find(s => s.id === m.teamAId);
        const teamB = stats.find(s => s.id === m.teamBId);
        if (!teamA || !teamB) return;

        teamA.played++;
        teamB.played++;
        teamA.gf += m.scoreA;
        teamA.ga += m.scoreB;
        teamB.gf += m.scoreB;
        teamB.ga += m.scoreA;

        if (m.scoreA > m.scoreB) {
            teamA.won++;
            teamA.points += 3;
            teamB.lost++;
        } else if (m.scoreB > m.scoreA) {
            teamB.won++;
            teamB.points += 3;
            teamA.lost++;
        } else {
            teamA.drawn++;
            teamB.drawn++;
            teamA.points += 1;
            teamB.points += 1;
        }
    });

    stats.sort((a, b) => b.points - a.points || (b.gf - b.ga) - (a.gf - a.ga) || b.gf - a.gf);

    stats.forEach((s, index) => {
        tbody.innerHTML += `
            <tr>
                <td><strong>${index + 1}</strong></td>
                <td>
                    <div class="team-cell">
                        <img src="${s.logo}" alt="">
                        <span>${s.name}</span>
                    </div>
                </td>
                <td><span class="badge stage">${tVal(s.stage)}</span></td>
                <td><span class="badge">${tVal(s.category)}</span></td>
                <td>${s.played}</td>
                <td>${s.won}</td>
                <td>${s.drawn}</td>
                <td>${s.lost}</td>
                <td>${s.gf}</td>
                <td>${s.ga}</td>
                <td class="points-cell">${s.points}</td>
            </tr>
        `;
    });
}

function renderScorers() {
    const stageFilter = document.getElementById('stageFilter').value;
    const catFilter = document.getElementById('categoryFilter').value;
    const playFilter = document.getElementById('playTypeFilter').value;
    const editable = canEdit();
    let allPlayers = [];

    schools.forEach(school => {
        school.players.forEach(player => {
            const pStage = player.stage || school.stage;
            const pCat = player.category || school.category;
            const pMatchType = player.matchType || school.playType;

            const matchStage = stageFilter === "الكل" || pStage === stageFilter;
            const matchCat = catFilter === "الكل" || pCat === catFilter;
            const matchPlay = playFilter === "الكل" || pMatchType === playFilter;

            if (matchStage && matchCat && matchPlay) {
                allPlayers.push({
                    ...player,
                    stage: pStage,
                    category: pCat,
                    matchType: pMatchType,
                    goals: player.goals || 0,
                    assists: player.assists || 0,
                    schoolId: school.id,
                    schoolName: school.name
                });
            }
        });
    });

    allPlayers.sort((a, b) => b.goals - a.goals || b.assists - a.assists);

    const tbody = document.getElementById('scorersBody');
    tbody.innerHTML = "";

    if (allPlayers.length === 0) {
        tbody.innerHTML = `<tr><td colspan="${editable ? 10 : 9}">${t('noScorers')}</td></tr>`;
        return;
    }

    allPlayers.forEach((p, index) => {
        const editCell = editable ? `
            <td>
                <button class="btn-sm btn-plus" onclick="updatePlayerStat(${p.schoolId}, ${p.id}, 'goals', 1)">${t('plusGoal')}</button>
                <button class="btn-sm btn-assist" onclick="updatePlayerStat(${p.schoolId}, ${p.id}, 'assists', 1)">${t('plusAssist')}</button>
            </td>
        ` : ``;

        tbody.innerHTML += `
            <tr>
                <td><strong>${index + 1}</strong></td>
                <td><strong>${p.name}</strong></td>
                <td><span class="badge stage">${tVal(p.stage)}</span></td>
                <td>${p.grade}</td>
                <td>${p.schoolName}</td>
                <td><span class="badge">${tVal(p.category)}</span></td>
                <td><span class="badge ${p.matchType === 'ودي' ? 'friendly' : 'league'}">${tVal(p.matchType)}</span></td>
                <td class="points-cell">${p.goals} ⚽</td>
                <td class="assist-cell">${p.assists} 🎯</td>
                ${editCell}
            </tr>
        `;
    });
}

function renderAll() {
    renderSchools();
    renderRounds();
    renderSelectOptions();
    renderSchedule();
    renderMatches();
    renderStandings();
    renderScorers();
}

applyLanguage();
checkAuth();