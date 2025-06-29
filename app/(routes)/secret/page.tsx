import { auth } from '@/auth'
import { redirect } from 'next/navigation'

const SecretPage = async () => {
  const session = await auth()
  if (!session) {
    console.log("This page is protected")
    redirect("/profile")
  }
  return (
    <div>
      <h1>This is a secret page</h1>
      <p>You are logged in as {session.user?.email}</p>
    </div>
  )
}

export default SecretPage
