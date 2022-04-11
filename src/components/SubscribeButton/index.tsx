import styles from "./styles.module.scss";
import { useSession, signIn } from "next-auth/client";
import { api } from "../../services/api";
import { getStripeJs } from "../../services/stripe-js";
import { useRouter } from "next/router";

interface SubscribeButtonProps {
  priceId: string;
}

export const SubscribeButton = ({}: SubscribeButtonProps) => {
  const [session] = useSession();
  const { push } = useRouter();

  const hadnleSubscribe = async () => {
    if (!session) {
      signIn("github");
      return;
    }

    if (session.activeSubscription) {
      push("/posts");
      return;
    }

    try {
      const response = await api.post("/subscribe");

      const { sessionId } = response.data;

      const stripe = await getStripeJs();
      await stripe.redirectToCheckout({ sessionId });
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <button
      onClick={hadnleSubscribe}
      type="button"
      className={styles.subscribeButton}
    >
      Subscribe Now
    </button>
  );
};
