"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import ArtVisual from "./ArtVisual";
import { DemoBar, Status } from "./PublicViews";
import { Artwork, ArtworkStatus, Exhibition, SizeClass, collectionCopy, money } from "../lib/demo";
import { useDemo } from "./DemoProvider";

function active(path: string, target: string) {
  return path === target || (target !== "/studio" && path.startsWith(`${target}/`));
}

export function StudioShell({ path, children }: { path: string; children: React.ReactNode }) {
  return (
    <div className="studio-shell">
      <DemoBar compact />
      <header className="studio-topbar">
        <a href="/studio" className="studio-brand"><span>MARA</span><strong>STUDIO</strong></a>
        <div className="studio-top-actions"><a href="/portfolio">PORTFOLIO MODE</a><a href="/">VIEW WEBSITE ↗</a></div>
      </header>
      <aside className="studio-sidebar" aria-label="Studio navigation">
        <a className={active(path, "/studio") && path === "/studio" ? "active" : ""} href="/studio">HOME</a>
        <a className={active(path, "/studio/work") ? "active" : ""} href="/studio/work">MY WORK</a>
        <a className={active(path, "/studio/collections") ? "active" : ""} href="/studio/collections">COLLECTIONS</a>
        <a className={active(path, "/studio/enquiries") ? "active" : ""} href="/studio/enquiries">ENQUIRIES</a>
        <a className={active(path, "/studio/exhibitions") ? "active" : ""} href="/studio/exhibitions">EXHIBITIONS</a>
        <a className={active(path, "/studio/profile") ? "active" : ""} href="/studio/profile">PROFILE</a>
        <a className="sidebar-add" href="/studio/add">＋ ADD ARTWORK</a>
      </aside>
      <main className="studio-main">{children}</main>
      <nav className="studio-bottom-nav" aria-label="Mobile studio navigation">
        <a className={active(path, "/studio/work") ? "active" : ""} href="/studio/work"><span>WORK</span></a>
        <a className={active(path, "/studio/collections") ? "active" : ""} href="/studio/collections"><span>COLLECTIONS</span></a>
        <a className="bottom-add" href="/studio/add" aria-label="Add artwork"><b>＋</b><span>ADD</span></a>
        <a className={active(path, "/studio/exhibitions") ? "active" : ""} href="/studio/exhibitions"><span>EXHIBITIONS</span></a>
        <a className={active(path, "/studio/profile") ? "active" : ""} href="/studio/profile"><span>PROFILE</span></a>
      </nav>
    </div>
  );
}

export function StudioHome() {
  const { state } = useDemo();
  const counts = {
    total: state.artworks.length,
    available: state.artworks.filter((a) => a.status === "AVAILABLE").length,
    reserved: state.artworks.filter((a) => a.status === "RESERVED").length,
    sold: state.artworks.filter((a) => a.status === "SOLD").length
  };
  const recent = [...state.artworks].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 4);
  const newEnquiries = state.enquiries.filter((e) => e.status === "NEW").slice(0, 3);
  return (
    <div className="studio-page">
      <div className="studio-page-heading"><div><p className="eyebrow">GOOD EVENING</p><h1>STUDIO OVERVIEW</h1></div><a className="button dark" href="/studio/add">ADD ARTWORK</a></div>
      <div className="stat-grid">
        <article><strong>{counts.total}</strong><span>ARTWORKS</span></article>
        <article><strong>{counts.available}</strong><span>AVAILABLE</span></article>
        <article><strong>{counts.reserved}</strong><span>RESERVED</span></article>
        <article><strong>{counts.sold}</strong><span>SOLD</span></article>
      </div>
      <div className="studio-dashboard-grid">
        <section className="studio-panel span-2"><div className="panel-heading"><h2>RECENTLY UPDATED</h2><a href="/studio/work">VIEW ALL</a></div><div className="recent-list">{recent.map((artwork) => <a href={`/studio/artwork/${artwork.id}`} key={artwork.id}><div className="recent-thumb"><ArtVisual artwork={artwork} /></div><div><strong>{artwork.title}</strong><span>{collectionCopy[artwork.collection]?.name} · {money(artwork.price)}</span></div><Status status={artwork.status} /></a>)}</div></section>
        <section className="studio-panel"><div className="panel-heading"><h2>NEW ENQUIRIES</h2><a href="/studio/enquiries">OPEN</a></div>{newEnquiries.length ? <div className="compact-list">{newEnquiries.map((enq) => <a href="/studio/enquiries" key={enq.id}><strong>{enq.name}</strong><span>{enq.artworkTitle}</span></a>)}</div> : <p className="panel-empty">No new enquiries yet. Create one from a public artwork page to demonstrate the flow.</p>}</section>
        <section className="studio-panel"><div className="panel-heading"><h2>UPCOMING EXHIBITIONS</h2><a href="/studio/exhibitions">MANAGE</a></div><div className="compact-list">{state.exhibitions.slice(0, 2).map((ex) => <a href="/studio/exhibitions" key={ex.id}><strong>{ex.title}</strong><span>{ex.venue} · {ex.city}</span></a>)}</div></section>
      </div>
      <div className="quick-actions"><a href="/studio/add">ADD ARTWORK</a><a href="/work?status=available">SHOW AVAILABLE WORK</a><a href="/studio/exhibitions">ADD EXHIBITION</a><a href="/">VIEW WEBSITE</a></div>
    </div>
  );
}

