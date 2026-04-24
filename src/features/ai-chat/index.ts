import Constants from 'expo-constants';

export type WorkoutExercise = {
  name: string;
  sets: string;
  reps: string;
  rest: string;
  cue: string;
};

export type WorkoutTip = {
  title: string;
  body: string;
  category: 'training' | 'execution' | 'recovery';
};

export type WorkoutPlan = {
  title: string;
  summary: string;
  focus: string;
  durationMinutes: number;
  difficulty: string;
  warmup: string[];
  exercises: WorkoutExercise[];
  tips: WorkoutTip[];
  recovery: string[];
  note: string;
};

type OpenRouterMessage = {
  role: 'system' | 'user';
  content: string;
};

const extra = Constants.expoConfig?.extra;
const openRouterApiKey =
  process.env.EXPO_PUBLIC_OPENROUTER_APIKEY ??
  process.env.OPENROUTER_APIKEY ??
  extra?.openRouterApiKey ??
  '';
const openRouterBaseUrl =
  process.env.EXPO_PUBLIC_OPENROUTER_BASEURL ??
  process.env.OPENROUTER_BASEURL ??
  extra?.openRouterBaseUrl ??
  'https://openrouter.ai/api/v1';
const openRouterModel =
  process.env.EXPO_PUBLIC_OPENROUTER_MODEL ??
  process.env.OPENROUTER_MODEL ??
  extra?.openRouterModel ??
  'openai/gpt-4o-mini';

const FALLBACK_PLAN: WorkoutPlan = {
  title: 'Balanced Strength Builder',
  summary: 'A balanced upper and lower session with steady effort and clean technique focus.',
  focus: 'Full body strength',
  durationMinutes: 50,
  difficulty: 'Intermediate',
  warmup: [
    '5 minutes brisk incline walk',
    '2 rounds of band pull-aparts and bodyweight squats',
    '2 ramp-up sets before the first compound lift'
  ],
  exercises: [
    {
      name: 'Goblet squat',
      sets: '4',
      reps: '8-10',
      rest: '75 sec',
      cue: 'Keep ribs down and drive evenly through the mid-foot.'
    },
    {
      name: 'Incline dumbbell press',
      sets: '4',
      reps: '8-10',
      rest: '90 sec',
      cue: 'Lower with control and stop just before shoulder position breaks.'
    },
    {
      name: 'Chest-supported row',
      sets: '4',
      reps: '10-12',
      rest: '75 sec',
      cue: 'Pull elbows toward hips and pause briefly at the top.'
    },
    {
      name: 'Romanian deadlift',
      sets: '3',
      reps: '8-10',
      rest: '90 sec',
      cue: 'Push hips back first and keep the bar or dumbbells close to the legs.'
    },
    {
      name: 'Plank with reach',
      sets: '3',
      reps: '8 each side',
      rest: '45 sec',
      cue: 'Brace hard so the hips stay quiet while the arm moves.'
    }
  ],
  tips: [
    {
      title: 'Start 1 rep shy of failure',
      body: 'Leave one good rep in reserve on your first working set so you can keep quality high across the whole session.',
      category: 'training'
    },
    {
      title: 'Set up before the timer starts',
      body: 'Prepare weights, bench angle, and space before each block so your rest time is used for recovery instead of logistics.',
      category: 'execution'
    },
    {
      title: 'Recover with protein and steps',
      body: 'Aim for a protein-rich meal after training and a short walk later in the day to keep recovery moving.',
      category: 'recovery'
    }
  ],
  recovery: [
    'Drink water during the session and again within the next hour.',
    'Take a 10 minute walk later today to reduce stiffness.',
    'Sleep 7 to 9 hours if possible.'
  ],
  note: 'Fallback plan is shown when the AI request is unavailable.'
};

