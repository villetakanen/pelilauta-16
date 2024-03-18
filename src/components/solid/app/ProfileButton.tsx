import type { Component } from "solid-js"
import { z } from "zod"
import { isActive, isAuth, uid } from "../../../store/SessionStore"
import { useStore } from '@nanostores/solid'
import { t } from "i18next"

const ProfileButtonPropsSchema = z.object({
  uid: z.string()
})
type ProfileButtonProps = z.infer<typeof ProfileButtonPropsSchema>

export const ProfileButton: Component<ProfileButtonProps> = (props) => {

  // const $isActive = useStore(isActive)
  // const $isAuth = useStore(isAuth)
  const $uid = useStore(uid)

  if (props.uid) {
    uid.set(props.uid)
    isActive.set(true)
    isAuth.set(true)
  } else {
    isActive.set(true)
    isAuth.set(false)
  }

  return $uid() ? (
    <a href={`/account`}>
      <cn-navigation-icon noun="avatar" label={t('navigation:Profile')} />
    </a>
  ) : (
    <a href="/login">
      <cn-navigation-icon noun="login" label={t('navigation:Login')} />
      uid: { props.uid }
    </a>
    
  )
}