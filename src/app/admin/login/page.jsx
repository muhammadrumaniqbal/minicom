
import LoginForm from "@/components/LoginForm";

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#30251e] px-4 py-10">
      <LoginForm role="admin" />
    </main>
  );
}