export function StudioWork() {
  const { state, setState, setAnnounce } = useDemo();
  const [filter, setFilter] = useState("ALL");
  const [query, setQuery] = useState("");
  const works = state.artworks.filter((a) => (filter === "ALL" || a.status === filter) && a.title.toLowerCase().includes(query.toLowerCase()));

  function mark(id: string, status: ArtworkStatus) {
    const art = state.artworks.find((a) => a.id === id);
    if (!art) return;
    if (status === "SOLD" && !window.confirm(`MARK ${art.title.toUpperCase()} AS SOLD?`)) return;
    setState((current) => ({ ...current, artworks: current.artworks.map((item) => item.id === id ? { ...item, status, updatedAt: Date.now() } : item) }));
    setAnnounce(`${art.title} marked ${status}. Public website updated.`);
  }

  return <div className="studio-page"><div className="studio-page-heading"><div><p className="eyebrow">CATALOGUE</p><h1>MY WORK</h1></div><a className="button dark" href="/studio/add">ADD ARTWORK</a></div><div className="studio-tools"><input aria-label="Search artworks" placeholder="Search artworks" value={query} onChange={(e) => setQuery(e.target.value)} /><select aria-label="Filter by status" value={filter} onChange={(e) => setFilter(e.target.value)}><option>ALL</option><option>AVAILABLE</option><option>RESERVED</option><option>SOLD</option><option>NOT FOR SALE</option></select></div><div className="studio-art-list">{works.map((artwork) => <article className="studio-art-row" key={artwork.id}><a className="studio-art-thumb" href={`/studio/artwork/${artwork.id}`}><ArtVisual artwork={artwork} /></a><div className="studio-art-main"><a href={`/studio/artwork/${artwork.id}`}><h2>{artwork.title}</h2></a><p>{collectionCopy[artwork.collection]?.name} · {artwork.medium}</p><strong>{money(artwork.price)}</strong><Status status={artwork.status} /></div><div className="studio-art-actions"><a href={`/studio/artwork/${artwork.id}`}>EDIT</a>{artwork.status !== "SOLD" && <button onClick={() => mark(artwork.id, "SOLD")}>MARK SOLD</button>}{artwork.status !== "AVAILABLE" && <button onClick={() => mark(artwork.id, "AVAILABLE")}>MARK AVAILABLE</button>}{artwork.status !== "RESERVED" && <button onClick={() => mark(artwork.id, "RESERVED")}>MARK RESERVED</button>}<a href={`/work/${artwork.slug}`}>VIEW WEBSITE ↗</a></div></article>)}</div></div>;
}

const MAX_FILE = 1.5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

function readImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!ALLOWED_TYPES.includes(file.type)) return reject(new Error("Use JPG, PNG or WEBP."));
    if (file.size > MAX_FILE) return reject(new Error("For this browser demo, each image must be under 1.5 MB."));
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Image could not be read."));
    reader.readAsDataURL(file);
  });
}

