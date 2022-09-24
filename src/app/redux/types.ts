
export enum Relation {
  Parent = 'Parent',
  Sibling = 'Sibling',
  Father = 'Father',
  Mother = 'Mother',
  Brother = 'Brother',
  Sister = 'Sister',
}

export interface FamilyMember {
  ID: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  relation?: Relation | string;
  relationship?: string;
  country?: string;
  nationality: Nationality;
}

export interface Nationality {
  ID: number;
  Title: string;
}

export interface Student {
  ID: number;
  firstName: string;
  lastName: string;
  country?: string;
  nationality?: Nationality;
  dateOfBirth: string;
  familyMembers?: Array<FamilyMember>;
}

export interface StudentList {
  students: Array<Student>;
  loading: boolean;
  hasError: boolean;
}

export interface Nationality {
  ID: number;
  Title: string;
}

export interface NationalityList {
  nationalities: Array<Nationality>;
  loading: boolean;
  hasError: boolean;
}

export type StuentListStateModel = StudentList;
