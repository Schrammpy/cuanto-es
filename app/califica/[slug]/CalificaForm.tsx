
"use client";

import { useState } from "react";
import {
  Star,
  Send,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

type Props = {
  slug: string;
};

export default function CalificaForm({ slug }: Props) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [contactRequested, setContactRequested] =
    useState(false);
  const [customerPhone, setCustomerPhone] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function submitRating(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setError("");

    if (rating < 1 || rating > 5) {
      setError("Seleccioná una calificación");
      return;
    }

    if (rating <= 3 && !comment.trim()) {
      setError("Contanos qué pasó antes de enviar");
      return;
    }

    if (contactRequested && !customerPhone.trim()) {
      setError("Ingresá tu número de WhatsApp");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/califica/ratings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            slug,
            rating,
            comment: comment.trim(),
            contactRequested,
            customerPhone: contactRequested
              ? customerPhone.trim()
              : null,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
          "No pudimos registrar tu opinión"
        );
      }

      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No pudimos enviar tu opinión"
      );
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-4 py-6 text-center">
        <CheckCircle2 className="h-14 w-14 text-emerald-400" />

        <h2 className="text-2xl font-bold text-white">
          ¡Muchas gracias!
        </h2>

        <p className="text-sm leading-relaxed text-slate-300">
          Tu calificación fue registrada correctamente.
          Tu opinión nos ayuda a mejorar.
        </p>

        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-7 w-7 ${
                star <= rating
                  ? "fill-amber-400 text-amber-400"
                  : "text-slate-600"
              }`}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={submitRating}
      className="flex flex-col gap-5"
    >
      <div className="text-center">
        <h2 className="text-xl font-bold text-white">
          ¿Cómo estuvo tu pedido?
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          Calificá tu experiencia en menos de un minuto.
        </p>
      </div>

      {/* ESTRELLAS */}
      <div
        className="flex justify-center gap-2"
        role="group"
        aria-label="Calificación de una a cinco estrellas"
      >
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            disabled={loading}
            onClick={() => {
              setRating(value);
              setError("");
            }}
            aria-label={`${value} ${
              value === 1 ? "estrella" : "estrellas"
            }`}
            aria-pressed={rating === value}
            className="rounded-lg p-1 transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-amber-400 disabled:opacity-60"
          >
            <Star
              className={`h-9 w-9 ${
                value <= rating
                  ? "fill-amber-400 text-amber-400"
                  : "text-slate-500"
              }`}
            />
          </button>
        ))}
      </div>

      {!rating && (
        <p className="text-center text-xs text-slate-500">
          Tocá una estrella para comenzar.
        </p>
      )}

      {rating > 0 && (
        <>
          <p className="text-center text-sm text-slate-300">
            {rating <= 3
              ? "Lamentamos que tu experiencia no haya sido la esperada."
              : "¡Nos alegra saber de tu experiencia!"}
          </p>

          {/* COMENTARIO */}
          <div className="space-y-2">
            <label
              htmlFor="califica-comment"
              className="block text-sm font-medium text-slate-200"
            >
              Tu comentario{" "}
              <span className="text-slate-400">
                {rating <= 3
                  ? "(obligatorio)"
                  : "(opcional)"}
              </span>
            </label>

            <textarea
              id="califica-comment"
              value={comment}
              onChange={(event) =>
                setComment(event.target.value)
              }
              maxLength={2000}
              rows={4}
              required={rating <= 3}
              disabled={loading}
              placeholder="Contanos cómo fue tu experiencia..."
              className="w-full resize-none rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-amber-400 disabled:opacity-60"
            />
          </div>

          {/* SOLICITUD DE CONTACTO */}
          <div className="rounded-xl border border-slate-700 bg-slate-800/60 p-4">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={contactRequested}
                disabled={loading}
                onChange={(event) => {
                  setContactRequested(event.target.checked);

                  if (!event.target.checked) {
                    setCustomerPhone("");
                  }
                }}
                className="mt-1 h-4 w-4 accent-amber-400"
              />

              <span className="text-sm text-slate-300">
                Quiero que el comercio se comunique conmigo.
              </span>
            </label>

            {contactRequested && (
              <div className="mt-4 space-y-2">
                <label
                  htmlFor="califica-phone"
                  className="block text-sm text-slate-300"
                >
                  Tu número de WhatsApp
                </label>

                <input
                  id="califica-phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={customerPhone}
                  onChange={(event) =>
                    setCustomerPhone(event.target.value)
                  }
                  required
                  maxLength={25}
                  disabled={loading}
                  placeholder="Ej.: 0981 123456"
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-amber-400"
                />

                <p className="text-xs leading-relaxed text-slate-400">
                  Al solicitar contacto, autorizás a que
                  compartamos este número con el comercio
                  para responder a tu experiencia.
                </p>
              </div>
            )}
          </div>

          {/* ERROR */}
          {error && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300"
            >
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* ENVIO */}
          <button
            type="submit"
            disabled={
              loading ||
              (rating <= 3 && !comment.trim()) ||
              (contactRequested && !customerPhone.trim())
            }
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3.5 font-bold text-slate-950 transition-colors hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send className="h-4 w-4" />

            {loading
              ? "Enviando..."
              : "Enviar calificación"}
          </button>
        </>
      )}

      {error && rating === 0 && (
        <p
          role="alert"
          className="text-center text-sm text-red-300"
        >
          {error}
        </p>
      )}

      <p className="text-center text-xs text-slate-500">
        Tu opinión se comparte de forma privada con el
        comercio. No es necesario registrarte.
      </p>
    </form>
  );
}
