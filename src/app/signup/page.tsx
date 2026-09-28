import Link from "next/link";
import { signUp } from "@/app/actions/auth";

const messages: Record<string, string> = {
  email: "Enter a real email address so we can send the confirmation link.",
  password: "Use a password with at least 6 characters.",
  exists: "An account with that email already exists. Log in instead.",
  generic: "We could not create the account. Try again in a moment.",
};

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; "check-email"?: string; email?: string }>;
}) {
  const params = await searchParams;
  const message = params.error ? messages[params.error] ?? messages.generic : null;

  if (params["check-email"] === "1") {
    return (
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-10">
        <Link href="/" className="font-display text-2xl text-leaf">
          Plate Plan
        </Link>
        <h1 className="font-display mt-6 text-4xl">Check your email</h1>
        <p className="mt-3 text-ink-soft">
          We sent a confirmation link
          {params.email ? ` to ${params.email}` : ""}. Open that link. It is
          not a code. Then come back and log in with the same password.
        </p>
        <Link href="/login" className="button-primary mt-6">
          Go to log in
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-10">
      <Link href="/" className="font-display text-2xl text-leaf">
        Plate Plan
      </Link>
      <h1 className="font-display mt-6 text-4xl">Create your account</h1>
      <p className="mt-2 text-ink-soft">
        You will get one email with a confirmation link. After you open it,
        log in with this password.
      </p>
      {message ? <p className="notice notice-warn mt-5">{message}</p> : null}
      <form action={signUp} className="mt-6 grid gap-4">
        <label className="field">
          Email
          <input name="email" type="email" autoComplete="email" required />
        </label>
        <label className="field">
          Password
          <input
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={6}
            required
          />
        </label>
        <button type="submit" className="button-primary">
          Create account
        </button>
      </form>
      <p className="mt-5 text-sm text-ink-soft">
        Already signed up?{" "}
        <Link href="/login" className="font-bold text-leaf">
          Log in
        </Link>
      </p>
    </main>
  );
}
