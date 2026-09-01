import Link from "next/link";
import { getCart } from "@/app/actions";
import CartDrawer from "./CartDrawer";

export default async function Header() {
  const cart = await getCart();

  return (
    <header className="bg-background border-b border-[#333] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="text-2xl font-heading text-white uppercase tracking-widest hover:text-primary transition-colors">
          Flex<span className="text-primary">Fit</span>
        </Link>

        {/* Navigation, Search & Cart */}
        <div className="flex items-center gap-4 md:gap-6">
          <Link href="/" className="text-sm font-bold text-gray-300 hover:text-white uppercase tracking-wide hidden md:block">
            Shop
          </Link>
          <Link href="/contact" className="text-sm font-bold text-gray-300 hover:text-white uppercase tracking-wide hidden md:block">
            Contact
          </Link>
          
          {/* Search Form */}
          <form action="/search" className="relative hidden sm:block">
            <input 
              type="text" 
              name="q" 
              placeholder="Search gear..." 
              className="bg-[#1a1a1a] border border-[#333] text-white text-sm rounded-full px-4 py-2 focus:outline-none focus:border-primary transition-colors w-40 lg:w-64"
              required
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </button>
          </form>

          {/* Cart */}
          <CartDrawer cart={cart} />
        </div>
      </div>
    </header>
  );
}