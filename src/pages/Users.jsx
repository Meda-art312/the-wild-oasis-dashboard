import Heading from "../ui/Heading";
import { supabaseUrl } from "../services/supabase";

function NewUsers() {
  return (
    <>
      <Heading as="h1">Manage staff accounts</Heading>
      <p>Staff accounts can access all hotel records. The project owner creates them in Supabase; public registration is disabled.</p>
      <a href={`https://supabase.com/dashboard/project/${new URL(supabaseUrl).hostname.split(".")[0]}/auth/users`} target="_blank" rel="noreferrer">
        Open user management &rarr;
      </a>
    </>
  );
}

export default NewUsers;
