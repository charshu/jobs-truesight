// this file describe all
// type that use in application


export type User = {
  id: String,
  email: String,
  profile: any
}

// TODO: add and design more type
// in application
export type TestSheet = {
  id: Number,
  title: String,
  question: Question[]
}

export type Question = {
  id: Number,
  title: String,
  factor: String,
  choices: Choice[]
}
export type Choice = {
  title: String,
  value: Number
}
export type AnswerSheet = {
  id: Number,
  testSheetUid: String,
  userId: String,
  jobId: Number,
  workPlaceId: String,
  answers: Answer[]
}
export type Answer = {
  questionId: Number,
  selectChoice: Choice
}