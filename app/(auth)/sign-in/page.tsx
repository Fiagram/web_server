import AuthForm from '@/components/auth/AuthForm'

const SignIn = () => {
    return (
        <section className="flex-center size-full max-sm:px-6">
            <AuthForm type="SIGN_IN" />
        </section>
    )
}

export default SignIn