import Link from 'next/link'
import Image from 'next/image'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
 
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      {/* Full-screen centered content */}
      <div className="relative w-full h-screen">
        <div className="absolute inset-0">
          <Image
            src="https://res.cloudinary.com/jpsm83/image/upload/v1757874787/health/t6048kq57tw9aexfqpge.png"
            alt="404 Not Found"
            className="w-full h-full object-cover"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* Centered Content */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white max-w-4xl mx-auto px-6">
            {/* App Logo */}
            <div className="flex items-center justify-center space-x-2 mb-8 md:mb-16">
              <Heart size={64} className="text-white" />
              <span className="text-2xl md:text-6xl font-bold text-white">Women&apos;s Spot</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              404
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-gray-200">
              Page Not Found!
            </h2>
            <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto">
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
            
            {/* Single Action Button with App Colors */}
            <Button 
              asChild
              size="lg"
              className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-4 text-lg font-semibold hover:from-red-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Link href="/">
                Return Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}