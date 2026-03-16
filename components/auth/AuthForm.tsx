'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { API_BASE_URL } from '@/lib/api'
import { setAccessToken } from '@/lib/auth/token'
import { saveAccount } from '@/lib/auth/account'

type ErrorsType = {
    username?: string
    password?: string
    fullname?: string
    email?: string
    countryCode?: string
    phoneNumber?: string
    isRememberMe?: string
}

const AuthForm = ({ type }: { type: "SIGN_IN" | "SIGN_UP" }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [isRememberMe, setIsRememberMe] = useState(false)
    const [fullname, setFullname] = useState('')
    const [email, setEmail] = useState('')
    const [countryCode, setCountryCode] = useState('+84')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [errors, setErrors] = useState<ErrorsType>({})
    const [isLoading, setIsLoading] = useState(false)

    const validateUsername = (value: string) => {
        if (!value.trim()) return 'Username is required'
        if (value.length < 5) return 'Username must be at least 5 characters'
        if (value.length > 20) return 'Username must be at most 20 characters'
        const usernameRegex = /^(?=.{5,20}$)(?!.*[_.]{2})[a-zA-Z0-9]+([._]?[a-zA-Z0-9]+)*$/
        if (!usernameRegex.test(value)) {
            return `Username must contain letters and numbers, 
                    optional single dots or underscores between characters, 
                    no consecutive dots/underscores`
        }
        return ''
    }

    const validatePassword = (value: string) => {
        if (!value) return 'Password is required'
        if (value.length < 8) return 'Password must be at least 8 characters'
        if (value.length > 72) return 'Password must be at most 72 characters'
        // Pattern: at least one uppercase, one lowercase, one digit, and one special character; no whitespace
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])\S{8,72}$/
        if (!passwordRegex.test(value)) {
            return `Password must contain uppercase, lowercase, 
                    digit, and special character (no spaces)`
        }
        return ''
    }

    const validateEmail = (value: string) => {
        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
        if (!emailRegex.test(value)) return 'Please enter a valid email address'
        return ''
    }

    const validateCountryCode = (value: string) => {
        if (!value) return ''
        const countryCodeRegex = /^\+\d{1,3}$/
        if (!countryCodeRegex.test(value)) return 'Country code must be in format +XXX'
        return ''
    }

    const validatePhoneNumber = (value: string) => {
        if (!value) return ''
        const phoneRegex = /^\d{6,12}$/
        if (!phoneRegex.test(value)) return 'Phone number must be 6-12 digits'
        return ''
    }

    const validateFullname = (value: string) => {
        if (!value.trim()) return 'Full name is required'
        if (value.length < 5) return 'Full name must be at least 5 characters'
        if (value.length > 200) return 'Full name must be at most 200 characters'
        return ''
    }

    const validateForm = () => {
        const newErrors: ErrorsType = {}

        const usernameError = validateUsername(username)
        if (usernameError) newErrors.username = usernameError

        const passwordError = validatePassword(password)
        if (passwordError) newErrors.password = passwordError

        if (type === 'SIGN_UP') {
            const fullnameError = validateFullname(fullname)
            if (fullnameError) newErrors.fullname = fullnameError

            const emailError = validateEmail(email)
            if (emailError) newErrors.email = emailError

            if (phoneNumber) {
                const countryCodeError = validateCountryCode(countryCode)
                if (countryCodeError) newErrors.countryCode = countryCodeError

                const phoneError = validatePhoneNumber(phoneNumber)
                if (phoneError) newErrors.phoneNumber = phoneError
            }
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setIsLoading(true)
        try {
            if (type === 'SIGN_IN') {
                const response = await fetch(`${API_BASE_URL}/auth/signin`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        username,
                        password,
                        isRememberMe,
                    })
                })

                if (!response.ok) {
                    const errorData = await response.json()
                    setErrors({ username: errorData.message || 'Sign in failed' })
                    return
                }

                const data: SigninResponse = await response.json()
                // Persist access token + exp and schedule silent refresh
                if (data.accessToken?.token && data.accessToken?.exp) {
                    setAccessToken(data.accessToken.token, data.accessToken.exp)
                }
                // Persist account info for server + client reads
                if (data.account) {
                    saveAccount(data.account)
                }
                // Redirect to home page
                window.location.href = '/'
            } else {
                const response = await fetch(`${API_BASE_URL}/auth/signup`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        account: {
                            username,
                            fullname,
                            email,
                            phoneNumber: {
                                countryCode,
                                number: phoneNumber,
                            },
                            role: 'member',
                        },
                        password,
                    })
                })

                if (!response.ok) {
                    const errorData = await response.json()
                    setErrors({ username: errorData.message || 'Sign up failed' })
                    return
                }

                const data: SignupResponse = await response.json()
                // Persist access token + exp and schedule silent refresh
                if (data.accessToken?.token && data.accessToken?.exp) {
                    setAccessToken(data.accessToken.token, data.accessToken.exp)
                }
                // SignupResponse has no account field — construct from form data
                saveAccount({
                    username,
                    fullname,
                    email,
                    phoneNumber: { countryCode, number: phoneNumber },
                    role: 'member',
                })
                // Redirect to home page
                window.location.href = '/'
            }
        } catch (error) {
            setErrors({ username: 'An error occurred. Please try again.' })
            console.error('Auth error:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const isSignUp = type === 'SIGN_UP'
    const buttonText = isSignUp ? 'Sign Up' : 'Sign In'
    const loadingText = isSignUp ? 'Signing up...' : 'Signing in...'

    const labelClassName = `block text-fg text-sm font-medium mb-2`
    const inputClassName = `flex h-10 w-full rounded-md border border-pri
                    bg-bg px-4 py-2 text-sm placeholder:text-fg-muted focus-visible:outline`
    const invalidClassName = `text-xs font-medium text-utils-error mt-2`
    const linkClassName = `font-semibold text-pri hover:underline`

    return (
        <section className='container flex flex-col w-full max-w-md gap-10'>
            <div className='flex flex-col flex-center gap-1'>
                <div className='flex-center flex-row gap-2'>
                    <Image
                        src="/icons/logo.svg"
                        width={35}
                        height={35}
                        alt="Fiagram logo"
                        className="size-8"
                    />
                    <h1 className='text-30 font-bold'>Fiagram</h1>
                </div>
                <p className='text-16'>
                    {isSignUp ? 'Create a new account' : 'Sign in to your account'}
                </p>
            </div>

            <form onSubmit={handleSubmit} className='space-y-4'>
                {isSignUp && (
                    <div>
                        <label htmlFor='fullname' className={labelClassName}>
                            Full Name
                        </label>
                        <input
                            id='fullname'
                            type='text'
                            placeholder='5-200 characters'
                            value={fullname}
                            onChange={(e) => {
                                setFullname(e.target.value)
                                if (errors.fullname) setErrors({ ...errors, fullname: undefined })
                            }}
                            className={cn(inputClassName,
                                { "text-utils-error border-utils-error": errors.fullname }
                            )}
                        />
                        {errors.fullname && (
                            <p className={invalidClassName}>{errors.fullname}</p>
                        )}
                    </div>
                )}

                <div>
                    <label htmlFor='username' className={labelClassName}>
                        Username
                    </label>
                    <input
                        id='username'
                        type='text'
                        placeholder='5-20 characters'
                        value={username}
                        onChange={(e) => {
                            setUsername(e.target.value)
                            if (errors.username) setErrors({ ...errors, username: undefined })
                        }}
                        className={cn(inputClassName,
                            { "text-utils-error border-utils-error": errors.username }
                        )}
                    />
                    {errors.username && (
                        <p className={invalidClassName}>{errors.username}</p>
                    )}
                </div>

                <div>
                    <label htmlFor='password' className={labelClassName}>
                        Password
                    </label>
                    <input
                        id='password'
                        type='password'
                        placeholder='8-72 characters, uppercase, lowercase, digit, and special character'
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value)
                            if (errors.password) setErrors({ ...errors, password: undefined })
                        }}
                        className={cn(inputClassName,
                            { "text-utils-error border-utils-error": errors.password }
                        )}
                    />
                    {errors.password && (
                        <p className={invalidClassName}>{errors.password}</p>
                    )}
                </div>

                {isSignUp && (
                    <>
                        <div>
                            <label htmlFor='email' className={labelClassName}>
                                Email
                            </label>
                            <input
                                id='email'
                                type='email'
                                placeholder='user@example.com'
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value)
                                    if (errors.email) setErrors({ ...errors, email: undefined })
                                }}
                                className={cn(inputClassName,
                                    { "text-utils-error border-utils-error": errors.email }
                                )}
                            />
                            {errors.email && (
                                <p className={invalidClassName}>{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label className={labelClassName}>
                                Phone Number <span className='text-muted-foreground text-xs'>(optional)</span>
                            </label>
                            <div className='flex flex-row gap-2'>
                                <input
                                    id='countryCode'
                                    type='text'
                                    placeholder='+84'
                                    value={countryCode}
                                    onChange={(e) => {
                                        setCountryCode(e.target.value)
                                        if (errors.countryCode) setErrors({ ...errors, countryCode: undefined })
                                    }}
                                    className={cn(inputClassName, "min-w-20 flex-0",
                                        { "text-utils-error border-utils-error": errors.countryCode }
                                    )}
                                />
                                <input
                                    id='phoneNumber'
                                    type='tel'
                                    placeholder='909234567'
                                    value={phoneNumber}
                                    onChange={(e) => {
                                        setPhoneNumber(e.target.value)
                                        if (errors.phoneNumber) setErrors({ ...errors, phoneNumber: undefined })
                                    }}
                                    className={cn(inputClassName, "flex-1",
                                        { "text-utils-error border-utils-error": errors.phoneNumber }
                                    )}
                                />
                            </div>
                            {errors.countryCode && (
                                <p className={invalidClassName}>{errors.countryCode}</p>
                            )}
                            {errors.phoneNumber && (
                                <p className={invalidClassName}>{errors.phoneNumber}</p>
                            )}
                        </div>
                    </>
                )}

                {!isSignUp && (
                    <div className='flex items-center'>
                        <input
                            id='isRememberMe'
                            type='checkbox'
                            checked={isRememberMe}
                            onChange={(e) => setIsRememberMe(e.target.checked)}
                            className='h-4 w-4 rounded border-input'
                        />
                        <label htmlFor='isRememberMe' className='ml-2 text-sm font-medium'>
                            Remember me
                        </label>
                    </div>
                )}

                <button
                    type='submit'
                    disabled={isLoading}
                    className='flex-center rounded-4xl text-sm font-medium transition-colors 
                         focus-visible:bg-green-500 cursor-pointer bg-pri text-fg h-10 px-4 py-2 w-full
                         disabled:pointer-events-none disabled:opacity-50'
                >
                    {isLoading ? loadingText : buttonText}
                </button>
            </form>

            <div className='mb-20 text-center'>
                <p className='text-sm text-fg-muted'>
                    {isSignUp ? (
                        <>
                            Already have an account?{' '}
                            <Link
                                href='/sign-in'
                                className={linkClassName}
                            >
                                Sign in
                            </Link>
                        </>
                    ) : (
                        <>
                            Don't have an account?{' '}
                            <Link
                                href='/sign-up'
                                className={linkClassName}
                            >
                                Sign up
                            </Link>
                        </>
                    )}
                </p>
            </div>

            <div className='mt-auto flex-center flex-row text-sm text-fg-muted'>
                Copyright &copy; 2026 Fiagram. All rights reserved.
            </div>
        </section>
    )
}

export default AuthForm