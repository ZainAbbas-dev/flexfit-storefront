const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

export async function shopifyFetch({
  query,
  variables,
}: {
  query: string;
  variables?: Record<string, unknown>;
}) {
  const endpoint = `https://${domain}/api/2024-07/graphql.json`;

  try {
    const result = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": storefrontAccessToken!,
      },
      body: JSON.stringify({ query, variables }),
      // Next.js caching strategy for high Lighthouse score
      next: { revalidate: 60 }, 
    });

    const { data, errors } = await result.json();

    if (errors) {
      console.error("Shopify API Errors:", errors);
      throw new Error("Failed to fetch data from Shopify Storefront API");
    }

    return data;
  } catch (error) {
    console.error("Error:", error);
    throw new Error("Error fetching data");
  }
}