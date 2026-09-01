import { shopifyFetch } from "@/lib/shopify";
import { getProductsQuery } from "@/lib/queries";
import Image from "next/image";
import Link from "next/link";

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
    width: number;
    height: number;
  } | null;
}

export default async function Home() {
  const data = await shopifyFetch({ query: getProductsQuery });
  const products = data?.products?.edges || [];

  return (
    <div className="w-full flex flex-col items-center">
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full h-[70vh] flex items-center justify-center bg-[#0a0a0a] overflow-hidden border-b border-[#333]">
        {/* Background Glow Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-primary/20 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center mt-10">
          <h1 className="text-5xl md:text-7xl font-heading text-white uppercase tracking-wider mb-6 leading-tight">
            Build Your <span className="text-primary">Dream</span> Home Gym
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl font-body">
            Premium, high-performance fitness equipment engineered for your ultimate workout experience. Push your limits with FlexFit.
          </p>
          <Link 
            href="#products" 
            className="bg-primary hover:bg-[#e04f1a] text-white font-bold py-4 px-10 rounded uppercase tracking-widest transition-all duration-300 hover:scale-105 shadow-[0_0_20px_rgba(255,90,31,0.3)]"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* 2. PRODUCT GRID SECTION */}
      <div id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading text-white uppercase tracking-wide inline-block relative">
            Featured Equipment
            {/* Orange underline accent */}
            <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-1 bg-primary rounded-full"></span>
          </h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map(({ node }: { node: ProductNode }) => (
            <Link href={`/products/${node.handle}`} key={node.id} className="group">
              <div className="bg-[#1a1a1a] rounded-xl overflow-hidden border border-[#333] transition-all duration-300 group-hover:border-primary h-full flex flex-col hover:shadow-[0_0_15px_rgba(255,90,31,0.15)]">
                
                <div className="aspect-square relative bg-[#222]">
                  {node.featuredImage ? (
                    <Image
                      src={node.featuredImage.url}
                      alt={node.featuredImage.altText || node.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-secondary text-sm">
                      No Image
                    </div>
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
      
    </div>
  );
}