export function ArtworkEditor({ id }: { id?: string }) {
  const { state, setState, setAnnounce } = useDemo();
  const router = useRouter();
  const existing = id ? state.artworks.find((a) => a.id === id) : undefined;
  const [mainImage, setMainImage] = useState(existing?.imageData ?? "");
  const [details, setDetails] = useState<string[]>(existing?.detailImages ?? []);
  const [uploadError, setUploadError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [published, setPublished] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);

  async function handleMain(file?: File) {
    if (!file) return;
    setUploading(true); setUploadError("");
    try { setMainImage(await readImage(file)); } catch (error) { setUploadError(error instanceof Error ? error.message : "Upload failed."); }
    setUploading(false);
  }
  async function handleDetails(files: FileList | null) {
    if (!files) return;
    const selected = Array.from(files).slice(0, 2);
    setUploading(true); setUploadError("");
    try { setDetails(await Promise.all(selected.map(readImage))); } catch (error) { setUploadError(error instanceof Error ? error.message : "Upload failed."); }
    setUploading(false);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const title = String(data.get("title") || "").trim();
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || `artwork-${Date.now()}`;
    const nextArtwork: Artwork = {
      id: existing?.id ?? `art-${Date.now()}`,
      title,
      slug,
      year: Number(data.get("year")),
      medium: String(data.get("medium")),
      dimensions: String(data.get("dimensions")),
      price: data.get("price") ? Number(data.get("price")) : null,
      status: String(data.get("status")) as ArtworkStatus,
      collection: String(data.get("collection")),
      description: String(data.get("description")),
      artistNote: String(data.get("artistNote")),
      alt: String(data.get("alt")) || `Artwork titled ${title}`,
      aspect: String(data.get("aspect")) as Artwork["aspect"],
      sizeClass: String(data.get("sizeClass")) as SizeClass,
      seed: existing?.seed ?? Math.floor(Math.random() * 900) + 100,
      imageData: mainImage || undefined,
      detailImages: details,
      updatedAt: Date.now()
    };
    setState((current) => ({ ...current, artworks: existing ? current.artworks.map((item) => item.id === existing.id ? nextArtwork : item) : [nextArtwork, ...current.artworks] }));
    setAnnounce(existing ? `${title} updated. Public website updated.` : `${title} published and added to the public catalogue.`);
    if (existing) router.push(`/studio/artwork/${nextArtwork.id}`); else setPublished(true);
  }

  if (published) {
    const title = titleRef.current?.value || "Artwork";
    const created = state.artworks.find((a) => a.title === title) ?? state.artworks[0];
    return <div className="studio-page"><div className="published-panel"><p className="eyebrow">LIVE DEMONSTRATION</p><h1>ARTWORK PUBLISHED</h1><p>The new work has been added to this visitor’s shared demo catalogue and is immediately available on the public-facing site.</p><a className="button dark" href={`/work/${created.slug}`}>VIEW ON WEBSITE</a><a className="button outline" href="/studio/work">RETURN TO MY WORK</a></div></div>;
  }

  return <div className="studio-page"><div className="studio-page-heading"><div><p className="eyebrow">{existing ? "EDIT ARTWORK" : "NEW ARTWORK"}</p><h1>{existing ? existing.title : "ADD ARTWORK"}</h1></div>{existing && <a className="button outline" href={`/work/${existing.slug}`}>VIEW ON WEBSITE ↗</a>}</div><form className="artwork-editor" onSubmit={submit}><section className="editor-panel media-editor"><div className="panel-heading"><h2>ARTWORK IMAGES</h2><span>{uploading ? "UPLOADING…" : "JPG · PNG · WEBP"}</span></div><div className="upload-preview">{mainImage ? <img src={mainImage} alt="Artwork upload preview" /> : existing ? <ArtVisual artwork={existing} /> : <div className="upload-placeholder"><strong>MAIN IMAGE *</strong><span>Choose a clear artwork image</span></div>}</div><label className="file-button">{mainImage ? "REPLACE MAIN IMAGE" : "CHOOSE MAIN IMAGE"}<input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => handleMain(e.target.files?.[0])} /></label>{mainImage && <button className="text-button" type="button" onClick={() => setMainImage("")}>REMOVE IMAGE</button>}<label className="file-button secondary">ADD DETAIL IMAGES<input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={(e) => handleDetails(e.target.files)} /></label>{details.length > 0 && <div className="detail-previews">{details.map((src, i) => <div key={i}><img src={src} alt={`Detail preview ${i + 1}`} /><button type="button" onClick={() => setDetails((current) => current.filter((_, j) => j !== i))}>REMOVE</button></div>)}</div>}{uploadError && <div className="error-box">{uploadError}</div>}<p className="fine-print">Demo upload limit: 1.5 MB per image, maximum one main image and two details. Images stay in this browser’s isolated demo data.</p></section><section className="editor-panel fields-editor"><div className="form-grid"><label>TITLE *<input ref={titleRef} name="title" required defaultValue={existing?.title} /></label><label>YEAR *<input name="year" type="number" min="1900" max="2100" required defaultValue={existing?.year ?? 2026} /></label><label>MEDIUM *<input name="medium" required defaultValue={existing?.medium ?? "Oil on linen"} /></label><label>DIMENSIONS *<input name="dimensions" required defaultValue={existing?.dimensions ?? "80 × 60 cm"} /></label><label>PRICE<input name="price" type="number" min="0" step="10" defaultValue={existing?.price ?? 1200} /></label><label>STATUS *<select name="status" defaultValue={existing?.status ?? "AVAILABLE"}><option>AVAILABLE</option><option>RESERVED</option><option>SOLD</option><option>NOT FOR SALE</option></select></label><label>COLLECTION<select name="collection" defaultValue={existing?.collection ?? "tidal"}>{Object.entries(collectionCopy).map(([slug, c]) => <option value={slug} key={slug}>{c.name}</option>)}</select></label><label>IMAGE FORMAT<select name="aspect" defaultValue={existing?.aspect ?? "portrait"}><option value="portrait">PORTRAIT</option><option value="landscape">LANDSCAPE</option><option value="square">SQUARE</option></select></label><label>SIZE<select name="sizeClass" defaultValue={existing?.sizeClass ?? "MEDIUM"}><option>STUDY</option><option>MEDIUM</option><option>LARGE</option></select></label><label className="full">DESCRIPTION<textarea name="description" rows={4} defaultValue={existing?.description ?? "A new work shaped by landscape, changing weather and repeated observation."} /></label><label className="full">ARTIST NOTES<textarea name="artistNote" rows={4} defaultValue={existing?.artistNote ?? "Built from field notes and studio studies."} /></label><label className="full">ALT TEXT<input name="alt" defaultValue={existing?.alt ?? ""} placeholder="Describe the artwork for someone who cannot see it" /></label></div><button className="button dark large-button" type="submit">{existing ? "UPDATE ARTWORK" : "PUBLISH ARTWORK"}</button></section></form></div>;
}

