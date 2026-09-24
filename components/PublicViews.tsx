"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import ArtVisual from "./ArtVisual";
import { Artwork, collectionCopy, money } from "../lib/demo";
import { useDemo } from "./DemoProvider";

export function DemoBar({ compact = false }: { compact?: boolean }) {
  if (compact) return <a className="demo-indicator" href="/demo-information">ORVIA DEMO</a>;
  return (
    <div className="demo-bar">
      <div>
        <strong>ORVIA WEB DEMONSTRATION</strong>
        <span>This is a working concept site created to show what we can build.</span>
      </div>
      <div className="demo-actions">
        <a className="button small light" href="https://web.orvia.org.uk/start?demo=artist-pro">BUILD SOMETHING LIKE THIS</a>
        <a className="text-link light-link" href="https://web.orvia.org.uk/#showcase">VIEW ORVIA WEB</a>
      </div>
    </div>
  );
}

export function PublicHeader() {
  return (
    <header className="public-header">
      <a className="wordmark" href="/">MARA ELLISON</a>
      <nav aria-label="Main navigation">
        <a href="/work">WORK</a>
        <a href="/collections">COLLECTIONS</a>
        <a href="/about">ABOUT</a>
        <a href="/exhibitions">EXHIBITIONS</a>
        <a href="/commissions">COMMISSIONS</a>
        <a href="/contact">CONTACT</a>
        <a className="studio-link" href="/studio">STUDIO</a>
      </nav>
    </header>
  );
}

export function Status({ status }: { status: Artwork["status"] }) {
  return <span className={`status status-${status.toLowerCase().replaceAll(" ", "-")}`}>{status}</span>;
}

function ArtworkMeta({ artwork, price = true }: { artwork: Artwork; price?: boolean }) {
  return (
    <div className="art-meta">
      <div>
        <h3>{artwork.title}</h3>
        <p>{artwork.medium} · {artwork.dimensions} · {artwork.year}</p>
      </div>
      <div className="art-price">
        {price && <strong>{artwork.status === "SOLD" ? "Sold" : money(artwork.price)}</strong>}
        <Status status={artwork.status} />
      </div>
    </div>
  );
}

export function Home() {
  const { state } = useDemo();
  const hero = state.artworks.find((a) => a.slug === "winter-edge") ?? state.artworks[0];
  const tidal = state.artworks.filter((a) => a.collection === "tidal").slice(0, 5);
  const available = state.artworks.filter((a) => a.status === "AVAILABLE").slice(0, 6);

  return (
    <>
      <section className="hero editorial-dark">
        <div className="hero-copy">
          <p className="eyebrow">MARA ELLISON</p>
          <h1>PAINTINGS FROM COAST,<br />MOOR AND WEATHER.</h1>
          <p className="hero-support">Original paintings and works on paper shaped by landscape, changing weather and the edges between land and sea.</p>
          <div className="actions">
            <a className="button light" href="/work?status=available">VIEW AVAILABLE WORK</a>
            <a className="text-link light-link" href="/collections">EXPLORE COLLECTIONS</a>
          </div>
        </div>
        <a className="hero-art" href={`/work/${hero.slug}`} aria-label={`View ${hero.title}`}>
          <ArtVisual artwork={hero} />
        </a>
      </section>

      <section className="section current-collection">
        <div className="section-heading split-heading">
          <div><p className="eyebrow">CURRENT COLLECTION</p><h2>TIDAL</h2></div>
          <p>Paintings developed from repeated walks along exposed coastal edges — shifting light, salt weather and water moving across stone.</p>
        </div>
        <div className="editorial-grid">
          {tidal.map((artwork, index) => (
            <a href={`/work/${artwork.slug}`} className={`editorial-item item-${index + 1}`} key={artwork.id}>
              <ArtVisual artwork={artwork} />
              <ArtworkMeta artwork={artwork} />
            </a>
          ))}
        </div>
        <a className="button dark" href="/collections/tidal">EXPLORE TIDAL</a>
      </section>

      <section className="section warm-section">
        <div className="section-heading"><p className="eyebrow">AVAILABLE WORK</p><h2>AVAILABLE NOW</h2></div>
        <div className="work-grid">
          {available.map((artwork) => (
            <a href={`/work/${artwork.slug}`} className={`work-card ${artwork.aspect}`} key={artwork.id}>
              <ArtVisual artwork={artwork} />
              <ArtworkMeta artwork={artwork} />
              <span className="text-link">VIEW WORK</span>
            </a>
          ))}
        </div>
        <a className="button dark" href="/work?status=available">VIEW ALL AVAILABLE WORK</a>
      </section>

      <SalesPanel />
    </>
  );
}

