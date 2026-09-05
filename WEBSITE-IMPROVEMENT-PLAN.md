# Dibaj — revised implementation plan

Revision 3 · 5 September 2026 · Planning deliverable; website implementation has not started under this plan.

## 1. Objective and agreed scope

Deliver a formal Arabic website introducing Dibaj, its furniture manufacturing and made-to-measure services, its fabric import/sales activity, and 13 real products. The primary audience is the bank reviewing the company. Customers should also be able to explore the offering, locate the company and prepare a quotation inquiry.

Keep the existing ivory, chocolate, bronze and crest identity. Make its presentation calm, clear and credible. Keep the static Vite architecture.

| Decision | Final scope |
|---|---|
| Language | Arabic with correct RTL layout and readable phone/email direction |
| Catalogue | 13 real products with company-owned photos and newly written, company-reviewed copy |
| Legal identity | Brief summary on Home; full approved public identifiers on About and in the footer |
| Prices | No public prices; use طلب عرض سعر |
| Customizer | Collect applicable shape, fabric and dimensions; prepare a WhatsApp inquiry |
| Calculations | Remove material quantities, seating capacity and completion-time estimates from the builder and its messages |
| Contact | Phone, WhatsApp, directions/maps and official email after provisioning |
| Inquiry delivery | Visitor reviews and sends a prepared WhatsApp message; no submission backend |
| Policy pages | No separate privacy, terms or warranty-policy pages in this release |
| Maintenance | Developer edits project files; no CMS or staff administration panel |
| Domain | Prefer a company-name .ly domain; availability remains unchecked |
| Purchase timing | Company approves the completed demo before buying the domain and official email |
| Deadline | No fixed deadline; prioritize quality and use clear completion criteria |

The user confirms that the business claims and registration information are supported by company documents, and that real company-owned photographs exist. Treat these as supplied business facts. Reconcile conflicting versions in the project and collect the final product details; do not restart an open-ended investigation of the company.

Additional confirmed details: fabric sales serve individuals, furniture makers and shops; the five showrooms are five units within the same market/complex; some existing project images are genuine and should be retained, while the remaining real images will be supplied later.

## 2. Success and responsibilities

A reviewer should identify the registered company, understand furniture production and fabric activity, inspect representative products, and find locations/contact information within two navigation actions.

A customer should select a product, specify relevant choices and dimensions, and open a WhatsApp draft matching those choices. The website must never imply that the company has already received the inquiry.

Company approval, technical launch readiness and bank acceptance are separate outcomes. The developer prepares the demo and production handover. The company approves the facts, buys the domain/mail and handles bank submission. The exact bank checklist is unknown; this does not block work on the agreed site.

A company representative still needs to be assigned for final content review. This is a demo-acceptance dependency, not a reason to block layout work, code cleanup or copy drafting.

## 3. Information architecture

Main navigation: **الرئيسية · عن الشركة · المنتجات والخدمات · المواقع والتواصل**.

| Surface | Content and purpose | Primary action |
|---|---|---|
| Home — index.html | Short factual introduction; strong real photo; identity summary; manufacturing/fabric activities; selected products; location preview | استعرض المنتجات |
| About — new about.html | Registered name, short brand name, legal form, approved public identifiers, factual background, factory/process and showroom information | مواقعنا وتواصل معنا |
| Catalogue — catalog.html | All 13 products, useful category filters, images and short descriptions; explicit explanation of fabric sales/import and customization services | تفاصيل المنتج |
| Product — product.html?id=… | Verified product images/details and valid customization options; inquiry builder below product information | جهّز طلب عرض سعر |
| Contact — contact.html | Phone/directions near the top; factory/showroom addresses, unit numbers, hours, real photos, WhatsApp and email | اتصال / فتح الاتجاهات |

The shared product route serves 13 records; it does not require 13 separate HTML files. Remove the global navigation link to one preselected product. Inquiry starts from the product the visitor chose.

Keep salons, majlis, corners and curtains as categories where supported by the actual product list. Fabric activity must appear clearly on Home, About and Catalogue even if no standalone fabric product is among the 13. Do not invent extra fabric records to fill a category. If a product is a fabric or curtain, provide appropriate inquiry fields rather than furniture-shape controls.

