import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

export const getBASEOverview = (roster = []) => {
  const calculateAverage = (athletes, area) => {
    if (athletes.length === 0) return 0;
    const total = athletes.reduce((sum, a) => sum + (a.baseLevels?.[area] || 0), 0);
    return Math.round((total / athletes.length) * 10) / 10;
  };

  return [
    {
      area: 'Battle',
      key: 'battle',
      subtitle: 'Awareness & Compete',
      average: calculateAverage(roster, 'battle'),
      color: '#C0392B',
      icon: '⚔️',
      description: 'Live wrestling IQ, scramble ability, compete level, and match awareness.',
    },
    {
      area: 'Athletic',
      key: 'athletic',
      subtitle: 'Physical Development',
      average: calculateAverage(roster, 'athletic'),
      color: '#2980B9',
      icon: '🏃',
      description: 'Speed, agility, explosiveness, balance, and overall athleticism.',
    },
    {
      area: 'Skill',
      key: 'skill',
      subtitle: 'Technical Mastery',
      average: calculateAverage(roster, 'skill'),
      color: '#27AE60',
      icon: '🎯',
      description: 'Technique proficiency across all positions — feet, top, and bottom.',
    },
    {
      area: 'Exercise',
      key: 'exercise',
      subtitle: 'Conditioning & Strength',
      average: calculateAverage(roster, 'exercise'),
      color: '#F39C12',
      icon: '💪',
      description: 'Strength, endurance, conditioning, and physical preparation.',
    },
  ];
};

export const getTeamStats = async (teamCode) => {
  if (!teamCode) return { athleteCount: 0, practiceCount: 0 };
  const rosterRef = collection(db, 'teams', teamCode, 'roster');
  const rosterSnap = await getDocs(rosterRef);
  return {
    athleteCount: rosterSnap.size,
    practiceCount: 0,
  };
};
