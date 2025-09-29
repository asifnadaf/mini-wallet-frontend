/**
 * Centralized Labels Management
 * All text content, labels, and messages for the application
 */

export const labels = {
    // Application
    app: {
        name: 'Mini Wallet',
        title: 'Mini Wallet - Digital Wallet Application',
        subtitle: 'Digital Wallet Application'
    },

    // Navigation
    navigation: {
        dashboard: 'Dashboard',
        transactions: 'Transactions',
        profile: 'Profile',
        logout: 'Logout',
        login: 'Sign In',
        register: 'Sign Up'
    },

    // Authentication
    auth: {
        login: {
            title: 'Sign in to your account',
            subtitle: 'Or',
            createAccount: 'create a new account',
            email: 'Email address',
            password: 'Password',
            forgotPassword: 'Forgot your password?',
            signIn: 'Sign in',
            signingIn: 'Signing in...',
            emailPlaceholder: 'Enter your email',
            passwordPlaceholder: 'Enter your password'
        },
        register: {
            title: 'Create your account',
            subtitle: 'Or',
            signIn: 'sign in to your existing account',
            name: 'Full Name',
            email: 'Email address',
            password: 'Password',
            confirmPassword: 'Confirm Password',
            createAccount: 'Create Account',
            creating: 'Creating Account...',
            namePlaceholder: 'Enter your full name',
            emailPlaceholder: 'Enter your email',
            passwordPlaceholder: 'Enter your password',
            confirmPasswordPlaceholder: 'Confirm your password'
        },
        forgotPassword: {
            title: 'Forgot your password?',
            subtitle: 'Enter your email address and we\'ll send you an OTP to reset your password.',
            email: 'Email address',
            sendOtp: 'Send OTP',
            sending: 'Sending...',
            emailPlaceholder: 'Enter your email address',
            backToLogin: 'Back to login'
        },
        forgotPasswordVerifyOtp: {
            title: 'Verify OTP',
            subtitle: 'Enter the 6-digit code sent to your email',
            otp: 'Enter OTP',
            verify: 'Verify OTP',
            verifying: 'Verifying...',
            resend: 'Resend OTP',
            resending: 'Resending...',
            backToLogin: 'Back to Sign In'
        },
        forgotPasswordReset: {
            title: 'Reset Password',
            subtitle: 'Enter your new password',
            newPassword: 'New Password',
            confirmPassword: 'Confirm New Password',
            resetPassword: 'Reset Password',
            resetting: 'Resetting...',
            newPasswordPlaceholder: 'Enter new password',
            confirmPasswordPlaceholder: 'Confirm new password',
            backToLogin: 'Back to login'
        },
        emailVerification: {
            title: 'Verify Your Email',
            subtitle: 'We\'ve sent a 6-digit verification code to your email address. Please enter it below.',
            otp: 'Enter verification code',
            verify: 'Verify Email',
            verifying: 'Verifying...',
            resend: 'Resend Code',
            resending: 'Resending...',
            backToLogin: 'Didn\'t receive the code? Check your spam folder or resend.'
        }
    },

    // Dashboard
    dashboard: {
        welcome: 'Welcome back, {{name}}!',
        subtitle: 'Manage your transactions and wallet settings from your dashboard.',
        accountBalance: 'Account Balance',
        availableBalance: 'Available balance',
        recentTransactions: 'Recent Transactions',
        viewAll: 'View all',
        noTransactions: 'No recent transactions',
        noTransactionsSubtitle: 'Your recent transactions will appear here',
        newTransfer: 'New Transfer',
        createTransfer: 'Create a new transfer',
        transactions: 'Transactions',
        viewTransactions: 'View and manage your transactions',
        profile: 'Profile',
        manageProfile: 'Manage your account settings'
    },

    // Transactions
    transactions: {
        title: 'Transactions',
        sendMoney: 'Send Money',
        noTransactions: 'No transactions',
        noTransactionsSubtitle: 'Get started by sending money.',
        sentTo: 'Sent to',
        receivedFrom: 'Received from',
        fee: 'Fee',
        showing: 'Showing {{from}} to {{to}} of {{total}} results',
        previous: 'Previous',
        next: 'Next',
        page: 'Page {{page}}'
    },

    // Create Transaction
    createTransaction: {
        title: 'Send Money',
        subtitle: 'Transfer money to another user\'s wallet',
        backToTransactions: '← Back to Transactions',
        receiverId: 'Receiver ID',
        receiverIdPlaceholder: 'Enter receiver user ID',
        receiverIdHelp: 'Enter the user ID of the person you want to send money to',
        amount: 'Transfer Amount',
        amountPlaceholder: '0.00',
        amountHelp: 'Enter the amount you want to send',
        transferInfo: 'Transfer Information',
        transferInfoText: 'This will transfer money from your wallet to another user\'s wallet. A commission fee of 1.5% will be deducted from your account.',
        cancel: 'Cancel',
        sendMoney: 'Send Money',
        sending: 'Sending...'
    },

    // Profile
    profile: {
        title: 'Profile Information',
        name: 'Name',
        email: 'Email',
        emailVerificationStatus: 'Email Verification Status',
        emailVerified: 'Email Verified',
        emailNotVerified: 'Email Not Verified',
        emailNotVerifiedWarning: 'Please verify your email to access all features including password changes.',
        verifyEmail: 'Verify Email',
        accountBalance: 'Account Balance',
        changePassword: 'Change Password',
        currentPassword: 'Current Password',
        newPassword: 'New Password',
        confirmPassword: 'Confirm New Password',
        updatePassword: 'Update Password',
        updating: 'Updating...',
        currentPasswordPlaceholder: 'Enter current password',
        newPasswordPlaceholder: 'Enter new password',
        confirmPasswordPlaceholder: 'Confirm new password'
    },

    // Common
    common: {
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        cancel: 'Cancel',
        save: 'Save',
        edit: 'Edit',
        delete: 'Delete',
        confirm: 'Confirm',
        back: 'Back',
        next: 'Next',
        previous: 'Previous',
        close: 'Close',
        submit: 'Submit',
        reset: 'Reset',
        clear: 'Clear',
        search: 'Search',
        filter: 'Filter',
        sort: 'Sort',
        refresh: 'Refresh',
        retry: 'Retry',
        continue: 'Continue',
        finish: 'Finish',
        done: 'Done',
        ok: 'OK',
        yes: 'Yes',
        no: 'No'
    },

    // Messages
    messages: {
        success: {
            login: 'Login successful!',
            register: 'Registration successful! Please verify your email.',
            emailVerified: 'Email verified successfully!',
            passwordReset: 'Password reset successfully! You can now login with your new password.',
            passwordChanged: 'Password changed successfully!',
            transferSent: 'Transfer sent successfully!',
            otpSent: 'OTP sent to your email!',
            otpVerified: 'OTP verified successfully!'
        },
        error: {
            login: 'Login failed. Please try again.',
            register: 'Registration failed. Please try again.',
            emailVerification: 'Email verification failed. Please try again.',
            passwordReset: 'Password reset failed. Please try again.',
            transferFailed: 'Transfer failed. Please try again.',
            otpInvalid: 'Invalid OTP. Please try again.',
            otpExpired: 'OTP has expired. Please request a new one.',
            networkError: 'Network error. Please check your connection.',
            serverError: 'Server error. Please try again later.',
            validationError: 'Please check your input and try again.',
            unauthorized: 'You are not authorized to perform this action.',
            forbidden: 'Access denied.',
            notFound: 'The requested resource was not found.',
            timeout: 'Request timed out. Please try again.'
        },
        validation: {
            required: 'This field is required',
            email: 'Please enter a valid email address',
            password: 'Password must be at least 8 characters',
            passwordMatch: 'Passwords do not match',
            otpLength: 'Please enter all 6 digits',
            otpValid: 'Please enter a valid 6-digit code',
            amountPositive: 'Amount must be greater than 0',
            receiverIdValid: 'Valid receiver ID is required'
        }
    },

    // Form Labels
    forms: {
        email: 'Email',
        password: 'Password',
        confirmPassword: 'Confirm Password',
        name: 'Name',
        amount: 'Amount',
        receiverId: 'Receiver ID',
        otp: 'OTP',
        currentPassword: 'Current Password',
        newPassword: 'New Password'
    },

    // Status
    status: {
        loading: 'Loading...',
        success: 'Success',
        error: 'Error',
        warning: 'Warning',
        info: 'Information',
        pending: 'Pending',
        completed: 'Completed',
        failed: 'Failed',
        cancelled: 'Cancelled'
    }
}

/**
 * Get label with optional interpolation
 * @param {string} path - Dot notation path to the label
 * @param {object} data - Data for interpolation
 * @returns {string} - The label text
 */
export function getLabel(path, data = {}) {
    const keys = path.split('.')
    let value = labels

    for (const key of keys) {
        if (value && typeof value === 'object' && key in value) {
            value = value[key]
        } else {
            return path // Return path if not found
        }
    }

    if (typeof value === 'string') {
        // Simple interpolation for {{key}} patterns
        return value.replace(/\{\{(\w+)\}\}/g, (match, key) => {
            return data[key] || match
        })
    }

    return value
}

/**
 * Get nested label safely
 * @param {string} path - Dot notation path to the label
 * @param {string} fallback - Fallback text if label not found
 * @returns {string} - The label text or fallback
 */
export function getLabelSafe(path, fallback = '') {
    try {
        const result = getLabel(path)
        return result !== path ? result : fallback
    } catch (error) {
        return fallback
    }
}

export default labels
