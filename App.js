// ==========================================================================
// STUDENT SCHEDULE APPLICATION (React 18 Standalone)
// Specialization: Judicial Activity (2nd subgroup)
// ==========================================================================

const { useState, useEffect, useMemo } = React;

// --- Bell Schedule Constants ---
const BELL_SCHEDULE = [
  { num: 1, start: "08:00", end: "09:30", startMin: 8 * 60, endMin: 9 * 60 + 30 },
  { num: 2, start: "09:40", end: "11:10", startMin: 9 * 60 + 40, endMin: 11 * 60 + 10 },
  { num: 3, start: "11:25", end: "12:55", startMin: 11 * 60 + 25, endMin: 12 * 60 + 55 },
  { num: 4, start: "13:05", end: "14:35", startMin: 13 * 60 + 5, endMin: 14 * 60 + 35 },
  { num: 5, start: "14:45", end: "16:15", startMin: 14 * 60 + 45, endMin: 16 * 60 + 15 },
  { num: 6, start: "16:30", end: "18:00", startMin: 16 * 60 + 30, endMin: 18 * 60 },
  { num: 7, start: "18:10", end: "19:40", startMin: 18 * 60 + 10, endMin: 19 * 60 + 40 },
  { num: 8, start: "19:50", end: "21:20", startMin: 19 * 60 + 50, endMin: 21 * 60 + 20 }
];

// Reference start: Monday, August 31, 2026
const BASE_SEMESTER_START = new Date(2026, 7, 31, 0, 0, 0);

// --- Days of the Week Meta ---
const DAYS_DATA = [
  { id: 1, name: "Понедельник", short: "ПН" },
  { id: 2, name: "Вторник", short: "ВТ" },
  { id: 3, name: "Среда", short: "СР" },
  { id: 4, name: "Четверг", short: "ЧТ" },
  { id: 5, name: "Пятница", short: "ПТ" },
  { id: 6, name: "Суббота", short: "СБ" }
];

// --- Schedule Database (Judicial Activity Group) ---
const SCHEDULE_DATABASE = {
  // ПОНЕДЕЛЬНИК
  1: [
    {
      pairNum: 1,
      subject: "Методы исследовательской деятельности",
      type: "lecture",
      typeLabel: "Лекция",
      teacher: "Доц. А.В. Калякина",
      auditorium: "Ауд. 208 К.12"
    },
    {
      pairNum: 2,
      subject: "Методы исследовательской деятельности",
      type: "practice",
      typeLabel: "Практика",
      teacher: "Доц. А.В. Калякина",
      auditorium: "Ауд. 208 К.12"
    },
    {
      pairNum: 3,
      subject: "Муниципальное право",
      type: "lecture",
      typeLabel: "Лекция",
      teacher: "Ст.пр. М.П. Цап",
      auditorium: null
    },
    {
      pairNum: 4,
      subject: "Муниципальное право",
      type: "practice",
      typeLabel: "Практика",
      teacher: "Ст.пр. М.П. Цап",
      auditorium: null
    }
  ],

  // ВТОРНИК
  2: [
    {
      pairNum: 1,
      subject: "Семейное право",
      type: "lecture",
      typeLabel: "Лекция",
      teacher: "Ст. пр. М.А. Лободюк",
      auditorium: null
    },
    {
      pairNum: 2,
      subject: "Уголовное право",
      type: "lecture",
      typeLabel: "Лекция",
      teacher: "Доц. К.Н. Гудима",
      auditorium: null
    },
    {
      pairNum: 3,
      subject: "Уголовное право",
      type: "practice",
      typeLabel: "Практика",
      teacher: "Доц. К.Н. Гудима",
      auditorium: null
    },
    {
      pairNum: 4,
      subject: "Семейное право",
      type: "practice",
      typeLabel: "Практика",
      teacher: "Ст. пр. М.А. Лободюк",
      auditorium: null
    }
  ],

  // СРЕДА
  3: [
    {
      pairNum: 1,
      subject: "Уголовный процесс",
      type: "lecture",
      typeLabel: "Лекция",
      teacher: "Доц. А.Ф. Дели",
      auditorium: "Ауд. 102 К.12"
    },
    {
      pairNum: 2,
      subject: "Уголовный процесс",
      type: "lecture",
      typeLabel: "Лекция",
      teacher: "Доц. А.Ф. Дели",
      auditorium: "Ауд. 102 К.12"
    }
  ],

  // ЧЕТВЕРГ
  4: [
    {
      pairNum: 1,
      subject: "Гражданское право",
      type: "lecture",
      typeLabel: "Лекция",
      teacher: "Доц. Я.Ф. Федорчуков",
      auditorium: "Ауд. 107 К.12"
    },
    {
      pairNum: 2,
      subject: "Гражданское право",
      type: "lecture",
      typeLabel: "Лекция",
      teacher: "Доц. Я.Ф. Федорчуков",
      auditorium: "Ауд. 107 К.12"
    },
    {
      pairNum: 3,
      subject: "Жилищное право",
      type: "lecture",
      typeLabel: "Лекция",
      teacher: "Доц. Н.А. Шеленга",
      auditorium: "Ауд. 104 К.12"
    },
    {
      pairNum: 4,
      subject: "Жилищное право",
      type: "practice",
      typeLabel: "Практика",
      teacher: "Доц. Н.А. Шеленга",
      auditorium: "Ауд. 104 К.12"
    }
  ],

  // ПЯТНИЦА
  5: [
    {
      pairNum: 1,
      subject: "Криминология",
      type: "lecture",
      typeLabel: "Лекция",
      teacher: "Ст. пр. О.А. Салкуцан",
      auditorium: "Ауд. 211 К.12"
    },
    {
      pairNum: 2,
      subject: "Криминология",
      type: "practice",
      typeLabel: "Практика",
      teacher: "Ст. пр. О.А. Салкуцан",
      auditorium: "Ауд. 211 К.12"
    },
    {
      pairNum: 3,
      subject: "Избирательное право",
      type: "mix",
      typeLabel: "Л / ПР",
      teacher: "Доц. Г.С. Брусалинская",
      auditorium: "Ауд. 102 К.12"
    }
  ],

  // СУББОТА
  6: [
    {
      pairNum: 1,
      subject: "Гражданский процесс",
      type: "lecture",
      typeLabel: "Лекция",
      teacher: "Доц. Е.З. Евстигнеева",
      auditorium: "Ауд. 211 К.12"
    },
    {
      pairNum: 2,
      subject: "Гражданский процесс",
      type: "practice",
      typeLabel: "Практика",
      teacher: "Доц. Е.З. Евстигнеева",
      auditorium: "Ауд. 211 К.12"
    }
  ]
};

