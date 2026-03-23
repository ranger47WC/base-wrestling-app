export type OnboardingStackParamList = {
  CoachProfile: undefined;
  TeamSetup: {
    coachName: string;
    phone: string;
  };
  Confirmation: {
    coachName: string;
    phone: string;
    teamName: string;
    level: string;
  };
};

export type RootStackParamList = {
  Login: undefined;
  Onboarding: undefined;
  CoachDashboard: undefined;
};
