export const createExamMutation = `
mutation Mutation($input: ExamInput!) {
  createExam(input: $input) {
    message
    status
  }
}
`;


export const deleteExamMutation = `
mutation Mutation($deleteExamId: Int) {
  deleteExam(id: $deleteExamId) {
    message
    status
  }
}`


export const editExamMutation = `
mutation UpdateExam($input: ExamInput!, $updateExamId: Int) {
  updateExam(input: $input, id: $updateExamId) {
    message
    status
  }
}`


export const changeExamStatusMutation = `
mutation UpdateExamStatus($updateExamStatusId: Int) {
  updateExamStatus(id: $updateExamStatusId) {
    message
    status
  }
}
`

export const joinExamMutation = `mutation JoinExam($joinExamInput: StudentExamInput!) {
  joinExam(input: $joinExamInput) {
    status
    message
    data {
      subject
      professor
      exam
      questions {
        id
        question
        answer {
          option_id
        }
        option {
          id
          option
        }
      }
    }
  }
}`

export const captureAnswer = `mutation CaptureAnswer($captureAnswerInput: CaptureAnswerInput!) {
  captureAnswer(input: $captureAnswerInput) {
    message
    status
  }
}`;

export const saveExamMutation = `mutation SaveExam($saveExamInput: StudentExamInput!) {
  saveExam(input: $saveExamInput) {
    message
    status
  }
}`;

export const checkExamValidity = `mutation CheckExamValidity($checkExamValidityInput: ValidateExam!) {
  checkExamValidity(input: $checkExamValidityInput) {
    message
    status
  }
}`;

export const getResultMutation = `mutation GetResult($getResultInput: StudentExamInput!) {
  getResult(input: $getResultInput) {
    status
    message
    data {
      student
      exam
      subject
      exam_duration
      youSpent
      result
      total_questions
      questions {
        id
        question
        answer {
          id
          option_id {
            id
            option
          }
        }
        option {
          id
          option
          answer
        }
      }
    }
  }
}`;

export const checkExamCodeMutation = `mutation CheckExamCode($checkExamCodeInput: CheckExamCode!) {
  checkExamCode(input: $checkExamCodeInput) {
    message
    status
  }
}`