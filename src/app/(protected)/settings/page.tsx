import { auth,signOut } from "@/auth";


const SettingsPage = async () => {
  const sessions = await auth();
  return (
    <>
      {JSON.stringify(sessions)}
      <form action={async () => {
        "use server"
        await signOut();
      }}>
        <button type="submit">Sign Out</button>
      </form>
    </>
  );
};

export default SettingsPage;