export function StudioArtwork({ id }: { id: string }) {
  const { state, setState, setAnnounce } = useDemo();
  const [editMode, setEditMode] = useState(false);
  const artwork = state.artworks.find((a) => a.id === id);
  if (!artwork) return <div className="studio-page"><h1>Artwork not found</h1><a href="/studio/work">RETURN TO MY WORK</a></div>;
  if (editMode) return <ArtworkEditor id={id} />;
  function mark(status: ArtworkStatus) {
    const currentArtwork = state.artworks.find((item) => item.id === id);
    if (!currentArtwork) return;
    if (status === "SOLD" && !window.confirm(`MARK ${currentArtwork.title.toUpperCase()} AS SOLD?`)) return;
    setState((current) => ({ ...current, artworks: current.artworks.map((item) => item.id === currentArtwork.id ? { ...item, status, updatedAt: Date.now() } : item) }));
    setAnnounce(`${currentArtwork.title} marked ${status}. Public site updated.`);
  }
  return <div className="studio-page"><div className="studio-detail-layout"><div className="studio-detail-art"><ArtVisual artwork={artwork} /></div><div className="studio-detail-info"><p className="eyebrow">{collectionCopy[artwork.collection]?.name}</p><h1>{artwork.title}</h1><p>{artwork.medium}<br />{artwork.dimensions}<br />{artwork.year}</p><div className="studio-detail-price"><strong>{money(artwork.price)}</strong><Status status={artwork.status} /></div><p>{artwork.description}</p><div className="stack-actions"><button className="button dark" onClick={() => setEditMode(true)}>EDIT ARTWORK</button>{artwork.status !== "SOLD" && <button className="button outline" onClick={() => mark("SOLD")}>MARK SOLD</button>}{artwork.status !== "AVAILABLE" && <button className="button outline" onClick={() => mark("AVAILABLE")}>MARK AVAILABLE</button>}{artwork.status !== "RESERVED" && <button className="button outline" onClick={() => mark("RESERVED")}>MARK RESERVED</button>}<a className="text-link" href={`/work/${artwork.slug}`}>VIEW ON WEBSITE ↗</a></div></div></div></div>;
}

