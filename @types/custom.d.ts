import "next-auth";

interface CustomSession {
  activeSubscription?: string;
}

declare module "next-auth" {
  export interface Session extends CustomSession {}
}