function buildPrompt(goal: string) {
  return [
    'Create a practical gym workout plan.',
    `User goal: ${goal}`,
    'Return JSON only using this shape:',
    '{"title":"","summary":"","focus":"","durationMinutes":0,"difficulty":"","warmup":[""],"exercises":[{"name":"","sets":"","reps":"","rest":"","cue":""}],"tips":[{"title":"","body":"","category":"training"}],"recovery":[""],"note":""}',
    'Requirements:',
    '- 4 to 6 exercises',
    '- keep it realistic for a commercial gym',
    '- tips must include training, execution, and recovery guidance',
    '- concise but specific coaching language'
  ].join('\n');
}

function normalizePlan(plan: Partial<WorkoutPlan> | null | undefined): WorkoutPlan {
  const normalizedTips =
    plan?.tips
      ?.filter((tip): tip is WorkoutTip => Boolean(tip?.title && tip?.body))
      .map<WorkoutTip>((tip) => ({
        title: tip.title,
        body: tip.body,
        category:
          tip.category === 'execution' || tip.category === 'recovery' ? tip.category : 'training'
      })) ?? [];

  const normalizedExercises =
    plan?.exercises
      ?.filter((exercise): exercise is WorkoutExercise => Boolean(exercise?.name))
      .map((exercise) => ({
        name: exercise.name,
        sets: exercise.sets || '3',
        reps: exercise.reps || '10',
        rest: exercise.rest || '60 sec',
        cue: exercise.cue || 'Use controlled reps and stop when technique fades.'
      })) ?? [];

  if (!normalizedExercises.length) {
    return FALLBACK_PLAN;
  }

  return {
    title: plan?.title || FALLBACK_PLAN.title,
    summary: plan?.summary || FALLBACK_PLAN.summary,
    focus: plan?.focus || FALLBACK_PLAN.focus,
    durationMinutes:
      typeof plan?.durationMinutes === 'number' && Number.isFinite(plan.durationMinutes)
        ? plan.durationMinutes
        : FALLBACK_PLAN.durationMinutes,
    difficulty: plan?.difficulty || FALLBACK_PLAN.difficulty,
    warmup: plan?.warmup?.filter(Boolean) ?? FALLBACK_PLAN.warmup,
    exercises: normalizedExercises,
    tips: normalizedTips.length ? normalizedTips : FALLBACK_PLAN.tips,
    recovery: plan?.recovery?.filter(Boolean) ?? FALLBACK_PLAN.recovery,
    note: plan?.note || ''
  };
}

function parseJsonPayload(content: string) {
  const trimmed = content.trim();
  const cleaned = trimmed.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/, '');
  const startIndex = cleaned.indexOf('{');
  const endIndex = cleaned.lastIndexOf('}');
  const jsonCandidate =
    startIndex >= 0 && endIndex > startIndex ? cleaned.slice(startIndex, endIndex + 1) : cleaned;

  return JSON.parse(jsonCandidate) as Partial<WorkoutPlan>;
}

async function requestOpenRouter(messages: OpenRouterMessage[]) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000);

  try {
    const response = await fetch(`${openRouterBaseUrl.replace(/\/$/, '')}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openRouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://gymbuddy.app',
        'X-Title': 'Gym Buddy'
      },
      body: JSON.stringify({
        model: openRouterModel,
        messages,
        temperature: 0.8,
        response_format: {
          type: 'json_object'
        }
      }),
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`OpenRouter request failed with status ${response.status}`);
    }

    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };

    return data.choices?.[0]?.message?.content?.trim() ?? '';
  } finally {
    clearTimeout(timeoutId);
  }
}

export function hasOpenRouterConfig() {
  return Boolean(openRouterApiKey);
}

export async function generateWorkoutPlan(goal: string) {
  if (!openRouterApiKey) {
    return {
      plan: FALLBACK_PLAN,
      source: 'fallback' as const
    };
  }

  try {
    const content = await requestOpenRouter([
      {
        role: 'system',
        content: 'You are an experienced strength coach. Return strict JSON only.'
      },
      {
        role: 'user',
        content: buildPrompt(goal)
      }
    ]);
    const parsed = parseJsonPayload(content);
    return {
      plan: normalizePlan(parsed),
      source: 'openrouter' as const
    };
  } catch {
    return {
      plan: FALLBACK_PLAN,
      source: 'fallback' as const
    };
  }
}
