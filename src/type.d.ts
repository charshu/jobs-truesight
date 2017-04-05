// this file describe all
// type that use in application


export type User = {
  id: string,
  email: string,
  profile: any
}

// TODO: add and design more type
// in application
export type TestSheet = {
  id: number,
  uid : string,
  title: string,
  questions: Question[]
}

export type Question = {
  id: string,
  title: string,
  factor: string,
  choices: Choice[]
}
export type Choice = {
  id: string
  title: string,
  value: number
}
export type AnswerSheet = {
  id: number,
  testSheetUid: string,
  userId: string,
  jobId: Number,
  workPlaceId: string,
  createdAt:number,
  updatedAt:number,
  done: Boolean,
  answers: Answer[]
}
export type Answer = {
  questionId: string,
  selectedChoiceId: string
}
export type Factor = {
  factor:string,
  value:number
}
export type Result = {
  testSheetUid:string,
  factors:Factor[]
}
export type Job = {
  id: number,
  name: string,
  createdAt:Date,
  updatedAt:Date,
  results:Result[],
  answers:Answer[]
}

export type WorkPlace = {
  id:string,
  results:Result[],
  answers:Answer[]
}
