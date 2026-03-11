import { doc, setDoc, getDoc, updateDoc, collection, addDoc, getDocs, deleteDoc, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';

export const generateTeamCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export const saveProfile = async (uid, profileData) => {
  const userRef = doc(db, 'users', uid);
  await setDoc(userRef, {
    ...profileData,
    updatedAt: new Date().toISOString(),
  }, { merge: true });
};

export const getProfile = async (uid) => {
  const userRef = doc(db, 'users', uid);
  const snap = await getDoc(userRef);
  return snap.exists() ? snap.data() : null;
};

export const createTeam = async (uid, teamName) => {
  const teamCode = generateTeamCode();
  const teamRef = doc(db, 'teams', teamCode);
  await setDoc(teamRef, {
    name: teamName,
    code: teamCode,
    coachId: uid,
    createdAt: new Date().toISOString(),
  });
  await updateDoc(doc(db, 'users', uid), { teamCode });
  return teamCode;
};

export const addAthleteToRoster = async (teamCode, athleteData) => {
  const rosterRef = collection(db, 'teams', teamCode, 'roster');
  const docRef = await addDoc(rosterRef, {
    ...athleteData,
    addedAt: new Date().toISOString(),
  });
  return docRef.id;
};

export const getRoster = async (teamCode) => {
  const rosterRef = collection(db, 'teams', teamCode, 'roster');
  const snapshot = await getDocs(rosterRef);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const deleteAthlete = async (teamCode, athleteId) => {
  const athleteRef = doc(db, 'teams', teamCode, 'roster', athleteId);
  await deleteDoc(athleteRef);
};

export const completeOnboarding = async (uid) => {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, { onboardingComplete: true });
};
