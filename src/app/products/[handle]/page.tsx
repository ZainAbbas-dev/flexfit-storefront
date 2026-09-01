import { shopifyFetch } from "@/lib/shopify";
import { getProductByHandleQuery, getRelatedProductsQuery } from "@/lib/queries";
import AddToCart from "@/components/AddToCart";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

interface ProductPageProps {
  params: Promise<{ handle: string }>;
}

// Strict Product Node Interface for Related Products
interface RelatedProductNode {
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

// Dynamic SEO Metadata Generation
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const data = await shopifyFetch({
    query: getProductByHandleQuery,
    variables: { handle: resolvedParams.handle },
  });

  const product = data?.product;
  if (!product) return { title: "Product Not Found | FlexFit" };

  const plainTextDescription = product.descriptionHtml.replace(/<[^>]+>/g, "").substring(0, 160);

  return {
    title: `${product.title} | FlexFit`,
    description: plainTextDescription,
    openGraph: {
      images: product.featuredImage ? [{ url: product.featuredImage.url }] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = await params;
  
  const [productData, relatedData] = await Promise.all([
    shopifyFetch({
      query: getProductByHandleQuery,
      variables: { handle: resolvedParams.handle },
    }),
    shopifyFetch({
      query: getRelatedProductsQuery,
    }),
  ]);

  const product = productData?.product;
  const allProducts = relatedData?.products?.edges || [];

  const relatedProducts = allProducts.filter(
    ({ node }: { node: { handle: string } }) => node.handle !== resolvedParams.handle
  ).slice(0, 3);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center text-white">
        <h1 className="text-3xl font-heading mb-4">Product Not Found</h1>
        <p className="text-gray-400 mb-8">The product you are looking for does not exist or has been removed.</p>
        <Link href="/" className="bg-primary text-white font-bold py-3 px-8 rounded uppercase">
          Back to Shop
        </Link>
      </div>
    );
  }

  const variant = product.variants.edges[0]?.node;
  const variantId = variant?.id;
  const price = variant?.price?.amount ? parseFloat(variant.price.amount).toFixed(2) : "0.00";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      {/* Main Product Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start mb-24">
        
        <div className="aspect-square relative bg-[#1a1a1a] rounded-xl overflow-hidden border border-[#333]">
          {product.featuredImage && (
            <Image
              src={product.featuredImage.url}
              alt={product.featuredImage.altText || product.title}
              fill
              className="object-cover"
              priority
            />
          )}
        </div>

        <div className="flex flex-col justify-center">
          <h1 className="text-3xl md:text-5xl font-heading text-white uppercase tracking-wide mb-4">
            {product.title}
          </h1>
          <p className="text-primary font-bold text-2xl md:text-3xl mb-6">
            ${price}
          </p>

          <div 
            className="text-gray-400 text-base mb-8 leading-relaxed prose prose-invert"
            dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
          />

          {variantId ? (
            <AddToCart variantId={variantId} />
          ) : (
            <p className="text-red-500 font-bold">Out of Stock</p>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-[#333] pt-16">
          <h2 className="text-2xl md:text-3xl font-heading text-white uppercase tracking-wide mb-8 text-center">
            You May Also <span className="text-primary">Like</span>
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {relatedProducts.map(({ node }: { node: RelatedProductNode }) => (
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
        </div>
      )}

    </div>
  );
}