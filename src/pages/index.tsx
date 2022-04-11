import { GetStaticProps } from "next";
import Head from "next/head";
import { SubscribeButton } from "../components/SubscribeButton";
import { stripe } from "../services/srtipe";
import styles from "../styles/pages/home.module.scss";

interface HomeProps {
  product: {
    priceId: string;
    amount: string;
  };
}

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>

      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>Hey, welcome</span>
          <h1>
            News about the <span>React</span>
          </h1>
          <p>Get access to all the publications</p>
          <span>for {product.amount} month</span>
          <SubscribeButton priceId={product.priceId} />
        </section>

        <img src="/images/avatar.svg" />
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve("price_1KnRSpIYQbqSHftyu4aM9v0u");

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat("en-Us", {
      style: "currency",
      currency: "USD",
    }).format(price.unit_amount / 100),
  };

  
  return {
    props: {
      product,
    },
  };
};
