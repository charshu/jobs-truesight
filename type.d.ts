// this file describe all
// type that use in application


export type User = {
  id: string;
  firstname: string;
  lastname: string
}

// TODO: add and design more type
// in application
export type Survay = {
  title: string;
  question: question[]
}

export type Question = {
  name: string;
  value: string;
}