export function WorkCatalogue() {
  const { state } = useDemo();
  const router = useRouter();
  const params = useSearchParams();
  const status = params.get("status") ?? "all";
  const collection = params.get("collection") ?? "all";
  const year = params.get("year") ?? "all";
  const medium = params.get("medium") ?? "all";

  const filtered = useMemo(() => state.artworks.filter((artwork) => {
    return (status === "all" || artwork.status.toLowerCase().replaceAll(" ", "-") === status) &&
      (collection === "all" || artwork.collection === collection) &&
      (year === "all" || String(artwork.year) === year) &&
      (medium === "all" || artwork.medium.toLowerCase().includes(medium));
  }), [state.artworks, status, collection, year, medium]);

  function change(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value === "all") next.delete(key); else next.set(key, value);
    router.replace(`/work${next.toString() ? `?${next}` : ""}`);
  }

  return (
    <section className="section catalogue-page">
      <div className="catalogue-title"><p className="eyebrow">MARA ELLISON</p><h1>WORK</h1><p>Original paintings and works on paper. Availability is updated live from the demonstration Studio.</p></div>
      <div className="filters" aria-label="Artwork filters">
        <label>STATUS<select value={status} onChange={(e) => change("status", e.target.value)}><option value="all">ALL</option><option value="available">AVAILABLE</option><option value="reserved">RESERVED</option><option value="sold">SOLD</option></select></label>
        <label>COLLECTION<select value={collection} onChange={(e) => change("collection", e.target.value)}><option value="all">ALL</option>{Object.entries(collectionCopy).map(([slug, c]) => <option key={slug} value={slug}>{c.name}</option>)}</select></label>
        <label>YEAR<select value={year} onChange={(e) => change("year", e.target.value)}><option value="all">ALL</option><option value="2026">2026</option><option value="2025">2025</option></select></label>
        <label>MEDIUM<select value={medium} onChange={(e) => change("medium", e.target.value)}><option value="all">ALL</option><option value="oil">OIL</option><option value="mixed">MIXED MEDIA</option><option value="paper">WORKS ON PAPER</option></select></label>
      </div>
      <p className="result-count">{filtered.length} WORK{filtered.length === 1 ? "" : "S"}</p>
      <div className="masonry-grid">
        {filtered.map((artwork) => (
          <a className={`masonry-item ${artwork.aspect}`} href={`/work/${artwork.slug}`} key={artwork.id}>
            <ArtVisual artwork={artwork} />
            <ArtworkMeta artwork={artwork} />
          </a>
        ))}
      </div>
      {!filtered.length && <div className="empty-state"><h2>No work matches those filters.</h2><a className="button dark" href="/work">RESET FILTERS</a></div>}
    </section>
  );
}

function SharePanel({ artwork, onClose }: { artwork: Artwork; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window === "undefined" ? `https://gallery.web.orvia.org.uk/work/${artwork.slug}` : `${window.location.origin}/work/${artwork.slug}`;
  const text = `${artwork.title}\n${artwork.medium}\n${artwork.dimensions}\n${money(artwork.price)}\nAvailable from Mara Ellison.`;
  async function copy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
  }
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="share-title" onMouseDown={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        <p className="eyebrow">SHARE WORK</p><h2 id="share-title">{artwork.title}</h2>
        <div className="qr-wrap"><QRCodeSVG value={url} size={170} /></div>
        <div className="stack-actions">
          <button className="button dark" onClick={async () => {
            if (navigator.share) await navigator.share({ title: artwork.title, text, url }); else await copy();
          }}>SHARE</button>
          <button className="button outline" onClick={copy}>{copied ? "LINK COPIED" : "COPY LINK"}</button>
          <a className="button outline" href={`mailto:?subject=${encodeURIComponent(artwork.title)}&body=${encodeURIComponent(`${text}\n\n${url}`)}`}>EMAIL DETAILS</a>
        </div>
      </div>
    </div>
  );
}

