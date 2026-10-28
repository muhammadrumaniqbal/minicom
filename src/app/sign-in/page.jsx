
import Link from "next/link";
import { ArrowRight, UserRound } from "lucide-react";

export const metadata = {
  title: "Sign In | Minicom",
  description: "Choose how you want to sign in to Minicom.",
};

export default function SignInChoicePage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-[#f5f1ea] px-5 py-20">
      <div className="w-full max-w-lg rounded-2xl border border-[#e5dacb] bg-white px-7 py-12 shadow-sm sm:px-12">
        <div className="text-center">
          <Link
            href="/"
            className="text-2xl font-black tracking-tight text-[#30251e]"
          >
            minicom<span className="text-[#c49a56]">.</span>
          </Link>

          <p className="mt-8 text-xs font-bold uppercase tracking-[3px] text-[#9b7956]">
            Welcome back
          </p>

          <h1 className="mt-3 text-3xl font-semibold text-[#30251e]">
            Sign in to Minicom
          </h1>

          <p className="mt-3 text-sm leading-6 text-neutral-500">
            Sign in to continue shopping and manage your favorites.
          </p>
        </div>

        <Link
          href="/login"
          className="mt-9 flex w-full items-center justify-between rounded-xl bg-[#30251e] px-5 py-5 text-white transition hover:bg-[#493728]"
        >
          <span className="flex items-center gap-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10">
              <UserRound size={22} />
            </span>

            <span>
              <span className="block font-semibold">Continue as customer</span>
              <span className="mt-1 block text-sm text-white/70">
                Shop, save favorites and check out
              </span>
            </span>
          </span>

          <ArrowRight size={20} />
        </Link>

        <Link
          href="/"
          className="mt-5 block text-center text-sm text-neutral-500 transition hover:text-[#30251e]"
        >
          Continue browsing as a guest
        </Link>
      </div>

      <Link
        href="/admin/login"
        className="absolute bottom-5 left-5 text-xs text-neutral-400 transition hover:text-neutral-700"
      >
        Admin login
      </Link>
    </main>
  );
}
