'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

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

    const validateEmail = (value: string, isRequired: boolean = false) => {
        if (!value) {
            return isRequired ? 'Email is required' : ''
        }
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

            const emailError = validateEmail(email, false)
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
                console.log('Sign in with:', { username, password, isRememberMe })
                // TODO: Call /auth/signin endpoint
            } else {
                const account = {
                    username,
                    fullname,
                    email: email || undefined,
                    phoneNumber: phoneNumber ? { countryCode, number: phoneNumber } : undefined,
                    role: 'member'
                }
                console.log('Sign up with:', { account, password })
                // TODO: Call /auth/signup endpoint
            }
        } finally {
            setIsLoading(false)
        }
    }

    const isSignUp = type === 'SIGN_UP'
    const buttonText = isSignUp ? 'Sign Up' : 'Sign In'
    const loadingText = isSignUp ? 'Signing up...' : 'Signing in...'

    const inputClassName = 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'

    return (
        <section className='flex flex-col w-full max-w-md gap-10'>
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
                        <label htmlFor='fullname' className='block text-sm font-medium mb-2'>
                            Full Name
                        </label>
                        <input
                            id='fullname'
                            type='text'
                            placeholder='Enter your full name'
                            value={fullname}
                            onChange={(e) => {
                                setFullname(e.target.value)
                                if (errors.fullname) setErrors({ ...errors, fullname: undefined })
                            }}
                            className={inputClassName}
                        />
                        {errors.fullname && (
                            <p className='text-xs font-medium text-utils-error mt-1'>{errors.fullname}</p>
                        )}
                    </div>
                )}

                <div>
                    <label htmlFor='username' className='block text-sm font-medium mb-2'>
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
                        className={inputClassName}
                    />
                    {errors.username && (
                        <p className='text-xs font-medium text-utils-error mt-1'>{errors.username}</p>
                    )}
                </div>

                <div>
                    <label htmlFor='password' className='block text-sm font-medium mb-2'>
                        Password
                    </label>
                    <input
                        id='password'
                        type='password'
                        placeholder='8-72 characters with uppercase, lowercase, digit, and special character'
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value)
                            if (errors.password) setErrors({ ...errors, password: undefined })
                        }}
                        className={inputClassName}
                    />
                    {errors.password && (
                        <p className='text-xs font-medium text-utils-error mt-1'>{errors.password}</p>
                    )}
                </div>

                {isSignUp && (
                    <>
                        <div>
                            <label htmlFor='email' className='block text-sm font-medium mb-2'>
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
                                className={inputClassName}
                            />
                            {errors.email && (
                                <p className='text-xs font-medium text-utils-error mt-1'>{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label className='block text-sm font-medium mb-2'>
                                Phone Number <span className='text-muted-foreground text-xs'>(optional)</span>
                            </label>
                            <div className='flex gap-2'>
                                <input
                                    id='countryCode'
                                    type='text'
                                    placeholder='+84'
                                    value={countryCode}
                                    onChange={(e) => {
                                        setCountryCode(e.target.value)
                                        if (errors.countryCode) setErrors({ ...errors, countryCode: undefined })
                                    }}
                                    className={`${inputClassName} w-20 flex-shrink-0`}
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
                                    className={`${inputClassName} flex-1`}
                                />
                            </div>
                            {errors.countryCode && (
                                <p className='text-xs font-medium text-utils-error mt-1'>{errors.countryCode}</p>
                            )}
                            {errors.phoneNumber && (
                                <p className='text-xs font-medium text-utils-error mt-1'>{errors.phoneNumber}</p>
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
                    className='inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full'
                >
                    {isLoading ? loadingText : buttonText}
                </button>
            </form>

            <div className='mt-6 text-center'>
                <p className='text-sm text-muted-foreground'>
                    {isSignUp ? (
                        <>
                            Already have an account?{' '}
                            <Link
                                href='/sign-in'
                                className='font-semibold text-fg hover:underline'
                            >
                                Sign in here
                            </Link>
                        </>
                    ) : (
                        <>
                            Don't have an account?{' '}
                            <Link
                                href='/sign-up'
                                className='font-semibold text-fg hover:underline'
                            >
                                Sign up here
                            </Link>
                        </>
                    )}
                </p>
            </div>
        </section>
    )
}

export default AuthForm