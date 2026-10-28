"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { validateContactForm } from "../lib/contactFormValidation";
import styles from "./ContactSection.module.css";

const SUBJECT_MENU_Z_INDEX = 201;
const SUBJECT_MENU_GAP = 8;
const SUBJECT_MENU_GUTTER = 8;
const SUBJECT_MENU_MAX_HEIGHT = 12 * 16;
const SUBJECT_PLACEHOLDER = "Select a subject";

const ADDRESS = "3190 HW-160, Suite F, Pahrump, Nevada 89048, United States";
const MAP_LAT = 36.184249;
const MAP_LNG = -115.955253;
const MAP_QUERY = encodeURIComponent(ADDRESS);
const MAP_SRC = `https://maps.google.com/maps?q=${MAP_LAT},${MAP_LNG}+(${MAP_QUERY})&z=16&hl=en&output=embed&iwloc=A`;
const MAP_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  ADDRESS,
)}`;

const SUBJECT_OPTIONS = [
  { value: "Buying a property or selling", label: "Buying a property or selling" },
  { value: "General inquiry", label: "General inquiry" },
  { value: "Other", label: "Other" },
];

const INITIAL_FORM = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

function computeSubjectMenuPosition(
  anchor,
  measuredHeight = SUBJECT_MENU_MAX_HEIGHT,
) {
  const rect = anchor.getBoundingClientRect();
  const width = Math.min(
    rect.width,
    window.innerWidth - SUBJECT_MENU_GUTTER * 2,
  );
  let left = rect.left;
  left = Math.max(
    SUBJECT_MENU_GUTTER,
    Math.min(left, window.innerWidth - width - SUBJECT_MENU_GUTTER),
  );

  const maxPanelHeight = Math.min(SUBJECT_MENU_MAX_HEIGHT, measuredHeight);
  const spaceBelow = window.innerHeight - rect.bottom - SUBJECT_MENU_GUTTER;
  const spaceAbove = rect.top - SUBJECT_MENU_GUTTER;
  const placeAbove =
    spaceBelow < maxPanelHeight + SUBJECT_MENU_GAP && spaceAbove > spaceBelow;

  if (placeAbove) {
    return {
      placement: "above",
      left,
      width,
      top: null,
      bottom: window.innerHeight - rect.top + SUBJECT_MENU_GAP,
      maxHeight: Math.min(SUBJECT_MENU_MAX_HEIGHT, spaceAbove - SUBJECT_MENU_GAP),
    };
  }

  return {
    placement: "below",
    left,
    width,
    top: rect.bottom + SUBJECT_MENU_GAP,
    bottom: null,
    maxHeight: Math.min(SUBJECT_MENU_MAX_HEIGHT, spaceBelow - SUBJECT_MENU_GAP),
  };
}

function SubjectSelect({
  id,
  value,
  onChange,
  hasError,
  describedBy,
}) {
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState(null);

  const selectedLabel =
    SUBJECT_OPTIONS.find((option) => option.value === value)?.label ??
    SUBJECT_PLACEHOLDER;

  const updateMenuPosition = useCallback(() => {
    const trigger = triggerRef.current;
    const menu = menuRef.current;
    if (!trigger) return;

    const measuredHeight = menu?.offsetHeight ?? SUBJECT_MENU_MAX_HEIGHT;
    setMenuPosition(computeSubjectMenuPosition(trigger, measuredHeight));
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setMenuPosition(null);
      return undefined;
    }

    if (triggerRef.current) {
      setMenuPosition(computeSubjectMenuPosition(triggerRef.current));
    }

    const onPointerDown = (event) => {
      const target = event.target;
      if (!(target instanceof Node)) return;

      if (
        triggerRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }

      setIsOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("resize", updateMenuPosition);
    window.addEventListener("scroll", updateMenuPosition, true);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("resize", updateMenuPosition);
      window.removeEventListener("scroll", updateMenuPosition, true);
    };
  }, [isOpen, updateMenuPosition]);

  useLayoutEffect(() => {
    if (!isOpen) return undefined;

    updateMenuPosition();
    const menu = menuRef.current;
    if (!menu) return undefined;

    const resizeObserver = new ResizeObserver(() => {
      updateMenuPosition();
    });
    resizeObserver.observe(menu);

    return () => {
      resizeObserver.disconnect();
    };
  }, [isOpen, updateMenuPosition]);

  const menu =
    isOpen && menuPosition
      ? createPortal(
          <ul
            ref={menuRef}
            className={styles.subjectMenu}
            role="listbox"
            aria-label="Subject"
            data-placement={menuPosition.placement}
            style={{
              position: "fixed",
              left: menuPosition.left,
              width: menuPosition.width,
              maxHeight: menuPosition.maxHeight,
              zIndex: SUBJECT_MENU_Z_INDEX,
              ...(menuPosition.top != null ? { top: menuPosition.top } : {}),
              ...(menuPosition.bottom != null
                ? { bottom: menuPosition.bottom }
                : {}),
            }}
          >
            <li role="presentation">
              <button
                type="button"
                role="option"
                className={styles.subjectMenuOption}
                aria-selected={value === ""}
                onClick={() => {
                  onChange("");
                  setIsOpen(false);
                }}
              >
                {SUBJECT_PLACEHOLDER}
              </button>
            </li>
            {SUBJECT_OPTIONS.map((option) => (
              <li key={option.value} role="presentation">
                <button
                  type="button"
                  role="option"
                  className={styles.subjectMenuOption}
                  aria-selected={value === option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>,
          document.body,
        )
      : null;

  return (
    <>
      <div
        className={`${styles.control} ${styles.controlSelect} ${
          isOpen ? styles.controlSelectOpen : ""
        }`}
      >
        <span className={styles.controlIcon}>
          <SubjectIcon />
        </span>
        <div className={styles.subjectSelectWrap}>
          <button
            ref={triggerRef}
            type="button"
            id={id}
            className={styles.subjectSelectTrigger}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-invalid={hasError ? "true" : undefined}
            aria-describedby={describedBy}
            onClick={() => setIsOpen((open) => !open)}
          >
            <span
              className={
                value
                  ? styles.subjectSelectValue
                  : styles.subjectSelectPlaceholder
              }
            >
              {selectedLabel}
            </span>
          </button>
          <span className={styles.chevron} aria-hidden="true">
            <ChevronIcon />
          </span>
          <input type="hidden" name="subject" value={value} />
        </div>
      </div>
      {menu}
    </>
  );
}

function UserIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="8" r="3.25" />
      <path d="M5.5 19.25a6.5 6.5 0 0 1 13 0" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3.5" y="5.5" width="17" height="13" rx="1.5" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 6.5h14v9H8.5L5 18.5v-12Z" />
    </svg>
  );
}

function SubjectIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 7h8M8 12h8M8 17h5" />
      <rect x="4" y="4" width="16" height="16" rx="1.5" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export default function ContactSection() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [submitMessage, setSubmitMessage] = useState("");

  const updateField = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => {
      if (!current[name]) return current;
      const next = { ...current };
      delete next[name];
      return next;
    });
    if (status === "success") setStatus("idle");
    if (submitMessage) setSubmitMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validateContactForm(form);
    setErrors(nextErrors);
    setSubmitMessage("");

    if (Object.keys(nextErrors).length > 0) {
      setStatus("error");
      setSubmitMessage("Please correct the highlighted fields and try again.");
      return;
    }

    setStatus("submitting");

    // Demo only — validates input but does not send email or call the API.
    await new Promise((resolve) => {
      window.setTimeout(resolve, 450);
    });

    setStatus("success");
    setErrors({});
    setForm(INITIAL_FORM);
    setSubmitMessage(
      "Thank you! This is a demo — your message was not emailed. In a live setup, Marci would receive your details.",
    );
  };

  return (
    <section id="contact" className={`section ${styles.section}`}>
      <div className={styles.inner}>
        <header className={styles.intro}>
          <p className="eyebrow">Contact &amp; Location</p>
          <h2>Get in Touch</h2>
          <p className={styles.lead}>
            Have questions about buying or selling?
            <br />
            Get in touch with Marci.
          </p>
        </header>

        <div className={styles.layout}>
          <form className={styles.form} noValidate onSubmit={handleSubmit}>
            <div className={styles.formIntro}>
              <h3>Send Marci a Message</h3>
              <p>
                Fill out the form below and Marci will get back to you as soon as
                possible.
              </p>
            </div>

            <div className={styles.field}>
              <label htmlFor="contact-name">Name</label>
              <div className={styles.control}>
                <span className={styles.controlIcon}>
                  <UserIcon />
                </span>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Jane Smith"
                  value={form.name}
                  aria-invalid={errors.name ? "true" : undefined}
                  aria-describedby={errors.name ? "contact-name-error" : undefined}
                  onChange={(event) => updateField("name", event.target.value)}
                />
              </div>
              {errors.name ? (
                <p id="contact-name-error" className={styles.fieldError} role="alert">
                  {errors.name}
                </p>
              ) : null}
            </div>

            <div className={styles.field}>
              <label htmlFor="contact-email">Email</label>
              <div className={styles.control}>
                <span className={styles.controlIcon}>
                  <MailIcon />
                </span>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="jane.smith@email.com"
                  value={form.email}
                  aria-invalid={errors.email ? "true" : undefined}
                  aria-describedby={errors.email ? "contact-email-error" : undefined}
                  onChange={(event) => updateField("email", event.target.value)}
                />
              </div>
              {errors.email ? (
                <p id="contact-email-error" className={styles.fieldError} role="alert">
                  {errors.email}
                </p>
              ) : null}
            </div>

            <div className={styles.field}>
              <label htmlFor="contact-subject">Subject</label>
              <SubjectSelect
                id="contact-subject"
                value={form.subject}
                onChange={(next) => updateField("subject", next)}
                hasError={Boolean(errors.subject)}
                describedBy={
                  errors.subject ? "contact-subject-error" : undefined
                }
              />
              {errors.subject ? (
                <p
                  id="contact-subject-error"
                  className={styles.fieldError}
                  role="alert"
                >
                  {errors.subject}
                </p>
              ) : null}
            </div>

            <div className={styles.field}>
              <label htmlFor="contact-message">Message</label>
              <div className={`${styles.control} ${styles.controlTextarea}`}>
                <span className={styles.controlIcon}>
                  <MessageIcon />
                </span>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={3}
                  placeholder="Tell Marci how she can help"
                  value={form.message}
                  aria-invalid={errors.message ? "true" : undefined}
                  aria-describedby={
                    errors.message ? "contact-message-error" : undefined
                  }
                  onChange={(event) => updateField("message", event.target.value)}
                />
              </div>
              {errors.message ? (
                <p
                  id="contact-message-error"
                  className={styles.fieldError}
                  role="alert"
                >
                  {errors.message}
                </p>
              ) : null}
            </div>

            <div className={styles.formFooter}>
              <button
                type="submit"
                className={`btn btn--primary ${styles.submit}`}
                disabled={status === "submitting"}
                aria-busy={status === "submitting"}
              >
                {status === "submitting" ? "Submitting…" : "Submit"}
                <ArrowRightIcon />
              </button>
              <p
                className={
                  status === "error"
                    ? `${styles.status} ${styles.statusError}`
                    : styles.status
                }
                role="status"
                aria-live="polite"
              >
                {submitMessage || null}
              </p>
            </div>
          </form>

          <div className={styles.map}>
            <iframe
              title="Map showing 3190 HW-160, Suite F, Pahrump, Nevada 89048"
              src={MAP_SRC}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <aside className={styles.mapCard}>
              <p className={styles.mapCardTitle}>3190 HW-160, Suite F</p>
              <p className={styles.mapCardAddress}>
                Pahrump, Nevada 89048, United States
              </p>
              <a href={MAP_LINK} target="_blank" rel="noreferrer">
                Open in Maps
              </a>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