Describe the fabric offering for both individuals and furniture makers/shops. Provide a contextual fabric inquiry action that opens a draft distinct from a furniture quotation, with optional fabric reference, intended use and quantity when known. Do not infer wholesale pricing, minimum orders or supply guarantees from the customer types. This service section does not expand the agreed 13-product count.

### Existing routes

- Retain the four primary pages and add About to the build/navigation.
- Retain salons.html, majlis.html, corners.html and curtains.html as concise category entry pages using shared approved catalogue data.
- Keep gallery.html as a simple view of approved real imagery, linked from relevant company/product content without expanding the main navigation.
- Preserve existing product IDs where they still map to real products. Map replaced IDs to a clear replacement when possible; otherwise show a useful unavailable-product state linking to the catalogue.
- Check every retained direct URL. No legacy page should remain publicly accessible with conflicting company information.

### Visual direction

- Keep the warm palette and crest; use bronze selectively for emphasis and controls.
- Shorten the Home and Contact introductions. Place meaningful company information near the top rather than behind repeated promotional paragraphs.
- Present legal identifiers as labeled text rather than images.
- Distinguish appointment-only factory visits from public showroom hours.
- Reduce repeated badges, heavy glow and oversized headings. Give each section one clear purpose and contextual action.
- Use real images with consistent proportions, natural cropping and no stretching.
- Use consistent Arabic type, fewer necessary font families/weights, readable line lengths and clear contrast.
- Prevent floating WhatsApp controls from covering content; avoid duplicate consultation flows.

## 4. Content preparation

Create one company record and one product dataset used by pages, metadata, footer and inquiry messages. Keep private supporting documents separate from public website data.

### Company record

Record the exact registered Arabic name, approved short brand name, legal form, public identifiers, activities, telephone numbers, locations, hours and approved service statements.

Resolve the known company-name and opening-hour differences, including Friday. Present the five showrooms as five units within one market/complex, using a shared market address and verified directions link, with unit numbers/descriptions beneath it where supplied. Use shared hours only where confirmed; show unit-specific exceptions if needed. Keep the factory as a separate location with its own directions and visiting arrangement. Do not present the five units as geographically separate branches.

Preserve confirmed business facts while replacing repetitive superlatives with direct Arabic descriptions. Distinguish local manufacture from imported material origin. Warranty, delivery and payment statements may remain inline where useful, using precise company-approved wording.

### Thirteen product records

Required for each product:

- Stable ID, approved name and category.
- Correct real-photo mapping.
- Short Arabic description and verified materials/details.
- Made-to-order status and customization options actually available.
- Appropriate inquiry fields and units.

Optional, only when supplied: additional photo angles, colour/fabric variants, care notes, origin and a precise warranty statement. Omit missing optional facts rather than inventing specifications. Product names can be drafted descriptively for company review.

Do not present photos of different sofa models as colour variants of one model. Where a valid combination has no real photo, collect the preference without implying the image is an accurate preview of the result.

Before replacing assets, prepare an image inventory: existing genuine image to retain, image awaiting replacement, and final product/location association. The user has not yet identified which individual files are genuine. Obtain that mapping during content intake, retain approved existing images, and replace only the remaining assets as company photos arrive. Layout and functional work can proceed meanwhile; final catalogue approval requires the real-image mapping to be complete.

## 5. Quotation builder and contact behavior

### Product inquiry

1. Carry the selected product ID/name into the inquiry.
2. Show only applicable choices: layout/shape, fabric and relevant dimensions.
3. Provide an explicit “أحتاج مساعدة في المقاسات” path for visitors who do not know measurements.
4. For entered dimensions, state units and validate numeric format and positive values. Use company-provided limits where available; avoid invented manufacturing limits. Support ordinary Arabic and Western digit entry where practical.
5. Display a concise review of product, choices, measurements and optional notes.
6. Open a WhatsApp draft from the user's action. The visitor reviews and sends it in WhatsApp.

Remove automatic material quantities, seating capacity and completion-time calculations, their UI, default values and message text. Repairing or expanding the old estimation algorithm is outside this scope.

