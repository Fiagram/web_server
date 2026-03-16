'use client'

import { signOutAccount } from '@/lib/actions/account.actions'
import { clearAccessToken } from '@/lib/auth/token'
import { getAccountFromStorage } from '@/lib/auth/account'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const Footer = () => {
  const router = useRouter();
  const [account, setAccount] = useState<Account | null>(null);

  useEffect(() => {
    const stored = getAccountFromStorage();
    if (!stored) {
      router.push('/sign-in');
      return;
    }
    setAccount(stored);
  }, [router]);

  const SignOutHandler = async () => {
    clearAccessToken();
    const loggedOut = await signOutAccount();
    if (loggedOut) {
      router.push('/sign-in');
    } else {
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
        <Image src="icons/logout.svg" fill alt="logout" />
      </div>
    </footer>
  )
}

export default Footer