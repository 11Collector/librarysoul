import { questions } from "@/data/questions";

export const calculateMBTI = (answers: Record<number, 'A' | 'B'>): string => {
  const scores = {
    Energy: { A: 0, B: 0 },
    Information: { A: 0, B: 0 },
    Decision: { A: 0, B: 0 },
    Lifestyle: { A: 0, B: 0 },
  };

  questions.forEach((q) => {
    const answer = answers[q.id];
    if (answer) {
      scores[q.dimension][answer]++;
    }
  });

  const getDimensionLetter = (dimension: keyof typeof scores, letterA: string, letterB: string) => {
    return scores[dimension].A >= 3 ? letterA : letterB;
  };

  const dim1 = getDimensionLetter('Energy', 'E', 'I');
  const dim2 = getDimensionLetter('Information', 'S', 'N');
  const dim3 = getDimensionLetter('Decision', 'T', 'F');
  const dim4 = getDimensionLetter('Lifestyle', 'J', 'P');

  return `${dim1}${dim2}${dim3}${dim4}`;
};
