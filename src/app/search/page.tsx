import { shopifyFetch } from "@/lib/shopify";
import { searchProductsQuery } from "@/lib/queries";
import Link from "next/link";
import Image from "next/image";

interface ProductNode {
  id: string;
  title: string;
  handle: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  featuredImage: {
    url: string;
    altText: string;
  } | null;
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || "";

  let products = [];
  
  if (query) {
    const data = await shopifyFetch({
      query: searchProductsQuery,
      variables: { query: `title:*${query}*` }, 
    });
    products = data?.products?.edges || [];
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full min-h-[60vh]">
      {/* Fix 1: Replaced " with &quot; */}
      <h1 className="text-3xl md:text-4xl font-heading text-white uppercase tracking-wide mb-10">
        Search Results for: <span className="text-primary">&quot;{query}&quot;</span>
      </h1>

      {products.length === 0 ? (
        /* Fix 2: Replaced " with &quot; */
        <p className="text-gray-400 text-lg">
          No products found. Try a different keyword (like &quot;Band&quot; or &quot;Dumbbell&quot;).
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map(({ node }: { node: ProductNode }) => (
            <Link href={`/products/${node.handle}`} key={node.id} className="group">
              <div className="bg-[#1a1a1a] rounded-xl overflow-hidden border border-[#333] transition-all duration-300 group-hover:border-primary h-full flex flex-col">
                <div className="aspect-square relative bg-[#222]">
                  {node.featuredImage && (
                    <Image
                      src={node.featuredImage.url}
                      alt={node.featuredImage.altText || node.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                </div>
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <h3 className="text-lg font-bold text-white truncate">{node.title}</h3>
                  <p className="text-primary mt-2 font-bold text-lg">
                    ${parseFloat(node.priceRange.minVariantPrice.amount).toFixed(2)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}