Use one current state for both the review and WhatsApp draft. Clear incompatible choices when the product changes and show the change. Preserve entered information when opening WhatsApp. Provide a visible retry/open link and copyable message if the handoff cannot be completed.

Example message structure, filled with actual choices:

> مرحباً شركة الديباج، أرغب في طلب عرض سعر للمنتج: [اسم المنتج].
> الشكل المطلوب: [الخيار إن كان مناسباً].
> القماش: [الخيار].
> المقاسات: [المقاسات والوحدة أو طلب المساعدة في القياس].
> ملاحظات: [إن وجدت].

Suggested button: **متابعة الطلب عبر واتساب**.
Adjacent explanation: **ستفتح رسالة جاهزة في واتساب لمراجعتها وإرسالها.**

Never display “تم تسجيل طلبك” or a sent receipt. The site cannot determine that the customer sent the message.

### General contact

Use direct contact links and a simple optional inquiry composer. Collect only information useful for the draft; a full three-part name and mandatory phone field are unnecessary for a simple WhatsApp handoff.

Display the current working contact channels on the demo. Do not fabricate a future official mailbox or publish a nonfunctional address. After provisioning, update the approved company mailbox consistently across the live site.

Use verified map/directions links as the default; embedded maps are unnecessary for the agreed scope. Show that opening WhatsApp transfers the draft there. This can be a short explanation beside the action, without adding a separate policy page.

No external form service, inquiry database or new tracking is needed for this scope.

## 6. Engineering approach

Keep Vite and consolidate navigation, footer and company data through shared build-time templates/partials. Keep essential company information in rendered HTML.

- Add About and update route/build configuration.
- Replace the 13 product records/assets; remove obsolete calculator UI and message generation.
- Consolidate active data and duplicated markup rather than maintaining conflicting copies.
- Reuse verified images, generate appropriately sized versions, reserve image dimensions and lazy-load below-fold imagery.
- Align README/design documentation with the actual fonts, routes and inquiry behavior.
- Use native controls. Correct drawer/dialog hidden states, expanded state, focus entry/return, Escape handling and keyboard operation.
- Add useful empty-filter and invalid-product states. Core company information/direct contact should remain accessible if JavaScript fails.
- Use accurate page titles/descriptions; add final-domain canonical URLs and a sitemap at production setup.

## 7. Sequence and dependencies

| Stage | Deliverable | Completion condition |
|---|---|---|
| A — Foundation | Shared data structure, route map, page outlines and accessible shared components | Agreed scope represented without new placeholder business claims |
| B — Content | Real photos mapped to 13 products; Arabic copy; reconciled company/contact record | One reviewable company record and 13 complete product drafts |
| C — Complete demo | Refined pages, new About page, product-aware builder and truthful WhatsApp handoff | All retained routes work with supplied content and no obsolete estimates |
| D — Verification and company review | Bounded technical checks, whole-demo review and resolution of material feedback | Company representative approves demo; technical criteria pass |
| E — Domain and email | After approval, check .ly availability, arrange company purchase, mailbox and HTTPS | Company controls domain/mail and actual operation is verified |
| F — Launch and handover | Verify production URLs/content/contact; deliver maintenance and rollback notes | Company receives working site URL and handover information |

Stage A and technical work in C can proceed while materials are collected. Final product copy and photo mapping depend on those materials. The company can assign its reviewer during development; one consolidated demo review is preferable to repeated approvals of small edits.

Domain/mail purchase remains after demo approval. This plan does not authorize purchases, sending customer inquiries or bank submission.

Estimated effort: **7–10 working days once the content package is usable**, excluding company review and domain/mail provisioning. This is an estimate, not a deadline. Reassess if the product count, retained functionality or copy workload changes materially.

## 8. Acceptance criteria

### Demo

