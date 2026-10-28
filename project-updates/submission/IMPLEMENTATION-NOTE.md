# Implementation note — Junior Website Builder Home project

**Candidate:** Ghea (replace with legal name on PDF if required)  
**Live site:** https://marci-websiteredesign.vercel.app/  
**Reference:** [marcimetzger.com](https://marcimetzger.com/) Home page only

## Tools and approach

I rebuilt the reference Home as a single scroll page using **Next.js 16**, **React 19**, and **CSS Modules**, hosted on **Vercel**. Content from the original site (sales stats, seller/buyer messaging, three service narratives, contact details, and office hours) is organized into clear sections with consistent typography and spacing. I added allowed extras—Meet Marci bio, featured IDX listings, testimonials, photo gallery, and a partner logo strip—to strengthen trust and lead generation beyond the GoDaddy template.

Listing search uses **IDX Broker** query parameters via a custom `ListingSearch` component so visitors can filter by location, type, price, and amenities and land on The Ridge Realty search results—the same intent as the reference “Find Your Dream Home / Search Listings” block, but with a richer UI.

The contact form validates input on the client and shows a clear **demo** success message (no email is sent in this test deployment), so reviewers are not left guessing whether submission worked.

## One design decision

I **consolidated “GET IT SOLD” into one “Proven Results” band** instead of copying the reference’s stacked blocks verbatim. The section opens with the reference sales story (including the 90 clients / $28.5M headline), animates the key stats for scanability, then pairs **Don’t Just List It** and **Guide to Buyers** as two image-led cards with direct CTAs to contact or property search. That separation keeps proof (numbers) distinct from emotional CTAs (sell/buy), reduces repetitive scrolling, and reads more like a modern agent site while preserving all required copy.

Hero imagery uses the **reference pond photograph** downloaded from the live client site, per assignment guidance.

---

*Attach this note (PDF or DOCX) with your resume when emailing phcareers@luxurypresence.com.*
