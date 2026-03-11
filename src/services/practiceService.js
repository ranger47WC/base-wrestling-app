import { doc, setDoc, getDoc, collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export const generatePractice = (preferences) => {
  const duration = parseInt(preferences?.practiceDuration) || 90;

  const warmUpMinutes = Math.round(duration * 0.12);
  const techniqueMinutes = Math.round(duration * 0.30);
  const battleMinutes = Math.round(duration * 0.35);
  const exerciseMinutes = Math.round(duration * 0.18);
  const coolDownMinutes = duration - warmUpMinutes - techniqueMinutes - battleMinutes - exerciseMinutes;

  const stance = preferences?.stancePreference || 'Right Lead';
  const positions = preferences?.positions || 'All Positions';

  return {
    title: 'Today\'s BASE Practice',
    totalDuration: duration,
    sections: [
      {
        name: 'Warm-Up & Movement',
        area: 'athletic',
        duration: warmUpMinutes,
        drills: [
          { name: 'Dynamic Stretching Circuit', duration: Math.round(warmUpMinutes * 0.4), cue: 'Arm circles, leg swings, hip openers — keep moving, increase range each rep.' },
          { name: 'Wrestling-Specific Agility', duration: Math.round(warmUpMinutes * 0.3), cue: `${stance} stance — level changes, sprawls, penetration steps. Stay low, drive through.` },
          { name: 'Partner Mirror Drill', duration: Math.round(warmUpMinutes * 0.3), cue: 'Match your partner\'s movement. React, don\'t predict. Keep hands active.' },
        ],
      },
      {
        name: 'Skill Mastery — Technique',
        area: 'skill',
        duration: techniqueMinutes,
        drills: buildTechniqueDrills(preferences, techniqueMinutes),
      },
      {
        name: 'Battle Awareness — Live Situations',
        area: 'battle',
        duration: battleMinutes,
        drills: buildBattleDrills(preferences, battleMinutes),
      },
      {
        name: 'Exercise Conditioning',
        area: 'exercise',
        duration: exerciseMinutes,
        drills: buildExerciseDrills(preferences, exerciseMinutes),
      },
      {
        name: 'Cool Down & Recovery',
        area: 'athletic',
        duration: coolDownMinutes,
        drills: [
          { name: 'Light Jogging / Walking', duration: Math.round(coolDownMinutes * 0.4), cue: 'Bring heart rate down gradually.' },
          { name: 'Static Stretching', duration: Math.round(coolDownMinutes * 0.6), cue: 'Hold each stretch 30 seconds. Focus on hips, shoulders, hamstrings.' },
        ],
      },
    ],
  };
};

const buildTechniqueDrills = (prefs, minutes) => {
  const skills = prefs?.skillFocus || ['Single Leg Attacks', 'Stand-ups & Sit-outs (Bottom)'];
  const drillBank = {
    'Single Leg Attacks': [
      { name: 'Single Leg Setup Drill', cue: 'Inside tie to snap, level change, attack lead leg. Finish with a high crotch turn.' },
      { name: 'Single Leg Chains', cue: 'Attack → block → re-attack. Run the pipe, trip, or limp arm finish.' },
    ],
    'Double Leg Attacks': [
      { name: 'Double Leg Penetration Step', cue: 'Deep step, head on hip, drive through. Don\'t reach — change levels first.' },
      { name: 'Setup to Double', cue: 'Club, snap, fake, then shoot. Make them react before you attack.' },
    ],
    'Upper Body Throws': [
      { name: 'Underhook Series', cue: 'Pummel to deep underhook. Hip pop throw or duck under. Stay tight.' },
      { name: 'Headlock Defense to Counter', cue: 'Block the hip, circle away, counter with a throw-by or ankle pick.' },
    ],
    'Tilts & Turns (Top)': [
      { name: 'Half Nelson Series', cue: 'Control wrist, drive half. If they post, switch to a tilt or chop.' },
      { name: 'Tight Waist Tilt', cue: 'Lock tight waist, chop the arm. Drive into them and look for back points.' },
    ],
    'Stand-ups & Sit-outs (Bottom)': [
      { name: 'Stand-Up Drill', cue: 'Hands on theirs, base up, cut the corner. Clear the hands and face them.' },
      { name: 'Sit-out Turn-in', cue: 'Pop the hips, sit through hard. Turn in and come to a squaring position.' },
    ],
    'Front Headlock Series': [
      { name: 'Snap to Front Headlock', cue: 'Heavy hands, snap down, lock the chin. Spin behind or go-behind.' },
      { name: 'Front Head Cement Job', cue: 'Lock around chin and arm. Walk the hips and squeeze. Look for the Darce.' },
    ],
    'Leg Riding': [
      { name: 'Leg Ride Insertion', cue: 'Control far ankle, insert the leg ride. Grapevine and flatten.' },
      { name: 'Leg Ride to Turk', cue: 'From leg ride, reach for the far arm. Lock the turk and drive for back exposure.' },
    ],
    'Cradles': [
      { name: 'Near-Side Cradle', cue: 'From top, control head and far knee. Lock hands, squeeze and roll.' },
      { name: 'Far-Side Cradle', cue: 'Crossface, drive into them, catch the far knee. Lock up and roll for back points.' },
    ],
  };

  const drills = [];
  const perSkillTime = Math.round(minutes / Math.max(skills.length, 1));
  skills.forEach((skill) => {
    const bank = drillBank[skill] || drillBank['Single Leg Attacks'];
    bank.forEach((drill, i) => {
      drills.push({
        ...drill,
        duration: Math.round(perSkillTime / bank.length),
      });
    });
  });
  return drills;
};

const buildBattleDrills = (prefs, minutes) => {
  const focus = prefs?.battleFocus || ['Takedowns', 'Scramble Situations'];
  const drillBank = {
    'Takedowns': [
      { name: 'Live Takedown Sparring', cue: 'Reset on feet after each score. 30-second bursts, full speed.' },
      { name: 'King of the Mat (Takedowns)', cue: 'Winner stays. First takedown wins. Loser rotates out.' },
    ],
    'Hand Fighting': [
      { name: 'Tie-Up Battles', cue: 'Collar tie, 2-on-1, underhook battles. Control position, create angles.' },
      { name: 'Handfight to Shot Drill', cue: 'Work ties for 10 seconds, then attack. Score within 5 seconds of shooting.' },
    ],
    'Chain Wrestling': [
      { name: 'Chain Attack Series', cue: 'Shot → stuff → re-attack. Never stop with one attempt. Link 3 moves minimum.' },
      { name: 'Reaction Chain Drill', cue: 'Coach calls position, wrestlers chain 3 moves from that position.' },
    ],
    'Scramble Situations': [
      { name: 'Scramble Go-Live', cue: 'Start from bad positions. Fight out. First to control wins the rep.' },
      { name: '50/50 Scramble Drill', cue: 'Both start on knees. Whistle — fight for position. Pure scramble instincts.' },
    ],
    'Riding & Turns': [
      { name: 'Ride & Turn Challenge', cue: 'Top wrestler has 30 seconds to turn. Bottom tries to escape. Switch roles.' },
      { name: 'Breakdown to Turn Drill', cue: 'Spiral ride, chop, flatten. Then work your turn series — tilts, halfs, or cradles.' },
    ],
    'Escapes & Reversals': [
      { name: 'Bottom Escape Gauntlet', cue: 'Bottom wrestler must escape 3 different top wrestlers. 20 seconds each.' },
      { name: 'Reversal Drill', cue: 'From bottom referee\'s position, work switch or roll. Score the reversal.' },
    ],
  };

  const drills = [];
  const perFocusTime = Math.round(minutes / Math.max(focus.length, 1));
  focus.forEach((f) => {
    const bank = drillBank[f] || drillBank['Takedowns'];
    bank.forEach((drill) => {
      drills.push({ ...drill, duration: Math.round(perFocusTime / bank.length) });
    });
  });
  return drills;
};

const buildExerciseDrills = (prefs, minutes) => {
  const focus = prefs?.exerciseFocus || ['Cardio Endurance', 'Core Strength'];
  const drillBank = {
    'Strength Training': [
      { name: 'Partner Carry / Fireman\'s Walk', cue: 'Carry your partner 40 yards. Switch. Build functional wrestling strength.' },
      { name: 'Buddy Squats', cue: 'Partner on back, squat 10 reps. Explode up each rep.' },
    ],
    'Cardio Endurance': [
      { name: 'Mat Sprints', cue: 'Down-and-backs across the mat. 30 seconds on, 15 off. Match pace intensity.' },
      { name: 'Shadow Wrestling Cardio', cue: 'Full speed shadow wrestling. Shots, sprawls, spins. Don\'t stop moving.' },
    ],
    'Core Strength': [
      { name: 'Wrestling Plank Series', cue: 'Front plank, side plank each side, bridge hold. 30 seconds each. No sagging.' },
      { name: 'Leg Lifts & V-Ups', cue: 'Controlled reps. Core tight. Build the mat strength you need on bottom.' },
    ],
    'Grip Strength': [
      { name: 'Towel Pull-Ups / Rope Climbs', cue: 'Grip the towel, pull. Build the grip that wins in the third period.' },
      { name: 'Wrist Roller', cue: 'Roll up, roll down. Forearms should be burning. This wins hand fights.' },
    ],
    'Recovery & Mobility': [
      { name: 'Yoga Flow for Wrestlers', cue: 'Down dog, pigeon pose, lizard pose. Open up the hips and shoulders.' },
      { name: 'Foam Rolling', cue: 'Hit quads, IT band, upper back. 60 seconds per area. Slow and controlled.' },
    ],
    'Plyometrics': [
      { name: 'Box Jumps', cue: 'Explode up, soft landing. Reset each rep. Build the explosive power for shots.' },
      { name: 'Lateral Bounds', cue: 'Side to side, stick each landing. Mimics lateral movement in a match.' },
    ],
  };

  const drills = [];
  const perFocusTime = Math.round(minutes / Math.max(focus.length, 1));
  focus.forEach((f) => {
    const bank = drillBank[f] || drillBank['Cardio Endurance'];
    bank.forEach((drill) => {
      drills.push({ ...drill, duration: Math.round(perFocusTime / bank.length) });
    });
  });
  return drills;
};

export const generateWeekPlan = (preferences) => {
  const hardDays = parseInt(preferences?.hardDaysPerWeek) || 3;
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const plan = [];

  const focusAreas = ['Battle', 'Skill', 'Athletic', 'Exercise'];

  days.forEach((day, index) => {
    if (day === 'Sunday') {
      plan.push({ day, type: 'Rest', focus: 'Recovery & Mobility', intensity: 'Low' });
    } else if (index < hardDays + 1 && day !== 'Saturday') {
      const focus = focusAreas[index % focusAreas.length];
      plan.push({ day, type: 'Hard', focus: `${focus}-Focused Practice`, intensity: 'High' });
    } else if (day === 'Saturday') {
      plan.push({ day, type: 'Competition / Live', focus: 'Full Match Simulation', intensity: 'High' });
    } else {
      plan.push({ day, type: 'Light', focus: 'Technique & Film', intensity: 'Moderate' });
    }
  });

  return plan;
};

export const generate21DayPlan = (preferences) => {
  const plan = [];
  const themes = [
    'Battle Focus', 'Athletic Development', 'Skill Mastery', 'Exercise Conditioning',
    'Live Wrestling', 'Recovery', 'Technique Refinement',
  ];

  for (let i = 1; i <= 21; i++) {
    const dayOfWeek = (i - 1) % 7;
    if (dayOfWeek === 6) {
      plan.push({ day: i, theme: 'Rest & Recovery', intensity: 'Rest', completed: false });
    } else {
      const theme = themes[dayOfWeek % themes.length];
      const intensity = dayOfWeek < 4 ? 'Hard' : 'Moderate';
      plan.push({ day: i, theme, intensity, completed: false });
    }
  }
  return plan;
};

export const savePractice = async (uid, practice) => {
  const practicesRef = collection(db, 'users', uid, 'practices');
  const docRef = await addDoc(practicesRef, {
    ...practice,
    createdAt: new Date().toISOString(),
  });
  return docRef.id;
};
