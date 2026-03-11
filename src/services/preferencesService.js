import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export const PREFERENCE_OPTIONS = {
  positions: [
    'Neutral / On Feet',
    'Top / Riding',
    'Bottom / Escapes',
    'All Positions',
  ],
  stancePreference: ['Right Lead', 'Left Lead', 'Switch Stance', 'No Preference'],
  battleFocus: [
    'Takedowns',
    'Hand Fighting',
    'Chain Wrestling',
    'Scramble Situations',
    'Riding & Turns',
    'Escapes & Reversals',
  ],
  athleticFocus: [
    'Speed & Agility',
    'Explosiveness',
    'Balance & Coordination',
    'Flexibility & Mobility',
    'Reaction Time',
  ],
  skillFocus: [
    'Single Leg Attacks',
    'Double Leg Attacks',
    'Upper Body Throws',
    'Tilts & Turns (Top)',
    'Stand-ups & Sit-outs (Bottom)',
    'Front Headlock Series',
    'Leg Riding',
    'Cradles',
  ],
  exerciseFocus: [
    'Strength Training',
    'Cardio Endurance',
    'Core Strength',
    'Grip Strength',
    'Recovery & Mobility',
    'Plyometrics',
  ],
  hardDaysPerWeek: ['2', '3', '4', '5'],
  trainingPurpose: [
    'In-Season Practice',
    'Off-Season Development',
    'Pre-Season Conditioning',
    'Tournament Preparation',
    'Technique Focus Camp',
  ],
  practiceDuration: [
    '60 minutes',
    '75 minutes',
    '90 minutes',
    '105 minutes',
    '120 minutes',
  ],
};

export const savePreferences = async (uid, preferences) => {
  const prefRef = doc(db, 'users', uid, 'settings', 'preferences');
  await setDoc(prefRef, {
    ...preferences,
    updatedAt: new Date().toISOString(),
  }, { merge: true });
};

export const getPreferences = async (uid) => {
  const prefRef = doc(db, 'users', uid, 'settings', 'preferences');
  const snap = await getDoc(prefRef);
  return snap.exists() ? snap.data() : null;
};
