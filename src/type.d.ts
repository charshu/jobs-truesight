// this file describe all
// type that use in application


export type User = {
  email: string;
  profile: any
}

// TODO: add and design more type
// in application
export type Survay = {
  title: string;
  question: Question[]
}

export type Question = {
  name: string;
  value: string;
}
