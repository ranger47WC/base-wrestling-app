export const BADGES = [
  {
    id: 'first_practice',
    name: 'First Whistle',
    description: 'Complete your first practice',
    icon: '🏅',
    requirement: 1,
    type: 'practices',
  },
  {
    id: 'five_practices',
    name: 'Grind Mode',
    description: 'Complete 5 practices',
    icon: '🔥',
    requirement: 5,
    type: 'practices',
  },
  {
    id: 'ten_practices',
    name: 'Iron Sharpens Iron',
    description: 'Complete 10 practices',
    icon: '⚔️',
    requirement: 10,
    type: 'practices',
  },
  {
    id: 'twenty_one_day',
    name: '21-Day Warrior',
    description: 'Complete the 21-day challenge',
    icon: '🏆',
    requirement: 21,
    type: 'streak',
  },
  {
    id: 'full_roster',
    name: 'Squad Deep',
    description: 'Add 10+ athletes to your roster',
    icon: '👥',
    requirement: 10,
    type: 'roster',
  },
  {
    id: 'week_complete',
    name: 'Week Warrior',
    description: 'Complete a full week plan',
    icon: '📅',
    requirement: 7,
    type: 'streak',
  },
  {
    id: 'base_balanced',
    name: 'BASE Balanced',
    description: 'Run practices covering all 4 BASE areas',
    icon: '⚖️',
    requirement: 4,
    type: 'areas',
  },
  {
    id: 'battle_tested',
    name: 'Battle Tested',
    description: 'Complete 5 Battle-focused practices',
    icon: '🛡️',
    requirement: 5,
    type: 'battle',
  },
];

export const getUserBadges = (stats = {}) => {
  return BADGES.map((badge) => {
    let progress = 0;
    switch (badge.type) {
      case 'practices':
        progress = stats.practicesCompleted || 0;
        break;
      case 'streak':
        progress = stats.currentStreak || 0;
        break;
      case 'roster':
        progress = stats.rosterSize || 0;
        break;
      case 'areas':
        progress = stats.areasCompleted || 0;
        break;
      case 'battle':
        progress = stats.battlePractices || 0;
        break;
      default:
        progress = 0;
    }
    return {
      ...badge,
      progress,
      earned: progress >= badge.requirement,
      progressPercent: Math.min(100, Math.round((progress / badge.requirement) * 100)),
    };
  });
};
