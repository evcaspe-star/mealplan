import Link from "next/link";
import { signIn } from "@/app/actions/auth";

const messages: Record<string, string> = {
  invalid: "That email and password do not match. Try again.",
  unconfirmed:
    "Open the confirmation link in your email first, then log in with the same password.",
  missing: "Enter both your email and your password.",
  link: "That confirmation link did not finish. Try logging in with your password.",
  generic: "We could not log you in. Check your email and password, then try again.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; confirmed?: string }>;
}) {
  const params = await searchParams;
  const message = params.error ? messages[params.error] ?? messages.generic : null;

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-10">
      <Link href="/" className="font-display text-2xl text-leaf">
        Plate Plan
      </Link>
      <h1 className="font-display mt-6 text-4xl">Welcome back</h1>
      <p className="mt-2 text-ink-soft">
        Log in with the email and password you signed up with.
      </p>

      {params.confirmed === "1" ? (
        <p className="notice mt-5">
          Your email is confirmed. Log in with the same password you chose.
        </p>
      ) : null}
      {message ? <p className="notice notice-warn mt-5">{message}</p> : null}

      <form action={signIn} className="mt-6 grid gap-4">
        <label className="field">
          Email
          <input name="email" type="email" autoComplete="email" required />
        </label>
        <label className="field">
          Password
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </label>
        <button type="submit" className="button-primary">
          Log in
        </button>
      </form>
      <p className="mt-5 text-sm text-ink-soft">
        New here?{" "}
        <Link href="/signup" className="font-bold text-leaf">
          Create an account
        </Link>
      </p>
    </main>
  );
}