- All four main navigation destinations work; About is present; every retained route uses consistent company data.
- Home communicates both furniture manufacture/customization and fabric activity. About/footer use the same approved public identifiers.
- Fabric content addresses individuals and furniture businesses/shops, with an appropriate inquiry draft and no invented trade terms.
- Contact shows one market/complex containing five showroom units and a separate factory location, with accurate directions and unit details.
- Exactly 13 real product records have correct photos, factual copy and valid options. No invented specifications or misleading variant previews.
- No public prices or quantity/capacity/completion-time estimates appear in the builder, review or draft.
- After every supported change, the draft matches the current product/options/measurements. Incompatible options are cleared visibly.
- Invalid measurements cannot pass as valid; unknown measurements have an explicit route.
- WhatsApp opening preserves inputs and never claims registration/submission. A fallback remains available.
- Representative phone, tablet and desktop layouts have no clipped controls or floating-button obstruction.
- Keyboard-only users can complete the primary flow. Closed overlays are excluded from interaction; labels, focus and Escape behavior work where relevant.
- Build passes; retained routes, images and product IDs are checked; unknown products show a useful recovery state.
- Representative mobile loading and layout shifts are measured. Record observed results instead of claiming unmeasured performance scores.

Use meaningful regression tests for draft/state consistency, option clearing, dimension handling and invalid products. Review visual/function behavior in a combined pass, fix material issues together and confirm the fixes. Do not use the historical detector's advisory count as a release target.

### Production

- Approved domain resolves over HTTPS; direct URLs and refresh work.
- Official mailbox exists; inbound/outbound delivery and provider-required authentication records are verified.
- Phone, WhatsApp, email and map links are correct on the live domain. Canonicals/sitemap reference that domain.
- Company controls ownership, renewal and recovery. Developer instructions cover product/hour edits, deployment and rollback.
- Company receives site URL and handover information for its bank process. Any later written checklist is mapped to affected requirements without claiming prior bank acceptance.

## 9. Inputs needed from the company

| Input | Purpose | Needed by |
|---|---|---|
| Final company-name/contact/identifier record | Resolve conflicting project versions | Content completion |
| Identify genuine existing images; supply remaining photos and map all to the 13 products | Retain correct assets and replace only unresolved images | Product completion |
| Materials and valid customization options | Accurate descriptions and product-specific builder | Builder completion |
| Shared showroom-market address/map, five unit details/hours and separate factory information/photos | Accurate About and Contact location presentation | Demo review |
| Company representative for consolidated review | Final factual/design approval | Demo acceptance |
| Domain/mail purchaser and preferred mailbox name | Company-owned production identity | After demo approval |

Supporting documents and some genuine project photos are confirmed to exist; remaining real photos will be supplied later. At implementation time, obtain the file-level mapping and missing images; do not repeat the settled availability question or replace all assets indiscriminately. Existing logo/brand assets can be reused unless better originals are supplied.

## 10. Research and audit context

These are prior review findings, not a fresh compliance assessment:

- The user reports that the bank wants a company-and-product website. The exact bank and written instruction remain unknown.
- The [Libya Trade Network supplier form](https://e-trade.ltnet.gov.ly/i-registration) collects website/email and company activity information; it is not a CBL website checklist.
- The published [Decision 201/2019 transcription](https://lawsociety.ly/legislation/قرار-رقم-201-لسنة-2019-م-بشأن-اعتماد-لائحة-الر/) provides historical identity/KYC context, not all current website requirements.
- [CBL Circular 10/2025](https://cbl.gov.ly/publication/منشور-10-2025/) concerns foreign-exchange controls. A website-specific clause was not verified.
- Prior searches did not establish a universal page count, .ly suffix, bilingual site, public prices, checkout or customizer requirement. The .ly preference is the user's choice.
- Earlier build/static checks passed for nine entry pages, 279 local references and 17 dataset image paths across 13 products. These are baseline results; retest after implementation.
- Prior live inspection covered desktop and 390px Contact layouts. Findings included false inquiry-registration feedback, stale WhatsApp estimates, inaccessible controls/overlays, conflicting content and oversized introductions.
- The selected solution removes the estimate feature. Its old algorithm should not be repaired as a separate work item.
- The historical scan returned 223 largely advisory findings with parser limitations and false positives. Neither this count nor the subjective 21/40 heuristic score is a bank-acceptance or release criterion.

## 11. Out of scope and closure

English translation, public prices, checkout/payment integration, CMS, automatic quantity/capacity/time calculations, separate policy pages and unsupported “CBL approved” claims are outside this release.

The interview is complete. Remaining material collection, company review and production arrangements are delivery dependencies. Ask further questions only for concrete missing inputs or genuine scope changes.
