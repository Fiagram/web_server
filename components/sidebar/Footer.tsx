import { logoutAccount } from '@/lib/actions/account.actions'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const Footer = ({ account }: { account: Account }) => {
  const router = useRouter();

  const LogOutHandler = async () => {
    const loggedOut = await logoutAccount();
    if (loggedOut) router.push('/sign-in')
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
          max-xl:items-center" onClick={LogOutHandler}>
        <Image src="icons/logout.svg" fill alt="jsm" />
      </div>
    </footer>
  )
}

export default Footer