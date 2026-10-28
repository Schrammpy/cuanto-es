"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Check,
  CheckCircle2,
  ClipboardList,
  Copy,
  LockKeyhole,
  MessageCircle,
  RotateCcw,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  Store,
  TrendingUp,
} from "lucide-react";
import styles from "./DemoExperience.module.css";

type DemoOpinion = {
  id: string;
  rating: number;
  comment: string;
  when: string;
  contactRequested: boolean;
};

type Props = {
  contactHref: string;
  whatsappEnabled: boolean;
};

// Datos ilustrativos fijos. No representan clientes, pedidos ni ventas reales.
const sampleOpinions: DemoOpinion[] = [
  {
    id: "ejemplo-1",
    rating: 5,
    comment: "La pizza estuvo espectacular. Lleg\u00f3 calentita.",
    when: "Ejemplo 01",
    contactRequested: false,
  },
  {
    id: "ejemplo-2",
    rating: 4,
    comment: "Muy buen sabor. Todo correcto con el pedido.",
    when: "Ejemplo 02",
    contactRequested: false,
  },
  {
    id: "ejemplo-3",
    rating: 2,
    comment: "La pizza lleg\u00f3 fr\u00eda y tard\u00f3 bastante.",
    when: "Ejemplo 03",
    contactRequested: true,
  },
  {
    id: "ejemplo-4",
    rating: 5,
    comment: "Excelente atenci\u00f3n y porciones generosas.",
    when: "Ejemplo 04",
    contactRequested: false,
  },
  {
    id: "ejemplo-5",
    rating: 3,
    comment: "Falt\u00f3 una bebida en el pedido.",
    when: "Ejemplo 05",
    contactRequested: false,
  },
  {
    id: "ejemplo-6",
    rating: 4,
    comment: "Lleg\u00f3 todo bien. Volver\u00eda a pedir.",
    when: "Ejemplo 06",
    contactRequested: false,
  },
];

function MiniStars({ rating, compact = false }: { rating: number; compact?: boolean }) {
  return (
    <span className={styles.miniStars} aria-label={`${rating} de 5 estrellas`}>
      {[1, 2, 3, 4, 5].map((value) => (
        <Star
          key={value}
          size={compact ? 13 : 16}
          strokeWidth={2.4}
          fill={value <= rating ? "currentColor" : "none"}
          className={value <= rating ? styles.starLit : styles.starUnlit}
          aria-hidden="true"
        />
      ))}
    </span>
  );
}