function EnquiryModal({ artwork, onClose }: { artwork: Artwork; onClose: () => void }) {
  const { setState, setAnnounce } = useDemo();
  const [sent, setSent] = useState(false);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setState((current) => ({
      ...current,
      enquiries: [{
        id: `enq-${Date.now()}`,
        name: String(data.get("name") || ""),
        email: String(data.get("email") || ""),
        telephone: String(data.get("telephone") || ""),
        artworkId: artwork.id,
        artworkTitle: artwork.title,
        message: String(data.get("message") || ""),
        preferredContact: String(data.get("preferredContact") || "Email"),
        createdAt: Date.now(),
        status: "NEW"
      }, ...current.enquiries]
    }));
    setSent(true);
    setAnnounce(`Demonstration enquiry created for ${artwork.title}.`);
  }
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <div className="modal wide-modal" role="dialog" aria-modal="true" aria-labelledby="enquiry-title" onMouseDown={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        {sent ? <div className="success-panel"><p className="eyebrow">DEMONSTRATION ONLY</p><h2>ENQUIRY CREATED</h2><p>This enquiry now appears inside Mara Studio. No real email has been sent.</p><a className="button dark" href="/studio/enquiries">VIEW IN STUDIO</a></div> : <>
          <p className="eyebrow">ENQUIRE ABOUT</p><h2 id="enquiry-title">{artwork.title}</h2>
          <p className="demo-warning">ORVIA WEB DEMONSTRATION — PLEASE DO NOT ENTER SENSITIVE OR CONFIDENTIAL INFORMATION.</p>
          <form className="form-grid" onSubmit={submit}>
            <label>NAME<input name="name" required /></label>
            <label>EMAIL<input name="email" type="email" required /></label>
            <label>TELEPHONE — OPTIONAL<input name="telephone" type="tel" /></label>
            <label>ARTWORK<input value={artwork.title} readOnly /></label>
            <label className="full">MESSAGE<textarea name="message" rows={5} required defaultValue={`I’m interested in ${artwork.title}.`} /></label>
            <label>PREFERRED CONTACT<select name="preferredContact"><option>Email</option><option>Telephone</option></select></label>
            <button className="button dark" type="submit">CREATE DEMO ENQUIRY</button>
          </form>
        </>}
      </div>
    </div>
  );
}

function ReservationModal({ artwork, onClose }: { artwork: Artwork; onClose: () => void }) {
  const { setState, setAnnounce } = useDemo();
  const [complete, setComplete] = useState(false);
  const publicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";
  const unsafeKey = publicKey.startsWith("pk_live_") || publicKey.startsWith("sk_live_");
  function reserve() {
    if (unsafeKey) return;
    setState((current) => ({ ...current, artworks: current.artworks.map((item) => item.id === artwork.id ? { ...item, status: "RESERVED", updatedAt: Date.now() } : item) }));
    setComplete(true);
    setAnnounce(`${artwork.title} marked reserved in this demonstration session.`);
  }
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="reserve-title" onMouseDown={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        {complete ? <div className="success-panel"><p className="eyebrow">DEMONSTRATION ONLY</p><h2 id="reserve-title">RESERVATION CREATED</h2><p>{artwork.title} is now marked RESERVED in this browser’s demo session. No payment was taken.</p><button className="button dark" onClick={onClose}>VIEW UPDATED WORK</button></div> : <>
          <p className="eyebrow">DEMONSTRATION RESERVATION</p><h2 id="reserve-title">RESERVE {artwork.title.toUpperCase()}</h2>
          <div className="reservation-price"><span>Illustrative reservation</span><strong>£100</strong></div>
          <p className="demo-warning strong">NO REAL PAYMENT WILL BE TAKEN.</p>
          <p>This showcase uses a simulated test transaction. A live Stripe key is explicitly refused.</p>
          {unsafeKey ? <div className="error-box">LIVE STRIPE KEY DETECTED. PAYMENT FLOW REFUSED.</div> : <button className="button dark" onClick={reserve}>CREATE TEST RESERVATION</button>}
        </>}
      </div>
    </div>
  );
}

