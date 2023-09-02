export type Question = {
  question: string
  answers: string[]
  correctAnswer: number
}

export type QuestionsList = {
  zhTW: Question[]
  enUS: Question[]
}