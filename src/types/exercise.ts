export type ExerciseInstructionSet = {
  en: string;
  tr: string;
};

export type ExerciseInstructionSteps = {
  en: string[];
  tr: string[];
};

export type Exercise = {
  id: string;
  name: string;
  category: string;
  body_part: string;
  equipment: string;
  instructions: ExerciseInstructionSet;
  instruction_steps?: ExerciseInstructionSteps;
  muscle_group?: string;
  secondary_muscles?: string[];
  target?: string;
  image: string;
  gif_url: string;
  created_at?: string;
};

export type ExerciseMedia = {
  image: number;
  gif: number;
};
