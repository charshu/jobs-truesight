// this file describe all
// type that use in application


export type User = {
  id?: string
  email?: string
  profile?: any
  results?: number[]
  answerSheets?:AnswerSheet[]
}

// TODO: add and design more type
// in application
export type TestSheet = {
  id: number
  uid : string
  title: string
  picture: string
  criterias: Criteria[]
  doneCounter: number
  questions: Question[]
}
export type Criteria = {
  factorName: string
  factorNameTH: string
  ranges: Range[]
}
export type Range = {
  min: number
  result: string
}

export type Question = {
  id: string
  title: string
  factorName: string
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
  job?: Job
  workPlace?: WorkPlace
  createdAt?:number
  updatedAt?:number
  salary?:number
  done?: boolean
  answers?: Answer[]
}
export type Answer = {
  questionId: string
  selectedChoiceId: string
}
export type Factor = {
  name:string
  value:number
  question_counter:number
  max:number
  min:number
}
export type Result = {
  testSheetUid?: string
  jobId?: number
  job?: Job
  factors?:Factor[]
}
export type Job = {
  id?: number
  name?: string
  createdAt?:Date
  updatedAt?:Date
  results?:Result[]
  answerSheets?:AnswerSheet[]
}

export type WorkPlace = {
  id?:string
  name?:string
  viewCount?:number
  participant?:{
    male:number
    female:number
    ages:number[]
  }
  factorsAvailable?:string[]
  results?:Result[]
  answerSheets?:AnswerSheet[]
}

