import { FaGithub } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import styles from "./styles.module.scss";
import { signIn, signOut, useSession } from "next-auth/client";

export const SignInButton = () => {
  const [session] = useSession();

  return session ? (
    <button
      onClick={() => signOut()}
      type="button"
      className={styles.signInButton}
    >
      <FaGithub color="#04d361" />
      {session.user.name}
      <FiX color="#737380" className={styles.signClose} />
    </button>
  ) : (
    <button
      onClick={() => signIn("github")}
      type="button"
      className={styles.signInButton}
    >
      <FaGithub color="#eba417" />
      Sign in with Github
    </button>
  );
};
