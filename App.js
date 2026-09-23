// ==========================================================================
// STUDENT SCHEDULE APPLICATION (React 18 Standalone)
// Specialization: Judicial Activity | iOS Mobile-First UI
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

// --- Days Meta ---
const DAYS_DATA = [
  { id: 1, name: "Понедельник", short: "ПН", pairsCount: 4 },
  { id: 2, name: "Вторник", short: "ВТ", pairsCount: 4 },
  { id: 3, name: "Среда", short: "СР", pairsCount: 4 },
  { id: 4, name: "Четверг", short: "ЧТ", pairsCount: 4 },
  { id: 5, name: "Пятница", short: "ПТ", pairsCount: 3 },
  { id: 6, name: "Суббота", short: "СБ", pairsCount: 2 }
];

// --- Schedule Database (Judicial Activity Group) ---
const SCHEDULE_DATABASE = {
  // ПОНЕДЕЛЬНИК (4 пары)
  1: [
    {
      pairNum: 1,
      subject: "Методы исследовательской деятельности",
      type: "lecture",
      typeLabel: "Лекция",
      teacher: "доц. А.В. Калякина",
      auditorium: "ауд. 208, К.12"
    },
    {
      pairNum: 2,
      subject: "Методы исследовательской деятельности",
      type: "practice",
      typeLabel: "Практика",
      teacher: "доц. А.В. Калякина",
      auditorium: "ауд. 208, К.12"
    },
    {
      pairNum: 3,
      subject: "Муниципальное право",
      type: "lecture",
      typeLabel: "Лекция",
      teacher: "ст.пр. М.П. Цап",
      auditorium: "ауд. 211, К.12"
    },
    {
      pairNum: 4,
      subject: "Муниципальное право",
      type: "practice",
      typeLabel: "Практика",
      teacher: "ст.пр. М.П. Цап",
      auditorium: "ауд. 211, К.12"
    }
  ],

  // ВТОРНИК (4 пары)
  2: [
    {
      pairNum: 1,
      subject: "Семейное право",
      type: "lecture",
      typeLabel: "Лекция",
      teacher: "ст.пр. М.А. Лободюк",
      auditorium: "ауд. 209, К.12"
    },
    {
      pairNum: 2,
      subject: "Уголовное право",
      type: "lecture",
      typeLabel: "Лекция",
      teacher: "доц. К.Н. Гудима",
      auditorium: "ауд. 209, К.12"
    },
    {
      pairNum: 3,
      subject: "Уголовное право",
      type: "practice",
      typeLabel: "Практика",
      teacher: "доц. К.Н. Гудима",
      auditorium: "ауд. 104, К.12"
    },
    {
      pairNum: 4,
      subject: "Семейное право",
      type: "practice",
      typeLabel: "Практика",
      teacher: "ст.пр. М.А. Лободюк",
      auditorium: "ауд. 104, К.12"
    }
  ],

  // СРЕДА (4 пары)
  3: [
    {
      pairNum: 1,
      subject: "Уголовный процесс",
      type: "lecture",
      typeLabel: "Лекция",
      teacher: "доц. А.Ф. Дели",
      auditorium: "ауд. 102, К.12"
    },
    {
      pairNum: 2,
      subject: "Уголовный процесс",
      type: "lecture",
      typeLabel: "Лекция",
      teacher: "доц. А.Ф. Дели",
      auditorium: "ауд. 102, К.12"
    },
    {
      pairNum: 3,
      subject: "Трудовое право",
      type: "lecture",
      typeLabel: "Лекция",
      teacher: "доц. Н.А. Шеленга",
      auditorium: "ауд. 107, К.12"
    },
    {
      pairNum: 4,
      subject: "Трудовое право",
      type: "practice",
      typeLabel: "Практика",
      teacher: "доц. Н.А. Шеленга",
      auditorium: "ауд. 107, К.12"
    }
  ],

  // ЧЕТВЕРГ (4 пары)
  4: [
    {
      pairNum: 1,
      subject: "Гражданское право",
      type: "lecture",
      typeLabel: "Лекция",
      teacher: "доц. Я.Ф. Федорчуков",
      auditorium: "ауд. 107, К.12"
    },
    {
      pairNum: 2,
      subject: "Гражданское право",
      type: "lecture",
      typeLabel: "Лекция",
      teacher: "доц. Я.Ф. Федорчуков",
      auditorium: "ауд. 107, К.12"
    },
    {
      pairNum: 3,
      subject: "Жилищное право",
      type: "lecture",
      typeLabel: "Лекция",
      teacher: "доц. Н.А. Шеленга",
      auditorium: "ауд. 104, К.12"
    },
    {
      pairNum: 4,
      subject: "Жилищное право",
      type: "practice",
      typeLabel: "Практика",
      teacher: "доц. Н.А. Шеленга",
      auditorium: "ауд. 104, К.12"
    }
  ],

  // ПЯТНИЦА (3 пары)
  5: [
    {
      pairNum: 1,
      subject: "Криминология",
      type: "lecture",
      typeLabel: "Лекция",
      teacher: "ст.пр. О.А. Салкуцан",
      auditorium: "ауд. 211, К.12"
    },
    {
      pairNum: 2,
      subject: "Криминология",
      type: "practice",
      typeLabel: "Практика",
      teacher: "ст.пр. О.А. Салкуцан",
      auditorium: "ауд. 211, К.12"
    },
    {
      pairNum: 3,
      subject: "Избирательное право",
      type: "mix",
      typeLabel: "Лекция/Практика",
      teacher: "доц. Г.С. Брусалинская",
      auditorium: "ауд. 102, К.12"
    }
  ],

  // СУББОТА (2 пары)
  6: [
    {
      pairNum: 1,
      subject: "Гражданский процесс",
      type: "lecture",
      typeLabel: "Лекция",
      teacher: "доц. Е.З. Евстигнеева",
      auditorium: "ауд. 211, К.12"
    },
    {
      pairNum: 2,
      subject: "Гражданский процесс",
      type: "practice",
      typeLabel: "Практика",
      teacher: "доц. Е.З. Евстигнеева",
      auditorium: "ауд. 211, К.12"
    }
  ]
};

