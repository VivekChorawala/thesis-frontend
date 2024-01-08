export const getAllSubjectsWithoutAuth = `query Query($filter: SubjectFilter) {
    subjects(filter: $filter) {
        status
        message
        data {
        id
        name
        description
        status
        }
    }
}`;
export const allSubjects = `query Query($filter: SubjectFilter) {
    allSubjects(filter: $filter) {
        status
        message
        data {
        id
        name
        description
        status
        }
    }
}`;
export const individualSubject = `query Subject($subjectId: Int) {
    subject(id: $subjectId) {
        status
        message
        data {
            id
            name
            description
            status
            professor {
                first_name
                last_name
                email
            }
        }
    }
}`;