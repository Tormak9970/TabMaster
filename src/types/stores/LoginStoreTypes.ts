// Types for the global loginStore

export type LoginResult = 0 | 1

export type LoginState = 0 | 1 | 7

export type LoginStore = {
    m_strAccountName: string
    accountName: string
    m_bSecureComputer: boolean //? Does the user use a passcode
    secureComputer: boolean
    m_eLoginState: LoginState
    m_eLoginResult: LoginResult
    loginState: LoginState
}
