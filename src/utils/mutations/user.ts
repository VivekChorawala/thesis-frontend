export const signUpMutation = `
mutation UserSignup($userSignupInput: UserInput) {
    userSignup(input: $userSignupInput) {
        statusCode
        message
    }
}
`;

export const signInMutation = `
mutation UserSignIn($userSignInInput: UserSignInInput) {
    userSignIn(input: $userSignInInput) {
      statusCode
      message
      data {
        id
        last_name
        first_name
        email
        role
        status
        token
        subject_id
        subject_name
      }
    }
}`;

export const updateStatus = `mutation UpdateUserStatus($updateUserId: Int) {
  updateUserStatus(id: $updateUserId) {
    statusCode
    message
  }
}`;

export const deleteProfessor = `mutation DeleteUser($deleteUserId: Int) {
  deleteUser(id: $deleteUserId) {
    statusCode
    message
  }
}`;


export const forgotPassoword = `
mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email) {
    message
    statusCode
  }
}
`


export const resetPassword = `
mutation ResetPassword($input: ReserPasswordInput!) {
  resetPassword(input: $input) {
    statusCode
    message
  }
}
`

export const logoutUser = `
mutation Mutation($logoutUserId: Int, $token: String!) {
  logoutUser(id: $logoutUserId, token: $token) {
    statusCode
    message
  }
}
`
