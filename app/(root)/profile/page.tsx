'use client'

import ProfileInfo from '@/components/profile/ProfileInfo'
import PasswordUpdate from '@/components/profile/PasswordUpdate'
import WebhookManager from '@/components/profile/WebhookManager'

const ProfilePage = () => {
    return (
        <section className="flex w-full flex-row max-xl:max-h-screen max-xl:overflow-y-scroll">
            <div className="flex w-full flex-1 flex-col gap-8 px-5 sm:px-8 py-7 lg:py-12 xl:max-h-screen xl:overflow-y-scroll">
                <ProfileInfo />
                <PasswordUpdate />
                <WebhookManager />
            </div>
        </section>
    )
}

export default ProfilePage
