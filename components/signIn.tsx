import { signIn, signOut, auth } from "@/auth";

export default async function SignIn() {
  const session = await auth();

  if (session) {
    console.log(session);
  } else {
    console.log("No session yet");
  }

  return (
    <>
      <form
        action={async () => {
          "use server";
          await signIn("google");
        }}
      >
        <button type="submit">Signin with Google</button>
      </form>
      {session && (
        <form
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <button type="submit">Signout</button>
        </form>
      )}
    </>
  );
}
