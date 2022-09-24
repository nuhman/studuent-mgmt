import { TableRow } from "../interfaces";
import { Student } from "../redux/types";

export const transformStudentList = (students: Array<Student>): Array<TableRow> => {
    return (students || []).map(student => {
        return {
            id: student.ID,
            values: [`${student.firstName} ${student.lastName}`, (student.country || student.nationality?.Title), student.dateOfBirth]
        }
    })
}