export function ArtworkDetail({ slug }: { slug: string }) {
  const { state } = useDemo();
  const artwork = state.artworks.find((a) => a.slug === slug);
  const [share, setShare] = useState(false);
  const [enquire, setEnquire] = useState(false);
  const [reserve, setReserve] = useState(false);
  if (!artwork) return <NotFound />;
  const index = state.artworks.findIndex((a) => a.id === artwork.id);
  const previous = state.artworks[(index - 1 + state.artworks.length) % state.artworks.length];
  const next = state.artworks[(index + 1) % state.artworks.length];
  const collection = collectionCopy[artwork.collection];
  return (
    <section className="artwork-page">
      <div className="artwork-main">
        <div className="artwork-image-stage"><ArtVisual artwork={artwork} /></div>
        <div className="artwork-info">
          <p className="eyebrow">{collection?.name}</p>
          <h1>{artwork.title}</h1>
          <p className="artwork-spec">{artwork.medium}<br />{artwork.dimensions}<br />{artwork.year}</p>
          <div className="detail-price"><strong>{artwork.status === "SOLD" ? "SOLD" : money(artwork.price)}</strong><Status status={artwork.status} /></div>
          <p className="detail-copy">{artwork.description}</p>
          <div className="detail-actions">
            <button className="button dark" onClick={() => setEnquire(true)}>ENQUIRE ABOUT THIS WORK</button>
            {artwork.status === "AVAILABLE" && <button className="button outline" onClick={() => setReserve(true)}>RESERVE — DEMONSTRATION</button>}
            <button className="text-button" onClick={() => setShare(true)}>SHARE</button>
            <a className="text-link" href={`/collections/${artwork.collection}`}>VIEW COLLECTION</a>
          </div>
        </div>
      </div>
      <div className="artist-note section-narrow"><p className="eyebrow">ARTIST NOTE</p><p>{artwork.artistNote}</p></div>
      {!!artwork.detailImages?.length && <div className="detail-image-grid">{artwork.detailImages.map((src, i) => <img src={src} alt={`${artwork.title} detail ${i + 1}`} key={i} />)}</div>}
      <div className="prev-next"><a href={`/work/${previous.slug}`}>← {previous.title}</a><a href={`/work/${next.slug}`}>{next.title} →</a></div>
      {share && <SharePanel artwork={artwork} onClose={() => setShare(false)} />}
      {enquire && <EnquiryModal artwork={artwork} onClose={() => setEnquire(false)} />}
      {reserve && <ReservationModal artwork={artwork} onClose={() => setReserve(false)} />}
    </section>
  );
}

export function CollectionsPage() {
  const { state } = useDemo();
  return <section className="section"><div className="catalogue-title"><p className="eyebrow">SERIES</p><h1>COLLECTIONS</h1><p>Three bodies of work shaped by repeated routes through coast, moorland and weather.</p></div><div className="collection-list">
    {Object.entries(collectionCopy).map(([slug, collection]) => {
      const hero = state.artworks.find((a) => a.collection === slug)!;
      return <a href={`/collections/${slug}`} className="collection-row" key={slug}><ArtVisual artwork={hero} /><div><p className="eyebrow">COLLECTION</p><h2>{collection.name}</h2><p>{collection.intro}</p><span className="text-link">EXPLORE COLLECTION</span></div></a>;
    })}
  </div></section>;
}

export function CollectionPage({ slug }: { slug: string }) {
  const { state } = useDemo();
  const collection = collectionCopy[slug];
  const artworks = state.artworks.filter((a) => a.collection === slug);
  if (!collection || !artworks.length) return <NotFound />;
  return <section className="section collection-page"><div className="collection-hero"><div><p className="eyebrow">COLLECTION</p><h1>{collection.name}</h1><p>{collection.intro}</p></div><ArtVisual artwork={artworks[0]} /></div><div className="masonry-grid">{artworks.map((artwork) => <a href={`/work/${artwork.slug}`} className={`masonry-item ${artwork.aspect}`} key={artwork.id}><ArtVisual artwork={artwork} /><ArtworkMeta artwork={artwork} /></a>)}</div></section>;
}

export function About() {
  const { state } = useDemo();
  const art = state.artworks[14];
  return <section className="about-page"><div className="about-image"><ArtVisual artwork={art} /></div><div className="about-copy"><p className="eyebrow">ABOUT MARA</p><h1>THE WORK BEGINS OUTSIDE.</h1><p>{state.profile.longBio}</p><p>The studio process is slower: layers are added, erased and rebuilt until the image keeps the pressure of the weather without becoming a literal record of place.</p><p className="profile-note">Studio: {state.profile.studioLocation}<br />{state.profile.commissionAvailability}</p></div></section>;
}

