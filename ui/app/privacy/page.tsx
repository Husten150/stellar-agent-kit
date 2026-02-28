import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { PageTransition } from "@/components/page-transition"

export default function PrivacyPage() {
  return (
    <main className="relative min-h-screen bg-black text-white">
      <Navbar />
      <PageTransition>
        <div className="mx-auto max-w-2xl px-6 pt-32 pb-24">
          <h1 className="text-3xl font-bold tracking-tight text-white">Privacy Policy</h1>
          <p className="mt-4 text-zinc-400">
            This page is a placeholder. Add your privacy policy content here.
          </p>
          <Link
            href="/"
            className="mt-8 inline-block text-[#a78bfa] hover:underline"
          >
            ← Back to home
          </Link>
        </div>
      </PageTransition>
    </main>
  )
}