export default function DemoExperience({ contactHref, whatsappEnabled }: Props) {
  const [view, setView] = useState<"customer" | "business">("customer");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [contactRequested, setContactRequested] = useState(false);
  const [latest, setLatest] = useState<DemoOpinion | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const opinions = useMemo(
    () => (latest ? [latest, ...sampleOpinions] : sampleOpinions),
    [latest]
  );
  const summary = useMemo(() => {
    const total = opinions.length;
    const average = opinions.reduce((sum, item) => sum + item.rating, 0) / total;
    const good = opinions.filter((item) => item.rating >= 4).length;
    const attention = opinions.filter((item) => item.rating <= 3).length;
    const distribution = [5, 4, 3, 2, 1].map((score) => ({
      score,
      count: opinions.filter((item) => item.rating === score).length,
    }));
    return { total, average, good, attention, distribution };
  }, [opinions]);

  const isNegative = rating >= 1 && rating <= 3;

  function selectRating(value: number) {
    setRating(value);
    setError("");
    if (value >= 4) setContactRequested(false);
  }

  function chooseExample(score: number, sample: string) {
    selectRating(score);
    setComment(sample);
    setContactRequested(false);
    setView("customer");
  }

  function submitExample(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (rating < 1 || rating > 5) {
      setError("Eleg\u00ed una calificaci\u00f3n de 1 a 5 estrellas.");
      return;
    }
    if (isNegative && !comment.trim()) {
      setError("Para 1 a 3 estrellas, contanos qu\u00e9 sucedi\u00f3.");
      return;
    }

    // Solo se actualiza el estado React de esta pestana. No usa fetch,
    // Supabase, Sheets, cookies, localStorage ni servicios externos.
    setLatest({
      id: "tu-prueba",
      rating,
      comment: comment.trim() || "Sin comentario (opcional)",
      when: "Tu prueba, ahora",
      contactRequested: isNegative && contactRequested,
    });
    setView("business");
    if (typeof window !== "undefined") {
      document.getElementById("demo-interactiva")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function restart() {
    setRating(0);
    setComment("");
    setContactRequested(false);
    setLatest(null);
    setError("");
    setView("customer");
    setCopied(false);
  }

  async function copyLink() {
    if (typeof window === "undefined") return;
    try {
      await navigator.clipboard.writeText(window.location.origin + "/califica/demo");
      setCopied(true);
    } catch {
      setCopied(false);
      // La URL permanece visible en el navegador si el portapapeles se bloquea.
    }
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.headerInner}>
            <Link href="/califica" className={styles.brand} aria-label="CuantoEs Califica - volver a la landing">
              <span className={styles.brandIcon}><Star size={22} fill="currentColor" /></span>
              <span>CuantoEs <b>Califica</b></span>
            </Link>
            <div className={styles.headerActions}>
              <span className={styles.headerTag}>DEMO INTERACTIVA</span>
              <Link className={styles.backLink} href="/califica">
                <ArrowLeft size={16} aria-hidden="true" /> <span>Conocer Califica</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={`${styles.container} ${styles.heroInner}`}>
          <div className={styles.heroCopy}>
            <div className={styles.eyebrow}><Sparkles size={16} aria-hidden="true" /> DEMOSTRACI&Oacute;N PARA COMERCIOS DE COMIDA</div>
            <h1>Tu cliente opina. <span>Tu negocio aprende.</span></h1>
            <p>
              &iquest;Qu&eacute; pasa cuando una pizza llega fr&iacute;a o un pedido sale perfecto?
              Prob&aacute; c&oacute;mo recibir&iacute;as esa informaci&oacute;n sin cambiar tu manera de vender.
            </p>
            <div className={styles.heroChecks}>
              <span><Check size={16} /> Sin instalar nada</span>
              <span><Check size={16} /> Menos de 1 minuto</span>
              <span><Check size={16} /> Sin datos reales</span>
            </div>
          </div>
          <div className={styles.heroVisual}>
            {/* Ilustracion SVG original servida localmente: sin cookies ni imagenes externas. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/califica/demo-food.svg"
              alt={"Ilustraci\u00f3n de una pizza y una hamburguesa"}
              width={900}
              height={560}
            />
            <div className={styles.heroLogo}><Store size={21} /><span>TU LOGO</span></div>
          </div>
        </div>
      </section>

      <section id="demo-interactiva" className={styles.contentSection}>
        <div className={styles.container}>
          <div className={styles.sectionIntro}>
            <div>
              <p className={styles.sectionEyebrow}>PROBALO VOS MISMO</p>
              <h2>&iexcl;As&iacute; funcionar&iacute;a en tu local!</h2>
              <p>No hace falta crear una cuenta ni hacer un pedido. Todo es una simulaci&oacute;n.</p>
            </div>
            <div className={styles.steps} aria-label="Etapas de la demostraci\u00f3n">
              <span className={view === "customer" ? styles.stepActive : styles.stepDone}>1. Como cliente</span>
              <ArrowRight size={16} aria-hidden="true" />
              <span className={view === "business" ? styles.stepActive : styles.stepNext}>2. Como negocio</span>
            </div>
          </div>

          <div className={styles.switcher} role="group" aria-label="Elegir vista de demostraci\u00f3n">
            <button
              type="button"
              className={view === "customer" ? styles.switchActive : styles.switchButton}
              onClick={() => setView("customer")}
              aria-pressed={view === "customer"}
            >
              <Star size={18} /> Como cliente
            </button>
            <button
              type="button"
              className={view === "business" ? styles.switchActive : styles.switchButton}
              onClick={() => setView("business")}
              aria-pressed={view === "business"}
            >
              <BarChart3 size={18} /> Como negocio {latest ? <span className={styles.notificationDot} /> : null}
            </button>
          </div>

          {view === "customer" ? (
            <div className={styles.demoColumns}>
              <div className={styles.explainer}>
                <span className={styles.panelLabel}>01 / LA EXPERIENCIA DEL COMPRADOR</span>
                <h3>Un mensaje m&aacute;s al terminar la entrega.</h3>
                <p>
                  El local comparte siempre el mismo enlace por WhatsApp. El comprador
                  toca el enlace, elige estrellas y, si quiere, deja un comentario.
                </p>
                <div className={styles.waCard}>
                  <div className={styles.waTop}><MessageCircle size={18} /> Ejemplo de mensaje por WhatsApp</div>
                  <div className={styles.waBubble}>
                    &iexcl;Gracias por tu pedido! &#127829; &iquest;Nos ayud&aacute;s calificando tu experiencia?
                    <strong>cuantoes.com.py/califica/tucomercio</strong>
                    <span>Enlace ilustrativo</span>
                  </div>
                </div>
                <div className={styles.tip}>
                  <ShieldCheck size={21} />
                  <span>
                    <strong>Opiniones privadas, no rese&ntilde;as p&uacute;blicas.</strong>
                    El negocio ve comentarios e indicadores en su propia planilla.
                  </span>
                </div>
              </div>
              <div className={styles.phoneWrap}>
                <div className={styles.phonePanel}>
                  <div className={styles.phoneTop}>
                    <div className={styles.mockLogo}><Store size={25} /><small>TU LOGO</small></div>
                    <div>
                      <span className={styles.mockTag}>VISTA DE TU CLIENTE</span>
                      <h3>Tu Pizzer&iacute;a</h3>
                      <p>Tu opini&oacute;n nos ayuda a mejorar.</p>
                    </div>
                  </div>
                  <form onSubmit={submitExample} noValidate>
                    <div className={styles.formIntro}>
                      <h4>&iquest;C&oacute;mo estuvo tu pedido?</h4>
                      <p>Calific&aacute; tu experiencia de 1 a 5 estrellas.</p>
                    </div>
                    <div className={styles.starButtons} role="group" aria-label="Elegir de 1 a 5 estrellas">
                      {[1, 2, 3, 4, 5].map((score) => (
                        <button
                          type="button"
                          key={score}
                          onClick={() => selectRating(score)}
                          aria-label={`${score} ${score === 1 ? "estrella" : "estrellas"}`}
                          aria-pressed={rating === score}
                          className={rating >= score ? styles.starButtonSelected : styles.starButton}
                        >
                          <Star size={33} strokeWidth={2} fill={rating >= score ? "currentColor" : "none"} aria-hidden="true" />
                        </button>
                      ))}
                    </div>
                    <p className={styles.starHint}>
                      {rating === 0
                        ? "Toc\u00e1 una estrella o eleg\u00ed un ejemplo para empezar."
                        : isNegative
                          ? "Contanos qu\u00e9 podr\u00edamos mejorar."
                          : "\u00a1Gracias! Si quer\u00e9s, contanos qu\u00e9 te gust\u00f3."}
                    </p>
                    <div className={styles.examples}>
                      <button type="button" onClick={() => chooseExample(2, "La pizza lleg\u00f3 fr\u00eda y tard\u00f3 bastante.")}>
                        &#127829; Lleg&oacute; fr&iacute;a
                      </button>
                      <button type="button" onClick={() => chooseExample(5, "Muy rica la pizza y excelente atenci\u00f3n.")}>
                        <CheckCircle2 size={14} /> Todo perfecto
                      </button>
                    </div>
                    <label htmlFor="demo-opinion" className={styles.inputLabel}>
                      Tu comentario <span>{isNegative ? "(obligatorio)" : "(opcional)"}</span>
                    </label>
                    <textarea
                      id="demo-opinion"
                      rows={3}
                      maxLength={600}
                      value={comment}
                      onChange={(event) => { setComment(event.target.value); setError(""); }}
                      placeholder={isNegative ? "Contanos qu\u00e9 sucedi\u00f3..." : "\u00bfQu\u00e9 fue lo mejor de tu pedido?"}
                      className={styles.textarea}
                    />
                    {isNegative && (
                      <div className={styles.contactOption}>
                        <label>
                          <input
                            type="checkbox"
                            checked={contactRequested}
                            onChange={(event) => setContactRequested(event.target.checked)}
                          />
                          Quisiera que el comercio me contacte.
                        </label>
                        <small>
                          En el servicio real se solicita un tel&eacute;fono voluntario.
                          Esta simulaci&oacute;n no recoge n&uacute;meros.
                        </small>
                      </div>
                    )}
                    {error && <p className={styles.error} role="alert">{error}</p>}
                    <button type="submit" className={styles.submitButton}>
                      <Send size={18} aria-hidden="true" /> Enviar opini&oacute;n de prueba
                    </button>
                    <p className={styles.privacyNote}><LockKeyhole size={13} /> Simulaci&oacute;n local. No se guarda ni env&iacute;a informaci&oacute;n.</p>
                  </form>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.resultsArea} aria-live="polite">
              <div className={styles.resultHeading}>
                <div>
                  <span className={styles.panelLabel}>02 / LA VISTA DEL COMERCIO</span>
                  <h3>&iexcl;As&iacute; llega la opini&oacute;n a tu negocio!</h3>
                  <p>
                    {latest
                      ? "La calificaci\u00f3n que acab\u00e1s de probar ya aparece junto a otros ejemplos ficticios."
                      : "Estos son ejemplos ficticios. Envi\u00e1 una opini\u00f3n desde la otra vista para ver el cambio."}
                  </p>
                </div>
                <button type="button" onClick={restart} className={styles.resetButton}>
                  <RotateCcw size={16} /> Reiniciar demo
                </button>
              </div>
              {latest && (
                <div className={styles.successNotice} role="status">
                  <CheckCircle2 size={21} />
                  <div><strong>&iexcl;Tu opini&oacute;n de prueba apareci&oacute; ac&aacute;!</strong><span>Solo se muestra en esta pesta&ntilde;a. No se envi&oacute; a Supabase ni a Google Sheets.</span></div>
                </div>
              )}
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <span><ClipboardList size={18} /> Opiniones</span>
                  <strong>{summary.total}</strong>
                  <small>Datos de ejemplo</small>
                </div>
                <div className={styles.statCard}>
                  <span><Star size={18} /> Promedio</span>
                  <strong>{summary.average.toLocaleString("es-PY", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} <em>/ 5</em></strong>
                  <small>Calificaci&oacute;n general</small>
                </div>
                <div className={styles.statCard}>
                  <span><TrendingUp size={18} /> 4 y 5 estrellas</span>
                  <strong>{summary.good}</strong>
                  <small>Opiniones positivas</small>
                </div>
                <div className={`${styles.statCard} ${styles.statAttention}`}>
                  <span><MessageCircle size={18} /> Por revisar</span>
                  <strong>{summary.attention}</strong>
                  <small>Opiniones de 1 a 3 estrellas (ejemplo)</small>
                </div>
              </div>
              <div className={styles.resultColumns}>
                <div className={styles.distributionCard}>
                  <div className={styles.sectionCardHeading}>
                    <h4>Distribuci&oacute;n de estrellas</h4>
                    <span>Indicadores · ejemplo</span>
                  </div>
                  <div className={styles.bars}>
                    {summary.distribution.map((row) => (
                      <div key={row.score} className={styles.barRow}>
                        <span>{row.score} <Star size={14} fill="currentColor" /></span>
                        <div className={styles.barTrack}>
                          <div style={{ width: `${(row.count / summary.total) * 100}%` }} />
                        </div>
                        <b>{row.count}</b>
                      </div>
                    ))}
                  </div>
                  <div className={styles.sheetPills}>
                    <span>Calificaciones</span><span>Indicadores</span><span>Evoluci&oacute;n mensual</span><span>Pendientes</span>
                  </div>
                  <p className={styles.cardFootnote}>
                    En el servicio real estas pesta&ntilde;as est&aacute;n en un Google Sheet privado por comercio;
                    la sincronizaci&oacute;n y los indicadores no son instant&aacute;neos.
                  </p>
                </div>
                <div className={styles.opinionCard}>
                  <div className={styles.sectionCardHeading}>
                    <h4>&Uacute;ltimas opiniones</h4>
                    <span>Historial · ejemplo</span>
                  </div>
                  <div className={styles.opinionList}>
                    {opinions.slice(0, 5).map((item) => (
                      <article key={item.id} className={item.id === "tu-prueba" ? styles.newOpinion : styles.opinionItem}>
                        <div className={styles.opinionTop}>
                          <MiniStars rating={item.rating} compact />
                          <span>{item.when}</span>
                        </div>
                        <p>{item.comment}</p>
                        {item.id === "tu-prueba" && <span className={styles.newLabel}>TU PRUEBA</span>}
                        {item.rating <= 3 && item.contactRequested && <span className={styles.attentionLabel}>Contacto solicitado (simulado)</span>}
                      </article>
                    ))}
                  </div>
                </div>
              </div>
              <div className={styles.resultAction}>
                <div><strong>&iquest;Te gustar&iacute;a ver opiniones de tus propios clientes?</strong><span>Activamos tu p&aacute;gina con nombre y logo. Prueba gratuita por 15 d&iacute;as para comercios seleccionados.</span></div>
                <a href={contactHref} target={whatsappEnabled ? "_blank" : undefined} rel={whatsappEnabled ? "noopener noreferrer" : undefined} className={styles.ctaButton}>
                  Solicitar 15 d&iacute;as gratis <ArrowRight size={19} />
                </a>
              </div>
            </div>
          )}

          {view === "customer" && (
            <div className={styles.bottomHint}>
              <span><BarChart3 size={19} /> &iquest;Quer&eacute;s ver primero los resultados?</span>
              <button type="button" onClick={() => setView("business")}>Ver un ejemplo de panel <ArrowRight size={16} /></button>
            </div>
          )}
        </div>
      </section>

      <section className={styles.finalCta}>
        <div className={styles.container}>
          <div className={styles.finalCard}>
            <div>
              <span>CUANTOES CALIFICA ESENCIAL</span>
              <h2>Empez&aacute; a escuchar despu&eacute;s de cada entrega.</h2>
              <p>
                Envi&aacute;s el enlace al cliente y recib&iacute;s comentarios e indicadores privados. 
                Sin instalar aplicaciones ni cambiar c&oacute;mo tom&aacute;s pedidos.
              </p>
              <div className={styles.priceLine}>
                <strong>Gs. 50.000 / mes</strong><span>o Gs. 350.000 / a&ntilde;o por comercio</span>
              </div>
            </div>
            <div className={styles.finalButtons}>
              <a href={contactHref} target={whatsappEnabled ? "_blank" : undefined} rel={whatsappEnabled ? "noopener noreferrer" : undefined} className={styles.ctaButton}>
                <MessageCircle size={18} /> Quiero probar 15 d&iacute;as
              </a>
              <button type="button" onClick={copyLink} className={styles.shareButton}>
                {copied ? <Check size={17} /> : <Copy size={17} />}
                {copied ? "Enlace copiado" : "Copiar enlace de la demo"}
              </button>
              {!whatsappEnabled && <p className={styles.contactFallback}>El contacto comercial por WhatsApp no est&aacute; configurado. Consult&aacute; la landing.</p>}
            </div>
          </div>
          <footer className={styles.footer}>
            <span>CuantoEs Califica &middot; Demostraci&oacute;n ficticia, sin datos reales</span>
            <Link href="/califica">Ver la propuesta comercial <ArrowRight size={14} /></Link>
          </footer>
        </div>
      </section>
    </main>
  );
}