export function PublicExhibitions() {
  const { state } = useDemo();
  return <section className="section"><div className="catalogue-title"><p className="eyebrow">DATES</p><h1>EXHIBITIONS</h1><p>Demonstration exhibition information for the fictional Mara Ellison Studio.</p></div><div className="exhibition-list">{state.exhibitions.map((ex) => <article className="exhibition-public" key={ex.id}><div><p className="eyebrow">{ex.city}</p><h2>{ex.title}</h2><p>{ex.venue}</p></div><div><strong>{new Date(ex.openingDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</strong><span>to</span><strong>{new Date(ex.closingDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</strong></div><p>{ex.description}</p></article>)}</div><p className="fine-print">All exhibitions shown here are fictional demonstration content.</p></section>;
}

export function Commissions() {
  return <section className="commission-page editorial-dark"><div><p className="eyebrow">COMMISSIONS</p><h1>START WITH A PLACE,<br />A SCALE OR A MEMORY.</h1><p>A commission begins with a conversation about what matters: a landscape, a particular scale, a memory of weather or simply the atmosphere you want the work to hold.</p><div className="commission-steps"><span>01 CONVERSATION</span><span>02 DIRECTION</span><span>03 SIZE</span><span>04 TIMELINE</span><span>05 STUDIO PROCESS</span><span>06 DELIVERY</span></div><a className="button light" href="/contact">DISCUSS A COMMISSION</a></div></section>;
}

export function Contact() {
  return <section className="section contact-page"><div><p className="eyebrow">CONTACT</p><h1>STUDIO ENQUIRIES</h1><p>For artwork, exhibition and commission enquiries, choose a work from the catalogue or use the demonstration contact route below.</p><p className="demo-warning">This is a fictional artist demonstration. No real artist receives messages.</p></div><div className="contact-card"><a className="button dark" href="/work?status=available">BROWSE AVAILABLE WORK</a><a className="button outline" href="/demo-information">DEMO INFORMATION</a></div></section>;
}

export function SalesPanel() {
  return <section className="sales-panel"><div><p className="eyebrow">ORVIA WEB</p><h2>YOUR WEBSITE CAN DO MORE<br />THAN DISPLAY YOUR WORK.</h2><p>Mara Ellison Studio demonstrates how an artist website can combine public presentation with a private working tool behind it.</p><div className="sales-capabilities"><span>Add work.</span><span>Change prices.</span><span>Update availability.</span><span>Manage collections.</span><span>Share a live portfolio from your phone.</span></div><div className="actions"><a className="button light" href="https://web.orvia.org.uk/start?demo=artist-pro">BUILD SOMETHING LIKE THIS</a><a className="text-link light-link" href="https://web.orvia.org.uk/">VIEW ORVIA WEB</a></div></div><div className="sales-statement"><strong>YOUR PUBLIC WEBSITE IS WHAT PEOPLE SEE.</strong><strong>YOUR WEB APP IS WHAT HELPS YOU RUN IT.</strong></div></section>;
}

export function DemoInformation() {
  const { resetDemo, state } = useDemo();
  return <section className="section demo-info-page"><p className="eyebrow">ORVIA WEB DEMONSTRATION</p><h1>DEMO INFORMATION</h1><div className="info-grid"><article><h2>FICTIONAL ARTIST</h2><p>Mara Ellison is fictional. Artwork, exhibitions, prices and availability exist only to demonstrate ORVIA Web capability.</p></article><article><h2>ISOLATED DATA</h2><p>Edits, enquiries, uploads and reservations are stored only in this browser’s demo state and expire automatically. Other visitors cannot see them.</p></article><article><h2>NO REAL PAYMENTS</h2><p>The £100 reservation is a simulated test transaction. No live payment details are requested or processed.</p></article><article><h2>NO REAL MESSAGES</h2><p>Demonstration enquiries appear inside Mara Studio only. They do not trigger email, SMS or artist communications.</p></article></div><div className="reset-box"><p>Your current demo contains {state.enquiries.length} enquir{state.enquiries.length === 1 ? "y" : "ies"} and {state.artworks.length} artworks.</p><button className="button dark" onClick={resetDemo}>RESET DEMONSTRATION</button></div></section>;
}

export function NotFound() {
  return <section className="not-found editorial-dark"><p className="eyebrow">404</p><h1>THIS WORK HAS LEFT THE STUDIO.</h1><div className="actions"><a className="button light" href="/work?status=available">VIEW AVAILABLE WORK</a><a className="text-link light-link" href="/">RETURN HOME</a><a className="text-link light-link" href="https://web.orvia.org.uk/">VIEW ORVIA WEB</a></div></section>;
}