export function StudioCollections() {
  const { state } = useDemo();
  return <div className="studio-page"><div className="studio-page-heading"><div><p className="eyebrow">ORGANISE WORK</p><h1>COLLECTIONS</h1></div></div><div className="studio-collection-grid">{Object.entries(collectionCopy).map(([slug, collection]) => { const works = state.artworks.filter((a) => a.collection === slug); const hero = works[0]; return <article key={slug}>{hero && <div className="collection-mini-art"><ArtVisual artwork={hero} /></div>}<div><h2>{collection.name}</h2><p>{works.length} artworks · {works.filter((a) => a.status === "AVAILABLE").length} available</p><a href={`/collections/${slug}`}>VIEW PUBLIC COLLECTION ↗</a></div></article>; })}</div></div>;
}

export function StudioEnquiries() {
  const { state, setState, setAnnounce } = useDemo();
  function update(id: string, status: "RESPONDED" | "ARCHIVED") {
    setState((current) => ({ ...current, enquiries: current.enquiries.map((e) => e.id === id ? { ...e, status } : e) }));
    setAnnounce(`Enquiry marked ${status.toLowerCase()}.`);
  }
  return <div className="studio-page"><div className="studio-page-heading"><div><p className="eyebrow">PUBLIC WEBSITE</p><h1>ENQUIRIES</h1></div></div>{!state.enquiries.length ? <div className="empty-studio-panel"><h2>NO ENQUIRIES YET</h2><p>Open a public artwork and create a demonstration enquiry. It will appear here immediately.</p><a className="button dark" href="/work?status=available">OPEN AVAILABLE WORK</a></div> : <div className="enquiry-list">{state.enquiries.map((enquiry) => <article className={`enquiry-card ${enquiry.status.toLowerCase()}`} key={enquiry.id}><div className="enquiry-meta"><span>{new Date(enquiry.createdAt).toLocaleString("en-GB")}</span><strong>{enquiry.status}</strong></div><h2>{enquiry.name}</h2><p className="enquiry-art">{enquiry.artworkTitle}</p><p>{enquiry.message}</p><div className="enquiry-contact"><span>{enquiry.email}</span>{enquiry.telephone && <span>{enquiry.telephone}</span>}<span>Prefers {enquiry.preferredContact}</span></div><div className="actions compact">{enquiry.status !== "RESPONDED" && <button className="button dark" onClick={() => update(enquiry.id, "RESPONDED")}>MARK RESPONDED</button>}{enquiry.status !== "ARCHIVED" && <button className="button outline" onClick={() => update(enquiry.id, "ARCHIVED")}>ARCHIVE</button>}{enquiry.artworkId && <a className="text-link" href={`/studio/artwork/${enquiry.artworkId}`}>VIEW ARTWORK</a>}</div></article>)}</div>}</div>;
}