// --- SVG Icons Components ---
const IconBook = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
);

const IconBell = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const IconPalette = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/>
    <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/>
    <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/>
    <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/>
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
  </svg>
);

const IconUser = () => (
  <svg className="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const IconMapPin = () => (
  <svg className="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const IconClock = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const IconClose = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

// --- Week Calculation Helper (Week number only) ---
function calculateWeekNumber(nowDate = new Date()) {
  const current = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate());
  const dayOfWeek = (current.getDay() + 6) % 7; // 0: Mon, 1: Tue ... 6: Sun
  
  // Find Monday of the current week
  const monday = new Date(current);
  monday.setDate(current.getDate() - dayOfWeek);

  const diffTime = monday.getTime() - BASE_SEMESTER_START.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  const weekNumber = Math.floor(diffDays / 7) + 1;

  return weekNumber > 0 ? weekNumber : 1;
}

// --- Main Application Component ---
function App() {
  // Themes: 'dark' | 'light' | 'pikmi'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('schedule_theme_v2') || 'dark';
  });

  const [showThemePicker, setShowThemePicker] = useState(false);
  const [showBellsModal, setShowBellsModal] = useState(false);

  // Real-time clock state
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  // Apply Theme attribute to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('schedule_theme_v2', theme);
  }, [theme]);

  // Real-time timer tick every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Current day of week (1: Mon, ... 6: Sat, 0: Sun)
  const currentDayOfWeek = currentDateTime.getDay();
  const currentDayId = currentDayOfWeek === 0 ? 1 : currentDayOfWeek;

  // Selected Day state in ribbon
  const [selectedDayId, setSelectedDayId] = useState(currentDayId);

  // Week number (e.g. 4)
  const weekNumber = useMemo(() => {
    return calculateWeekNumber(currentDateTime);
  }, [currentDateTime]);

  // Current minutes of the day (0 - 1439)
  const currentMinutes = currentDateTime.getHours() * 60 + currentDateTime.getMinutes();

  // Find currently active pair or current interval
  const liveStatus = useMemo(() => {
    if (currentDayOfWeek === 0 || currentDayOfWeek > 6) {
      return {
        type: 'idle',
        label: '🏖 Выходной день',
        sub: 'Занятий нет',
        activePairNum: null,
        remainingMinutes: null
      };
    }

    // Check if right now within any bell interval
    for (let bell of BELL_SCHEDULE) {
      if (currentMinutes >= bell.startMin && currentMinutes <= bell.endMin) {
        const remaining = bell.endMin - currentMinutes;
        const progress = ((currentMinutes - bell.startMin) / (bell.endMin - bell.startMin)) * 100;
        return {
          type: 'lesson',
          label: `🟢 Идет ${bell.num} пара`,
          sub: `до звонка ${remaining} мин`,
          activePairNum: bell.num,
          remainingMinutes: remaining,
          progress: progress
        };
      }
    }

    // Check if between pairs (break)
    for (let i = 0; i < BELL_SCHEDULE.length - 1; i++) {
      const prev = BELL_SCHEDULE[i];
      const next = BELL_SCHEDULE[i + 1];
      if (currentMinutes > prev.endMin && currentMinutes < next.startMin) {
        const untilNext = next.startMin - currentMinutes;
        return {
          type: 'break',
          label: '☕ Перемена',
          sub: `до ${next.num} пары ${untilNext} мин (${next.start})`,
          activePairNum: null,
          remainingMinutes: null
        };
      }
    }

    if (currentMinutes < BELL_SCHEDULE[0].startMin) {
      const untilFirst = BELL_SCHEDULE[0].startMin - currentMinutes;
      return {
        type: 'break',
        label: '🌅 До начала пар',
        sub: `${untilFirst} мин (начало в 08:00)`,
        activePairNum: null,
        remainingMinutes: null
      };
    }

    return {
      type: 'idle',
      label: '✨ Учебный день завершен',
      sub: 'Все пары окончены',
      activePairNum: null,
      remainingMinutes: null
    };
  }, [currentMinutes, currentDayOfWeek]);

  // Active day pairs for Judicial Activity Group
  const activeDayPairs = SCHEDULE_DATABASE[selectedDayId] || [];
  const selectedDayMeta = DAYS_DATA.find(d => d.id === selectedDayId);
  const isSelectedDayToday = selectedDayId === currentDayOfWeek;

  // Format Clock: HH:MM:SS
  const formattedTime = currentDateTime.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return (
    <>
      {/* --- Pikmi Theme Floating Sakura Petals --- */}
      <div className="pikmi-decor-container" aria-hidden="true">
        <div className="petal">🌸</div>
        <div className="petal">🌸</div>
        <div className="petal">🌷</div>
        <div className="petal">🌸</div>
        <div className="petal">✨</div>
        <div className="petal">🌸</div>
      </div>

      <div className="app-viewport">
        {/* --- Sticky Glass Header --- */}
        <header className="header-glass">
          <div className="header-top">
            <div className="app-brand">
              <div className="brand-icon-wrapper">
                {theme === 'pikmi' ? '🌸' : <IconBook />}
              </div>
              <div className="brand-text">
                <h1>Расписание</h1>
              </div>
            </div>

            <div className="header-actions">
              {/* Bell Schedule button */}
              <button 
                className="icon-btn" 
                onClick={() => setShowBellsModal(true)} 
                title="Расписание звонков"
                aria-label="Расписание звонков"
              >
                <IconBell />
              </button>

              {/* Theme switcher toggle button */}
              <button 
                className="icon-btn" 
                onClick={() => setShowThemePicker(prev => !prev)} 
                title="Сменить тему"
                aria-label="Сменить тему"
              >
                {theme === 'pikmi' ? '🌸' : <IconPalette />}
              </button>
            </div>
          </div>

          {/* Week number and live clock in Header */}
          <div className="header-info-bar">
            <div className="week-display">
              <span className="week-indicator-dot" />
              <span>{weekNumber} неделя</span>
            </div>
            <div className="clock-live">
              <IconClock />
              <span>{formattedTime}</span>
            </div>
          </div>
        </header>

        {/* --- 3-Theme Selector Bar (Dark, Light, Pikmi 🌸) --- */}
        {showThemePicker && (
          <div className="theme-picker-segmented">
            <button 
              className={`theme-tab-btn ${theme === 'dark' ? 'active' : ''}`}
              onClick={() => { setTheme('dark'); setShowThemePicker(false); }}
            >
              🌙 Тёмная
            </button>
            <button 
              className={`theme-tab-btn ${theme === 'light' ? 'active' : ''}`}
              onClick={() => { setTheme('light'); setShowThemePicker(false); }}
            >
              ☀️ Светлая
            </button>
            <button 
              className={`theme-tab-btn ${theme === 'pikmi' ? 'active' : ''}`}
              onClick={() => { setTheme('pikmi'); setShowThemePicker(false); }}
            >
              🌸 Pikmi
            </button>
          </div>
        )}

        {/* --- Horizontal Days Ribbon (Пн-Сб) --- */}
        <div className="days-ribbon-container">
          <div className="days-ribbon-scroll">
            {DAYS_DATA.map(day => {
              const isToday = day.id === currentDayOfWeek;
              const isSelected = day.id === selectedDayId;
              const pairsCount = (SCHEDULE_DATABASE[day.id] || []).length;

              return (
                <button
                  key={day.id}
                  className={`day-chip ${isSelected ? 'active' : ''} ${isToday ? 'today' : ''}`}
                  onClick={() => setSelectedDayId(day.id)}
                >
                  <span className="day-abbr">{day.short}</span>
                  <span className="day-count">{pairsCount} {pairsCount === 1 ? 'пара' : pairsCount < 5 ? 'пары' : 'пар'}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* --- Status Strip between Ribbon and Cards --- */}
        <div className="status-pill-strip">
          <span className="status-pill-text">{liveStatus.label}</span>
          <span className="status-pill-sub">{liveStatus.sub}</span>
        </div>

        {/* --- Schedule Content Area --- */}
        <main className="schedule-container">
          <div className="day-header-meta">
            <div className="day-title-row">
              <h2>{selectedDayMeta.name}</h2>
              {isSelectedDayToday && <span className="day-today-tag">Сегодня</span>}
            </div>
            <span className="day-stats-text">
              {activeDayPairs.length} {activeDayPairs.length === 1 ? 'занятие' : activeDayPairs.length < 5 ? 'занятия' : 'занятий'}
            </span>
          </div>

          {/* Schedule Cards */}
          {activeDayPairs.length > 0 ? (
            activeDayPairs.map((item, idx) => {
              const bell = BELL_SCHEDULE.find(b => b.num === item.pairNum) || { start: '--:--', end: '--:--' };
              const isPairActiveNow = isSelectedDayToday && liveStatus.activePairNum === item.pairNum;

              return (
                <div 
                  key={`${item.pairNum}-${idx}`} 
                  className={`pair-card ${isPairActiveNow ? 'is-active' : ''}`}
                >
                  <div className="pair-card-header">
                    <div className="pair-time-block">
                      <span className={`pair-badge-num ${isPairActiveNow ? 'active' : ''}`}>
                        {item.pairNum} пара
                      </span>
                      <span className="pair-time-range">
                        {bell.start} – {bell.end}
                      </span>
                    </div>

                    {/* Highly aesthetic glowing badge when pair is running now */}
                    {isPairActiveNow && (
                      <div className="pulsing-live-badge">
                        <span className="pulsing-dot" />
                        <span>Идет сейчас • {liveStatus.remainingMinutes} мин</span>
                      </div>
                    )}
                  </div>

                  <div className="pair-card-body">
                    <span className={`type-chip ${item.type}`}>
                      {item.typeLabel}
                    </span>

                    <h3 className="pair-subject-title">{item.subject}</h3>

                    <div className="pair-meta-info">
                      {item.teacher && (
                        <div className="meta-row">
                          <IconUser />
                          <span className="meta-text">{item.teacher}</span>
                        </div>
                      )}
                      {item.auditorium && (
                        <div className="meta-row">
                          <IconMapPin />
                          <span className="meta-text auditorium">{item.auditorium}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Real-time Smooth Progress Bar for Active Pair */}
                  {isPairActiveNow && liveStatus.progress !== undefined && (
                    <div className="active-pair-progress">
                      <div 
                        className="active-pair-progress-bar" 
                        style={{ width: `${Math.min(Math.max(liveStatus.progress, 2), 100)}%` }} 
                      />
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="empty-schedule-card">
              <div className="empty-icon-wrap">{theme === 'pikmi' ? '🌸' : '☕'}</div>
              <div className="empty-title">Пар нет</div>
              <div className="empty-subtitle">
                В этот день занятий не запланировано. Свободное время для отдыха!
              </div>
            </div>
          )}
        </main>

        {/* --- Bell Schedule Modal --- */}
        {showBellsModal && (
          <div className="modal-overlay" onClick={() => setShowBellsModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-drag-handle" />
              <div className="modal-header">
                <h3>Расписание звонков</h3>
                <button 
                  className="close-btn" 
                  onClick={() => setShowBellsModal(false)}
                  aria-label="Закрыть"
                >
                  <IconClose />
                </button>
              </div>

              <div className="bells-table">
                {BELL_SCHEDULE.map(bell => {
                  const isCurrent = liveStatus.activePairNum === bell.num && selectedDayId === currentDayOfWeek;
                  return (
                    <div key={bell.num} className={`bells-row ${isCurrent ? 'current-pair' : ''}`}>
                      <span className="bells-col-num">
                        <span>{bell.num} пара</span>
                        {isCurrent && <span className="pulsing-dot" />}
                      </span>
                      <span className="bells-col-time">{bell.start} – {bell.end}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// Render root with React 18 createRoot
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
root.render(<App />);
