"use client";

import Image from "next/image";
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
const PHONE_DISPLAY = "(206) 919-6886";
const PHONE_TEL = "+12069196886";
const MAP_LAT = 36.184249;
const MAP_LNG = -115.955253;
const MAP_QUERY = encodeURIComponent(ADDRESS);
const MAP_SRC = `https://maps.google.com/maps?q=${MAP_LAT},${MAP_LNG}+(${MAP_QUERY})&z=16&hl=en&output=embed&iwloc=A`;
const MAP_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  ADDRESS,
)}`;

const DAILY_HOURS = "8:00 am – 7:00 pm";

const WEEK_HOURS = [
  { id: "sunday", label: "Sunday" },
  { id: "monday", label: "Monday" },
  { id: "tuesday", label: "Tuesday" },
  { id: "wednesday", label: "Wednesday" },
  { id: "thursday", label: "Thursday" },
  { id: "friday", label: "Friday" },
  { id: "saturday", label: "Saturday" },
];

const SOCIALS = [
  {
    id: "yelp",
    label: "Yelp",
    href: "https://www.yelp.com/biz/xr3yQN_m2SgO0R_7S6p62w",
    iconSrc: "/images/social/yelp.png",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/marci-metzger-30642496/",
    iconSrc: "/images/social/linkedin.png",
  },
  {
    id: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/marcimetzger_theridge/",
    iconSrc: "/images/social/instagram.png",
  },
  {
    id: "facebook",
    label: "Facebook",
    href: "https://www.facebook.com/MarciHomes/",
    iconSrc: "/images/social/facebook.png",
  },
];

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

function PinIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 21s7-4.5 7-10a7 7 0 1 0-14 0c0 5.5 7 10 7 10Z" />
      <circle cx="12" cy="11" r="2.5" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v6l4 2" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 3.5h3l1.2 3.2-1.8 1.1a12 12 0 0 0 5.8 5.8l1.1-1.8 3.2 1.2v3A2 2 0 0 1 18.5 18 15.5 15.5 0 0 1 6 5.5 2 2 0 0 1 8 3.5Z" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="6" cy="12" r="2.25" />
      <circle cx="17" cy="6.5" r="2.25" />
      <circle cx="17" cy="17.5" r="2.25" />
      <path d="M8 11.2 14.8 7.6M8.1 13.1l6.7 3.4" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6M12 8h.01" />
    </svg>
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
  const [todayIndex, setTodayIndex] = useState(null);

  useEffect(() => {
    setTodayIndex(new Date().getDay());
  }, []);

  const todayLabel = WEEK_HOURS[todayIndex]?.label ?? "today";
  const [showAllHours, setShowAllHours] = useState(false);
  const [showHoursNote, setShowHoursNote] = useState(false);
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
      return;
    }

    setStatus("submitting");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          subject: form.subject,
          message: form.message.trim(),
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (data.fieldErrors) {
          setErrors(data.fieldErrors);
        }
        setStatus("error");
        setSubmitMessage(
          data.error ||
            "We could not send your confirmation email. Please try again.",
        );
        return;
      }

      setStatus("success");
      setForm(INITIAL_FORM);
      setSubmitMessage(
        "Thank you. A confirmation email with your message details was sent to the address you provided.",
      );
    } catch {
      setStatus("error");
      setSubmitMessage(
        "Network error. Check your connection and try again.",
      );
    }
  };

  return (
    <section id="contact" className={`section ${styles.section}`}>
      <div className={styles.inner}>
        <header className={styles.intro}>
          <p className="eyebrow">Contact &amp; Location</p>
          <h2>Get in Touch</h2>
          <p className={styles.lead}>
            Have questions about buying or selling? Get in touch with Marci.
          </p>
        </header>

        <ul className={styles.details}>
          <li className={styles.detail}>
            <span className={styles.icon}>
              <PinIcon />
            </span>
            <div className={styles.detailContent}>
              <h3 className={styles.detailTitle}>Location</h3>
              <address className={styles.detailBody}>
                <p>{ADDRESS}</p>
                <a href={MAP_LINK} target="_blank" rel="noreferrer">
                  View on Google Maps
                </a>
              </address>
            </div>
          </li>

          <li className={styles.detail}>
            <span className={styles.icon}>
              <ClockIcon />
            </span>
            <div className={styles.detailContent}>
              <h3 className={styles.detailTitle}>Office Hours</h3>
              <div className={styles.detailBody}>
                <p>
                  Open today: {todayLabel}, {DAILY_HOURS}
                </p>
                <p>Open daily: {DAILY_HOURS}</p>
                <div className={styles.hoursActions}>
                  <button
                    type="button"
                    className={styles.hoursToggle}
                    aria-expanded={showAllHours}
                    aria-controls="office-hours-list"
                    onClick={() => setShowAllHours((open) => !open)}
                  >
                    {showAllHours ? "Hide other times" : "Show other times"}
                  </button>
                  <div className={styles.infoWrap}>
                    <button
                      type="button"
                      className={styles.infoButton}
                      aria-expanded={showHoursNote}
                      aria-controls="hours-note"
                      onClick={() => setShowHoursNote((open) => !open)}
                    >
                      <InfoIcon />
                      <span className="visually-hidden">
                        Appointments outside office hours
                      </span>
                    </button>
                    <p
                      id="hours-note"
                      className={
                        showHoursNote
                          ? `${styles.infoTip} ${styles.infoTipOpen}`
                          : styles.infoTip
                      }
                      role="note"
                    >
                      Appointments outside office hours available upon request.
                      Just call!
                    </p>
                  </div>
                </div>
                {showAllHours ? (
                  <ul id="office-hours-list" className={styles.hoursList}>
                    {WEEK_HOURS.map((day, index) => (
                      <li
                        key={day.id}
                        className={index === todayIndex ? styles.hoursToday : undefined}
                        aria-current={index === todayIndex ? "date" : undefined}
                      >
                        <span>{day.label}</span>
                        <span>{DAILY_HOURS}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>
          </li>

          <li className={styles.detail}>
            <span className={styles.icon}>
              <PhoneIcon />
            </span>
            <div className={styles.detailContent}>
              <h3 className={styles.detailTitle}>Contact Number</h3>
              <div className={styles.detailBody}>
                <p>Give Marci a call. She’ll be happy to help with your real estate needs.</p>
                <a href={`tel:${PHONE_TEL}`}>{PHONE_DISPLAY}</a>
              </div>
            </div>
          </li>

          <li className={styles.detail}>
            <span className={styles.icon}>
              <ShareIcon />
            </span>
            <div className={styles.detailContent}>
              <h3 className={styles.detailTitle}>Follow Us</h3>
              <div className={styles.detailBody}>
                <p>Connect with Marci on social media.</p>
                <ul className={styles.socials}>
                  {SOCIALS.map((social) => (
                    <li key={social.id}>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                      >
                        <Image
                          src={social.iconSrc}
                          alt=""
                          width={24}
                          height={24}
                          unoptimized
                          className={styles.socialIcon}
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </li>
        </ul>

        <div className={styles.layout}>
          <form className={styles.form} noValidate onSubmit={handleSubmit}>
            <div className={styles.formIntro}>
              <h3>Contact Us</h3>
              <p>Fill out the form below and Marci will get back to you as soon as possible.</p>
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
                {status === "submitting" ? "Sending…" : "Submit"}
                <ArrowRightIcon />
              </button>
              <p
                className={
                  status === "error" && submitMessage
                    ? `${styles.status} ${styles.statusError}`
                    : styles.status
                }
                role="status"
                aria-live="polite"
              >
                {status === "error" && !submitMessage
                  ? "Please correct the highlighted fields and try again."
                  : null}
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
