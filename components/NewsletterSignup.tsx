import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function NewsletterSignup() {
  return (
    <section className="bg-gradient-to-r from-red-600 to-pink-600 p-8 md:p-12 text-center text-white">
      <div className="max-w-2xl mx-auto">
        {/* Icon */}
        <div className="mb-6">
          <svg
            className="w-16 h-16 mx-auto text-red-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>

        {/* Content */}
        <h2 className="text-3xl font-bold mb-4">
          Stay Updated with Health Insights
        </h2>
        <p className="text-red-100 text-lg mb-8">
          Get the latest women&apos;s health tips, wellness advice, and expert
          insights delivered directly to your inbox.
        </p>

        {/* Newsletter Form */}
        <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Enter your email address"
            className="flex-1 bg-white text-gray-900 placeholder-gray-500 border-0 focus:ring-2 focus:ring-red-300 focus:ring-offset-2"
            required
          />
          <Button
            type="submit"
            variant="secondary"
            className="px-6 py-3 bg-white text-red-600 hover:bg-red-100 border-0 font-semibold shadow-sm hover:shadow-md transition-all duration-200"
          >
            Subscribe
          </Button>
        </form>

        {/* Privacy Note */}
        <p className="text-red-200 text-sm mt-4">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
}
