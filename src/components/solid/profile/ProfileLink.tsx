import { ProfileSchema, type Profile } from "@schemas/Profile";
import { createResource, type Component, createSignal, onMount } from "solid-js";
import { set } from "zod";


async function fetchProfile(id: string): Promise<Profile> {
  const nick = localStorage.getItem('profile.'+id)
  if (nick) {
    return ProfileSchema.parse(JSON.parse(nick))
  }
  const response = await fetch(`/api/profiles/${id}`)
    if (!response.ok) {
        return ProfileSchema.parse({
        nick: 'Anonymous',
        avatarURL: ''
    })}
    const data = ProfileSchema.parse(await response.json())
    localStorage.setItem('profile.'+id, JSON.stringify(data))
    return data
}

export const ProfileLink: Component<{profileKey: string}> = (props) => {
  const [ profile, setProfile ] = createSignal(ProfileSchema.parse({
    nick: '...',
    avatarURL: ''
  }))

  onMount(async () => {
    const p = await fetchProfile(props.profileKey)
    setProfile(p)
  });

    return (
        <a href={`/profiles/${props.profileKey}`} class="profile-link">
        <span>{profile().nick}</span>
        </a>
    )

}