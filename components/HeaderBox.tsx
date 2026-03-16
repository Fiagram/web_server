'use client';

import { useEffect, useState } from 'react';
import { getSignedInAccount } from '@/lib/actions/account.actions';

const HeaderBox = ({ title, subtext }: {
  title: string;
  subtext: string;
}) => {
  const [username, setUsername] = useState<string | undefined>();

  useEffect(() => {
    const account = getSignedInAccount();
    setUsername(account?.username);
  }, []);

  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-24 lg:text-30 font-semibold text-gray-900">
        {title}
        <span className="text-pri">
          &nbsp;{username}
        </span>
      </h1>
      <p className="text-14 lg:text-16 font-normal text-gray-600">{subtext}</p>
    </div>
  )
}

export default HeaderBox