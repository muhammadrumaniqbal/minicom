
import LoginForm from "@/components/LoginForm";

export const metadata = {
  title: "Customer Login | Minicom",
  description: "Log in to your Minicom account.",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#f5f1ea] px-4 py-16">
      <div className="w-full max-w-md bg-white p-8 shadow-sm sm:p-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-stone-900">
            minicom.
          </h1>

          <p className="mt-3 text-sm text-stone-500">
            Welcome back. Sign in to continue shopping.
          </p>
        </div>

<LoginForm role="customer" />
      </div>
    </main>
  );
}