// --- SVG Icons ---
const IconBell = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
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

const IconClose = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const IconCheck = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// --- Helpers ---
function calculateWeekNumber(nowDate = new Date()) {
  const current = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate());
  const dayOfWeek = (current.getDay() + 6) % 7; // 0: Mon, ... 6: Sun
  const monday = new Date(current);
  monday.setDate(current.getDate() - dayOfWeek);

  const diffTime = monday.getTime() - BASE_SEMESTER_START.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  const weekNumber = Math.floor(diffDays / 7) + 1;
  return weekNumber > 0 ? weekNumber : 1;
}

function formatRussianDate(date = new Date()) {
  const day = date.getDate();
  const months = [
    "января", "февраля", "марта", "апреля", "мая", "июня",
    "июля", "августа", "сентября", "октября", "ноября", "декабря"
  ];
  return `${day} ${months[date.getMonth()]}`;
}

// --- Main Application Component ---
function App() {
  // Theme state: 'pikmi' | 'dark' | 'light' (defaults to pikmi as user requested!)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('schedule_theme_v3') || 'pikmi';
  });

  const [showBellsModal, setShowBellsModal] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  // Apply theme to DOM
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('schedule_theme_v3', theme);
  }, [theme]);

  // Real-time 1-second clock tick
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Current day of week (1: Mon, ... 6: Sat, 0: Sun)
  const currentDayOfWeek = currentDateTime.getDay();
  const currentDayId = currentDayOfWeek === 0 ? 1 : currentDayOfWeek;

  // Selected Day tab in ribbon
  const [selectedDayId, setSelectedDayId] = useState(currentDayId);

  // Week number calculation (e.g. 4)
  const weekNumber = useMemo(() => {
    return calculateWeekNumber(currentDateTime);
  }, [currentDateTime]);

  // Current minutes of the day (0 - 1439)
  const currentMinutes = currentDateTime.getHours() * 60 + currentDateTime.getMinutes();

  // Determine currently active pair or current interval
  const liveStatus = useMemo(() => {
    if (currentDayOfWeek === 0 || currentDayOfWeek > 6) {
      return {
        type: 'idle',
        pillText: '🏖 Выходной день',
        activePairNum: null,
        remainingMinutes: null,
        progressPercent: 0
      };
    }

    // Check if right now within any bell interval
    for (let bell of BELL_SCHEDULE) {
      if (currentMinutes >= bell.startMin && currentMinutes <= bell.endMin) {
        const remaining = bell.endMin - currentMinutes;
        const totalDuration = bell.endMin - bell.startMin;
        const passedMinutes = currentMinutes - bell.startMin;
        const progressPercent = Math.min(Math.max((passedMinutes / totalDuration) * 100, 3), 100);

        return {
          type: 'lesson',
          pillText: `Идёт ${bell.num} пара · до ${bell.end}`,
          activePairNum: bell.num,
          remainingMinutes: remaining,
          progressPercent: progressPercent
        };
      }
    }

    // Check if between pairs (break)
    for (let i = 0; i < BELL_SCHEDULE.length - 1; i++) {
      const prev = BELL_SCHEDULE[i];
      const next = BELL_SCHEDULE[i + 1];
      if (currentMinutes > prev.endMin && currentMinutes < next.startMin) {
        const untilNext = next.startMin - currentMinutes;
        const breakDuration = next.startMin - prev.endMin;
        const breakPassed = currentMinutes - prev.endMin;
        const progressPercent = Math.min(Math.max((breakPassed / breakDuration) * 100, 3), 100);

        return {
          type: 'break',
          pillText: `☕ Перемена · до ${next.start}`,
          activePairNum: null,
          remainingMinutes: untilNext,
          progressPercent: progressPercent
        };
      }
    }

    // Before classes
    if (currentMinutes < BELL_SCHEDULE[0].startMin) {
      const untilFirst = BELL_SCHEDULE[0].startMin - currentMinutes;
      return {
        type: 'before',
        pillText: `🌅 До 1 пары · начало в 08:00`,
        activePairNum: null,
        remainingMinutes: untilFirst,
        progressPercent: 0
      };
    }

    // After classes
    return {
      type: 'idle',
      pillText: '✨ Пары на сегодня всё',
      activePairNum: null,
      remainingMinutes: null,
      progressPercent: 100
    };
  }, [currentMinutes, currentDayOfWeek]);

  // Active day schedule pairs
  const activeDayPairs = SCHEDULE_DATABASE[selectedDayId] || [];
  const selectedDayMeta = DAYS_DATA.find(d => d.id === selectedDayId);
  const isSelectedDayToday = selectedDayId === currentDayOfWeek;

  return (
    <>
      {/* --- Floating Sakura Petals (Pikmi Theme) --- */}
      <div className="pikmi-decor-container" aria-hidden="true">
        <div className="petal">🌸</div>
        <div className="petal">🌸</div>
        <div className="petal">🌷</div>
        <div className="petal">🌸</div>
        <div className="petal">✨</div>
        <div className="petal">🌸</div>
      </div>

      <div className="app-viewport">
        {/* ==========================================================================
            TOP HEADER CARD (Exact Replica of Mockup Image)
            ========================================================================== */}
        <section className="top-header-card">
          <div className="top-header-row-1">
            <div className="date-and-week">
              <h1 className="date-title">{formatRussianDate(currentDateTime)}</h1>
              <div className="week-pill-badge">
                {weekNumber}-я учебная неделя
              </div>
            </div>

            {/* Circular Schedule Bell Button */}
            <button 
              className="header-action-circle"
              onClick={() => setShowBellsModal(true)}
              title="Расписание звонков"
              aria-label="Расписание звонков"
            >
              <IconBell />
            </button>
          </div>

          {/* Theme Capsule Switcher (Sun, Moon, Ribbon 🎀) */}
          <div className="theme-switch-capsule">
            <button 
              className={`theme-switch-btn ${theme === 'light' ? 'active' : ''}`}
              onClick={() => setTheme('light')}
              title="Светлая тема"
              aria-label="Светлая тема"
            >
              ☀️
            </button>
            <button 
              className={`theme-switch-btn ${theme === 'dark' ? 'active' : ''}`}
              onClick={() => setTheme('dark')}
              title="Тёмная тема"
              aria-label="Тёмная тема"
            >
              🌙
            </button>
            <button 
              className={`theme-switch-btn ${theme === 'pikmi' ? 'active' : ''}`}
              onClick={() => setTheme('pikmi')}
              title="Pikmi тема"
              aria-label="Pikmi тема"
            >
              🎀
            </button>
          </div>

          {/* Live Status Pill with Beacon Dot */}
          <div className="live-status-pill">
            <span className="live-beacon-dot" />
            <span>{liveStatus.pillText}</span>
          </div>

          {/* Dynamic Live Progress Scale / Bar */}
          <div className="header-progress-wrap">
            <div className="header-progress-track">
              <div 
                className="header-progress-fill" 
                style={{ width: `${liveStatus.progressPercent}%` }}
              />
            </div>
          </div>
        </section>

        {/* ==========================================================================
            DAYS NAVIGATION RIBBON (ПН-СБ) (Exact Replica of Mockup Image)
            ========================================================================== */}
        <nav className="days-ribbon-row" aria-label="Дни недели">
          {DAYS_DATA.map(day => {
            const isToday = day.id === currentDayOfWeek;
            const isSelected = day.id === selectedDayId;
            const pairsCount = (SCHEDULE_DATABASE[day.id] || []).length;

            return (
              <button
                key={day.id}
                className={`day-tab-card ${isSelected ? 'is-selected' : ''} ${isToday ? 'is-today' : ''}`}
                onClick={() => setSelectedDayId(day.id)}
              >
                <span className="day-tab-name">{day.short}</span>
                <span className="day-tab-pairs-count">
                  {pairsCount} {pairsCount === 1 ? 'пара' : pairsCount < 5 ? 'пары' : 'пар'}
                </span>
              </button>
            );
          })}
        </nav>

        {/* ==========================================================================
            SCHEDULE CONTENT CONTAINER
            ========================================================================== */}
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

          {/* Schedule List */}
          {activeDayPairs.length > 0 ? (
            activeDayPairs.map((item, idx) => {
              const bell = BELL_SCHEDULE.find(b => b.num === item.pairNum) || { start: '--:--', end: '--:--', startMin: 0, endMin: 0 };
              
              // Pair state calculation:
              const isPairActiveNow = isSelectedDayToday && liveStatus.activePairNum === item.pairNum;
              const isPairPassed = isSelectedDayToday && currentMinutes > bell.endMin;

              // Remaining minutes calculation
              const remainingMinutes = isPairActiveNow ? bell.endMin - currentMinutes : null;
              const pairProgressPercent = isPairActiveNow 
                ? Math.min(Math.max(((currentMinutes - bell.startMin) / (bell.endMin - bell.startMin)) * 100, 3), 100)
                : 0;

              return (
                <div 
                  key={`${item.pairNum}-${idx}`} 
                  className={`pair-card ${isPairActiveNow ? 'is-active' : ''} ${isPairPassed ? 'is-passed' : ''}`}
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

                    {/* Active Live Pulse Badge */}
                    {isPairActiveNow && (
                      <div className="pulsing-live-badge">
                        <span className="pulsing-dot" />
                        <span>Идёт сейчас</span>
                      </div>
                    )}

                    {/* Passed Pair Indicator */}
                    {isPairPassed && (
                      <div className="passed-badge">
                        <IconCheck />
                        <span>Завершена</span>
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

                  {/* Real-time Dynamic Scale & Remaining Time Slider (Active Pair) */}
                  {isPairActiveNow && (
                    <div className="active-card-countdown">
                      <div className="active-countdown-labels">
                        <span>Осталось {remainingMinutes} мин</span>
                        <span>{Math.round(pairProgressPercent)}%</span>
                      </div>
                      <div className="active-card-progress-track">
                        <div 
                          className="active-card-progress-bar" 
                          style={{ width: `${pairProgressPercent}%` }} 
                        />
                      </div>
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

        {/* ==========================================================================
            BELL SCHEDULE MODAL
            ========================================================================== */}
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