export function StudioExhibitions() {
  const { state, setState, setAnnounce } = useDemo();
  const [editing, setEditing] = useState<Exhibition | null>(null);
  const [showForm, setShowForm] = useState(false);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const ex: Exhibition = {
      id: editing?.id ?? `ex-${Date.now()}`,
      title: String(data.get("title")),
      venue: String(data.get("venue")),
      city: String(data.get("city")),
      openingDate: String(data.get("openingDate")),
      closingDate: String(data.get("closingDate")),
      privateView: String(data.get("privateView")),
      description: String(data.get("description")),
      worksIncluded: String(data.get("worksIncluded") || "").split(",").map((x) => x.trim()).filter(Boolean)
    };
    setState((current) => ({ ...current, exhibitions: editing ? current.exhibitions.map((item) => item.id === editing.id ? ex : item) : [...current.exhibitions, ex] }));
    setAnnounce(`Exhibition ${editing ? "updated" : "added"}. Public exhibitions page updated.`);
    setEditing(null); setShowForm(false);
  }
  function openEdit(ex: Exhibition) { setEditing(ex); setShowForm(true); }
  return <div className="studio-page"><div className="studio-page-heading"><div><p className="eyebrow">DATES & VENUES</p><h1>EXHIBITIONS</h1></div><button className="button dark" onClick={() => { setEditing(null); setShowForm(true); }}>ADD EXHIBITION</button></div><p className="demo-warning">All exhibitions in this showcase are fictional demonstration content.</p>{showForm && <form className="exhibition-form editor-panel" onSubmit={submit}><div className="panel-heading"><h2>{editing ? "EDIT EXHIBITION" : "NEW EXHIBITION"}</h2><button type="button" onClick={() => setShowForm(false)}>CLOSE</button></div><div className="form-grid"><label>TITLE<input name="title" required defaultValue={editing?.title} /></label><label>VENUE<input name="venue" required defaultValue={editing?.venue} /></label><label>CITY<input name="city" required defaultValue={editing?.city} /></label><label>OPENING DATE<input name="openingDate" type="date" required defaultValue={editing?.openingDate} /></label><label>CLOSING DATE<input name="closingDate" type="date" required defaultValue={editing?.closingDate} /></label><label>PRIVATE VIEW<input name="privateView" type="date" defaultValue={editing?.privateView} /></label><label className="full">DESCRIPTION<textarea name="description" rows={4} defaultValue={editing?.description} /></label><label className="full">WORKS INCLUDED — IDs, COMMA SEPARATED<input name="worksIncluded" defaultValue={editing?.worksIncluded.join(", ")} /></label></div><button className="button dark" type="submit">{editing ? "UPDATE EXHIBITION" : "ADD EXHIBITION"}</button></form>}<div className="studio-exhibition-list">{state.exhibitions.map((ex) => <article key={ex.id}><div><p className="eyebrow">{ex.city}</p><h2>{ex.title}</h2><p>{ex.venue}</p></div><div><span>{ex.openingDate}</span><span>—</span><span>{ex.closingDate}</span></div><button onClick={() => openEdit(ex)}>EDIT</button></article>)}</div></div>;
}

export function StudioProfile() {
  const { state, setState, setAnnounce } = useDemo();
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setState((current) => ({ ...current, profile: {
      artistName: String(data.get("artistName")),
      shortBio: String(data.get("shortBio")),
      longBio: String(data.get("longBio")),
      studioLocation: String(data.get("studioLocation")),
      contactEmail: String(data.get("contactEmail")),
      instagram: String(data.get("instagram")),
      commissionAvailability: String(data.get("commissionAvailability"))
    }}));
    setAnnounce("Artist profile updated. Public About page updated.");
  }
  const p = state.profile;
  return <div className="studio-page"><div className="studio-page-heading"><div><p className="eyebrow">PUBLIC PROFILE</p><h1>ARTIST PROFILE</h1></div><a className="button outline" href="/about">VIEW ABOUT PAGE ↗</a></div><form className="profile-form editor-panel" onSubmit={submit}><div className="form-grid"><label>ARTIST NAME<input name="artistName" defaultValue={p.artistName} /></label><label>STUDIO LOCATION<input name="studioLocation" defaultValue={p.studioLocation} /></label><label>CONTACT EMAIL<input name="contactEmail" type="email" defaultValue={p.contactEmail} /></label><label>INSTAGRAM<input name="instagram" defaultValue={p.instagram} /></label><label className="full">SHORT BIO<textarea name="shortBio" rows={3} defaultValue={p.shortBio} /></label><label className="full">LONG BIO<textarea name="longBio" rows={6} defaultValue={p.longBio} /></label><label className="full">COMMISSION AVAILABILITY<input name="commissionAvailability" defaultValue={p.commissionAvailability} /></label></div><button className="button dark" type="submit">UPDATE PROFILE</button></form></div>;
}

