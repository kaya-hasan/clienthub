import { useState } from "react";

function LoginForm({ texts, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await onLogin(email, password);
    } catch (submitError) {
      setError(submitError.message || texts.error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="auth-shell">
      <section className="auth-card">
        <p className="auth-kicker">{texts.kicker}</p>
        <h1>{texts.title}</h1>
        <p className="auth-copy">{texts.copy}</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>{texts.email}</label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={texts.emailPlaceholder}
          />
          <label>{texts.password}</label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder={texts.passwordPlaceholder}
          />
          {error ? <p className="form-error">{error}</p> : null}
          <button type="submit" className="primary-btn" disabled={isSubmitting}>
            {isSubmitting ? texts.loading : texts.submit}
          </button>
        </form>
      </section>
    </div>
  );
}

export default LoginForm;
