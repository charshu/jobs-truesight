// this file describe all
// type that use in application


export type User = {
  id: string
  email: string
  profile: any
  results:Result[]
}

// TODO: add and design more type
// in application
export type TestSheet = {
  id: number
  uid : string
  title: string
  questions: Question[]
}

export type Question = {
  id: string
  title: string
  factor_name: string
  choices: Choice[]
}
export type Choice = {
  id: string
  title: string
  value: number
}
export type AnswerSheet = {
  id?: number
  testSheetUid: string
  userId?: string
  jobId?: number
  workPlaceId?: string
  createdAt?:number
  updatedAt?:number
  done: boolean
  answers: Answer[]
}
export type Answer = {
  questionId: string
  selectedChoiceId: string
}
export type Factor = {
  name:string
  value:number
  question_counter:number
}
export type Result = {
  testSheetUid:string
  factors:Factor[]
  question_counter:number
}
export type Job = {
  id: number
  name: string
  createdAt?:Date
  updatedAt?:Date
  results?:Result[]
  answers?:Answer[]
}

export type WorkPlace = {
  id:string
  results?:Result[]
  answers?:Answer[]
}
