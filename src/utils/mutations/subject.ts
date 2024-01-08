export const createSubjectMutation = `
mutation Mutation($input: SubjectInput!) {
    createSubject(input: $input) {
      message
      status
    }
}`;

export const editSubjectMutation = `
mutation UpdateSubject($input: SubjectInput!, $updateSubjectId: Int) {
    updateSubject(input: $input, id: $updateSubjectId) {
      message
      status
    }
}`;

export const updateStatusMutation = `mutation UpdateSubjectStatus($updateSubjectId: Int) {
  updateSubjectStatus(id: $updateSubjectId) {
    status
    message
  }
}`;

export const deleteSubjectMutation = `mutation DeleteSubject($deleteSubjectId: Int) {
    deleteSubject(id: $deleteSubjectId) {
      message
      status
    }
}`;