export function PortfolioMode() {
  const { state, setState, setAnnounce } = useDemo();
  const [collection, setCollection] = useState("all");
  const [price, setPrice] = useState("all");
  const [size, setSize] = useState("all");
  const [index, setIndex] = useState(0);
  const [showQr, setShowQr] = useState(false);

  const artworks = useMemo(() => state.artworks.filter((a) => a.status === "AVAILABLE" && (collection === "all" || a.collection === collection) && (price === "all" || (price === "under-1000" && (a.price ?? Infinity) < 1000) || (price === "1000-2000" && (a.price ?? 0) >= 1000 && (a.price ?? Infinity) <= 2000) || (price === "2000-plus" && (a.price ?? 0) > 2000)) && (size === "all" || a.sizeClass === size)), [state.artworks, collection, price, size]);
  const safeIndex = artworks.length ? index % artworks.length : 0;
  const artwork = artworks[safeIndex];
  const url = artwork ? (typeof window === "undefined" ? `https://gallery.web.orvia.org.uk/work/${artwork.slug}` : `${window.location.origin}/work/${artwork.slug}`) : "https://gallery.web.orvia.org.uk/work";

  function reserve() {
    if (!artwork) return;
    setState((current) => ({ ...current, artworks: current.artworks.map((item) => item.id === artwork.id ? { ...item, status: "RESERVED", updatedAt: Date.now() } : item) }));
    setAnnounce(`${artwork.title} marked reserved in this demo session.`);
    setIndex(0);
  }
  async function share() {
    if (!artwork) return;
    const text = `${artwork.title}\n${artwork.medium}\n${artwork.dimensions}\n${money(artwork.price)}\nAvailable from Mara Ellison.`;
    if (navigator.share) await navigator.share({ title: artwork.title, text, url }); else setShowQr(true);
  }
  return <div className="portfolio-mode"><DemoBar compact /><header className="portfolio-header"><a href="/" className="portfolio-brand">MARA ELLISON</a><span>AVAILABLE PORTFOLIO</span><a href="/studio">STUDIO</a></header><div className="portfolio-filters"><label>COLLECTION<select value={collection} onChange={(e) => { setCollection(e.target.value); setIndex(0); }}><option value="all">ALL AVAILABLE</option>{Object.entries(collectionCopy).map(([slug, c]) => <option value={slug} key={slug}>{c.name}</option>)}</select></label><label>PRICE<select value={price} onChange={(e) => { setPrice(e.target.value); setIndex(0); }}><option value="all">ANY PRICE</option><option value="under-1000">UNDER £1,000</option><option value="1000-2000">£1,000–£2,000</option><option value="2000-plus">£2,000+</option></select></label><label>SIZE<select value={size} onChange={(e) => { setSize(e.target.value); setIndex(0); }}><option value="all">ANY SIZE</option><option>STUDY</option><option>MEDIUM</option><option>LARGE</option></select></label></div>{artwork ? <main className="portfolio-stage"><div className="portfolio-art"><ArtVisual artwork={artwork} /></div><div className="portfolio-info"><p className="eyebrow">{collectionCopy[artwork.collection]?.name}</p><h1>{artwork.title}</h1><p>{artwork.medium}<br />{artwork.dimensions}</p><div className="portfolio-price"><strong>{money(artwork.price)}</strong><Status status={artwork.status} /></div><div className="portfolio-controls"><button onClick={() => setIndex((i) => (i - 1 + artworks.length) % artworks.length)}>← PREVIOUS</button><span>{safeIndex + 1} / {artworks.length}</span><button onClick={() => setIndex((i) => (i + 1) % artworks.length)}>NEXT →</button></div><div className="portfolio-actions"><button onClick={share}>SHARE</button><a href={`/work/${artwork.slug}`}>ENQUIRE</a><button onClick={reserve}>RESERVE</button></div></div></main> : <div className="portfolio-empty"><h1>NO AVAILABLE WORK MATCHES THESE FILTERS.</h1><button onClick={() => { setCollection("all"); setPrice("all"); setSize("all"); }}>RESET FILTERS</button></div>}{showQr && artwork && <div className="portfolio-qr"><button onClick={() => setShowQr(false)} aria-label="Close">×</button><QRCodeSVG value={url} size={190} /><strong>{artwork.title}</strong><button onClick={() => navigator.clipboard.writeText(url)}>COPY LINK</button></div>}</div>;
}
