// 30 NCAA D1 Champions as placeholder athletes
// Each has randomized grades (7-12) and varied BASE levels to show
// different athlete profiles — some specialists, some well-rounded.

const generateLevel = (min, max) => {
  return Math.round((min + Math.random() * (max - min)) * 10) / 10;
};

export const SEED_ATHLETES = [
  // Standouts (4.5-5 stars)
  { name: 'Spencer Lee', grade: 11, baseLevels: { battle: 5.0, athletic: 4.8, skill: 5.0, exercise: 4.7 } },
  { name: 'Yianni Diakomihalis', grade: 12, baseLevels: { battle: 4.9, athletic: 4.7, skill: 4.9, exercise: 4.5 } },

  // Well-rounded 4-star athletes
  { name: 'Carter Starocci', grade: 12, baseLevels: { battle: 4.3, athletic: 4.2, skill: 4.4, exercise: 4.1 } },
  { name: 'Aaron Brooks', grade: 11, baseLevels: { battle: 4.5, athletic: 4.3, skill: 4.2, exercise: 4.0 } },
  { name: 'David Carr', grade: 10, baseLevels: { battle: 4.2, athletic: 4.0, skill: 4.3, exercise: 4.1 } },
  { name: 'Greg Kerkvliet', grade: 12, baseLevels: { battle: 4.0, athletic: 4.2, skill: 4.1, exercise: 4.3 } },
  { name: 'Mason Parris', grade: 11, baseLevels: { battle: 4.1, athletic: 3.9, skill: 4.0, exercise: 4.4 } },

  // Strong in Battle, weaker elsewhere
  { name: 'Dean Hamiti', grade: 10, baseLevels: { battle: 4.5, athletic: 3.2, skill: 3.5, exercise: 3.0 } },
  { name: 'Antrell Taylor', grade: 9, baseLevels: { battle: 4.3, athletic: 3.4, skill: 3.0, exercise: 2.8 } },
  { name: 'Mitchell Mesenbrink', grade: 10, baseLevels: { battle: 4.4, athletic: 3.3, skill: 3.6, exercise: 3.1 } },
  { name: 'Richie Figueroa', grade: 9, baseLevels: { battle: 4.6, athletic: 3.5, skill: 3.4, exercise: 3.2 } },

  // Strong in Athletic, weaker in other areas
  { name: 'Roman Bravo-Young', grade: 11, baseLevels: { battle: 3.5, athletic: 4.7, skill: 3.8, exercise: 3.3 } },
  { name: 'Real Woods', grade: 10, baseLevels: { battle: 3.3, athletic: 4.5, skill: 3.6, exercise: 3.1 } },
  { name: 'Vito Arujau', grade: 9, baseLevels: { battle: 3.4, athletic: 4.4, skill: 3.5, exercise: 3.0 } },
  { name: 'Drake Ayala', grade: 8, baseLevels: { battle: 3.2, athletic: 4.3, skill: 3.3, exercise: 2.9 } },

  // Strong in Skill, weaker elsewhere
  { name: 'Austin O\'Connor', grade: 12, baseLevels: { battle: 3.4, athletic: 3.3, skill: 4.6, exercise: 3.1 } },
  { name: 'Nino Bonaccorsi', grade: 11, baseLevels: { battle: 3.2, athletic: 3.1, skill: 4.4, exercise: 3.3 } },
  { name: 'Keegan O\'Toole', grade: 10, baseLevels: { battle: 3.6, athletic: 3.4, skill: 4.5, exercise: 3.0 } },
  { name: 'Caleb Henson', grade: 9, baseLevels: { battle: 3.3, athletic: 3.5, skill: 4.3, exercise: 3.2 } },

  // Strong in Exercise/Conditioning
  { name: 'Wyatt Hendrickson', grade: 12, baseLevels: { battle: 3.1, athletic: 3.4, skill: 3.2, exercise: 4.6 } },
  { name: 'Stephen Buchanan', grade: 11, baseLevels: { battle: 3.3, athletic: 3.5, skill: 3.0, exercise: 4.5 } },
  { name: 'Troy Spratley', grade: 10, baseLevels: { battle: 3.0, athletic: 3.2, skill: 3.1, exercise: 4.4 } },

  // Mid-level / developing athletes
  { name: 'Vincent Robinson', grade: 8, baseLevels: { battle: 3.0, athletic: 3.2, skill: 3.1, exercise: 3.0 } },
  { name: 'Lucas Byrd', grade: 9, baseLevels: { battle: 3.3, athletic: 3.5, skill: 3.4, exercise: 3.2 } },
  { name: 'Brock Hardy', grade: 8, baseLevels: { battle: 3.1, athletic: 3.3, skill: 3.5, exercise: 3.0 } },
  { name: 'Ridge Lovett', grade: 7, baseLevels: { battle: 2.8, athletic: 3.0, skill: 3.2, exercise: 2.9 } },
  { name: 'Jesse Mendez', grade: 9, baseLevels: { battle: 3.5, athletic: 3.6, skill: 3.4, exercise: 3.3 } },
  { name: 'Levi Haines', grade: 10, baseLevels: { battle: 3.7, athletic: 3.5, skill: 3.6, exercise: 3.4 } },

  // Beginners
  { name: 'Parker Keckeisen', grade: 7, baseLevels: { battle: 2.5, athletic: 2.8, skill: 2.6, exercise: 2.4 } },
  { name: 'Josh Barr', grade: 8, baseLevels: { battle: 2.3, athletic: 2.5, skill: 2.4, exercise: 2.6 } },
];
