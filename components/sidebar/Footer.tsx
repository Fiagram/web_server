import { signOutAccount } from '@/lib/actions/account.actions'
import { clearAccessToken } from '@/lib/auth/token'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const Footer = ({ account }: { account: Account }) => {
  const router = useRouter();

  const SignOutHandler = async () => {
    // signOutAccount already calls clearAccessToken() internally, but we
    // also call it here as a safety net so the UI never keeps a stale token.
    clearAccessToken();
    const loggedOut = await signOutAccount();

    // Redirect regardless — even if the server call failed the local session
    // has been wiped, so the user should land on the sign-in page.
    if (loggedOut) {
      router.push('/sign-in');
    } else {
      // Force a full navigation to ensure all client state is reset.
      window.location.href = '/sign-in';
    }
  }

  return (
    <footer className="flex flex-row items-center justify-between gap-2">
      <div className='flex flex-col items-start justify-center bg-sb-bg max-xl:hidden'>
        <p className='text-20 font-bold text-sb-fg'>
          {account?.username}
        </p>
        <h1 className="text-14 truncate text-sb-fg font-semibold">
          {account?.fullname}
        </h1>
      </div>

      <div className="relative cursor-pointer size-5 max-xl:w-full max-xl:flex max-xl:justify-center 
          max-xl:items-center" onClick={SignOutHandler}>
        <Image src="icons/logout.svg" fill alt="jsm" />
      </div>
    </footer>
  )
}

export default Footer