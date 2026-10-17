// Daily visit streak. Keys match what AchievementsPage and ParentalDashboard already read:
//   streakCount: consecutive days visited (integer string)
//   lastVisit:   local date of the last visit, YYYY-MM-DD
const dayString = (d) => d.toLocaleDateString('en-CA'); // en-CA formats as YYYY-MM-DD

// Call once per app load. Safe to call repeatedly on the same day (idempotent).
export function recordVisit() {
  try {
    const today = new Date();
    const todayStr = dayString(today);
    const last = localStorage.getItem('lastVisit');
    let streak = parseInt(localStorage.getItem('streakCount') || '0', 10) || 0;

    if (last === todayStr && streak > 0) return streak;

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    streak = last === dayString(yesterday) ? streak + 1 : 1;

    localStorage.setItem('streakCount', String(streak));
    localStorage.setItem('lastVisit', todayStr);
    return streak;
  } catch {
    return 0; // storage unavailable (private mode)
  }
}
