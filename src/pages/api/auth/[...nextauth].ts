import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { fauna } from "../../../services/faunadb";
import { query as q, query } from "faunadb";

interface FaunadbSubscriptionColletion {
  data: {
    status: string;
  };
}

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_API_ID,
      clientSecret: process.env.GITHUB_API_KEY,
      scope: "read:user",
    }),
    // ...add more providers here
  ],
  jwt: {
    signingKey: process.env.JWT_SIGING_PRIVATE_KEY,
  },
  callbacks: {
    async session(session) {
      try {
        const userActiveSubscription = await fauna.query<FaunadbSubscriptionColletion>(
          q.Get(
            q.Intersection([
              q.Match(
                q.Index("subscription_by_user_ref"),
                q.Select(
                  "ref",
                  q.Get(
                    q.Match(
                      q.Index("user_by_email"),
                      q.Casefold(session.user.email)
                    )
                  )
                )
              ),
              q.Match(q.Index("subscription_by_status"), "active"),
            ])
          )
        );
        return {
          ...session,
          activeSubscription: userActiveSubscription.data.status,
        };
      } catch {
        return {
          ...session,
          activeSubscription: null,
        };
      }
    },

    async signIn(user) {
      const { email } = user;
      try {
        await fauna.query(
          q.If(
            q.Not(
              q.Exists(q.Match(q.Index("user_by_email"), q.Casefold(email)))
            ),
            q.Create(q.Collection("users"), { data: { email } }),
            q.Get(q.Match(q.Index("user_by_email"), q.Casefold(email)))
          )
        );
        return true;
      } catch {
        return false;
      }
    },
  },
});
