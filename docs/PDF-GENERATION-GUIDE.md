# Technical Write-up PDF Generation Guide

## Quick Start (Recommended Method)

### Option 1: Google Docs (Easiest) ⭐

**Steps:**
1. Open `docs/TECHNICAL-WRITEUP.md` in any text editor
2. Copy all content (Ctrl/Cmd + A, then Ctrl/Cmd + C)
3. Go to [Google Docs](https://docs.google.com) → New Document
4. Paste content into Google Doc
5. **Apply MonkeDAO Branding:**
   - Font: Inter or similar clean sans-serif
   - Headers: Forest green color (#0d2a13)
   - Background: Cream (#f2eecb) or white
   - Accent text: Neon green (#00ff4d) for important points
6. **Add Visual Elements:**
   - Insert placeholders for diagrams (or use screenshots)
   - Format code blocks with syntax highlighting (use "Code" formatting)
   - Add page numbers and table of contents
7. **Export:**
   - File → Download → PDF Document (.pdf)
8. **Save:**
   - Rename to `technical-writeup.pdf`
   - Place in `public/` folder

**Estimated Time:** 30-45 minutes

---

### Option 2: Markdown to PDF (Command Line)

**Install Tool:**
```bash
npm install -g md-to-pdf
```

**Generate PDF:**
```bash
cd docs
md-to-pdf TECHNICAL-WRITEUP.md --pdf-options='{"format": "A4", "margin": "20mm"}'
mv TECHNICAL-WRITEUP.pdf ../public/technical-writeup.pdf
```

**Pros:** Fast, automated
**Cons:** Limited styling control, diagrams need separate insertion

**Estimated Time:** 5 minutes (but less professional appearance)

---

### Option 3: Canva (Most Professional) 🎨

**Steps:**
1. Go to [Canva](https://canva.com)
2. Create new design → Document → A4
3. **Set MonkeDAO Brand Colors:**
   - Add color palette: #0d2a13, #f2eecb, #00ff4d
4. **Design Template:**
   - Header: Forest green with "DealCoupon" branding
   - Body: Cream/white background
   - Accent elements: Neon green highlights
5. **Copy Content Sections:**
   - Paste from TECHNICAL-WRITEUP.md
   - Format with Canva text tools
6. **Add Visual Elements:**
   - Create custom diagrams or use screenshots
   - Insert code blocks as styled text boxes
   - Add icons from Canva library
7. **Export:**
   - Download → PDF Standard
   - Save as `technical-writeup.pdf` in `public/`

**Pros:** Beautiful design, custom branding, professional appearance
**Cons:** Time-intensive

**Estimated Time:** 1-2 hours

---

## Diagram Suggestions

### Required Diagrams (4 total)

**1. Architecture Diagram (3-Layer Stack)**
```
┌─────────────────────────────────┐
│   Frontend (Next.js + React)    │
├─────────────────────────────────┤
│   Backend (API + Supabase)      │
├─────────────────────────────────┤
│   Blockchain (Solana + Anchor)  │
└─────────────────────────────────┘
```
**How to Create:** Screenshot from pitch deck or draw in Canva/Figma

**2. User Flow Diagram**
```
Browse → Filter → Claim → My Coupons → Generate QR → Redeem
```
**How to Create:** Flowchart with arrows (use Lucidchart or draw.io)

**3. Database Schema (ERD)**
- Screenshot from database tool or
- Use dbdiagram.io to create ERD

**4. Redemption Flow Sequence**
```
User → Generate QR → Merchant Scans → Verify Signature → Burn NFT → Log Event
```
**How to Create:** Sequence diagram (use PlantUML or Mermaid.js)

---

## Code Snippets (Already Included)

The Markdown file already includes 3 formatted code snippets:

1. **Smart Contract (Rust)** - `create_coupon` function
2. **API Route (TypeScript)** - Redemption verification
3. **Frontend (TypeScript)** - QR code generation

**Formatting in Google Docs:**
- Select code block
- Format → Text → "Code" or "Courier New" font
- Background: Light gray (#f5f5f5)
- Border: Optional thin line

---

## Quality Checklist

Before finalizing PDF, verify:

- [ ] **Length:** 2-4 pages (not too short, not too long)
- [ ] **Branding:** MonkeDAO colors used (forest green, cream, neon green)
- [ ] **Diagrams:** All 4 diagrams included and readable
- [ ] **Code:** At least 3 code snippets with syntax formatting
- [ ] **Headers:** Clear hierarchy (H1, H2, H3)
- [ ] **Font:** Professional (Inter, Arial, or similar)
- [ ] **Page Numbers:** Added to footer
- [ ] **Table of Contents:** Optional but helpful
- [ ] **Links:** Clickable (GitHub, demo URL)
- [ ] **File Size:** < 5MB for easy download
- [ ] **Filename:** `technical-writeup.pdf`
- [ ] **Location:** `public/` folder

---

## Final Placement

**After generating PDF:**

```bash
# Move PDF to public folder
mv technical-writeup.pdf /Users/rz/local-dev/web3-deal-discovery-nft-coupons/src/frontend/public/

# Verify it's accessible
# URL will be: https://yourdomain.com/technical-writeup.pdf
```

**Test Download Link:**
- Visit pitch deck: http://localhost:3001/pitch-deck
- Click "Technical Report" button
- Should download PDF

---

## Alternative: Use Existing Content

**Quick Option:**
If time is limited, you can use the existing implementation documentation as the technical write-up:

```bash
cp docs/EPIC-12-PITCH-DECK-IMPLEMENTATION.md docs/technical-writeup-simple.md
# Convert to PDF using Google Docs
```

This is less formal but still demonstrates technical depth.

---

## Recommended Workflow

**For Maximum Impact (1-2 hours):**
1. Use Google Docs method
2. Apply MonkeDAO branding manually
3. Insert 2-3 key screenshots from your app
4. Add simple flowchart diagrams
5. Export as PDF with professional formatting

**For Speed (30 minutes):**
1. Copy content to Google Docs
2. Minimal formatting (just headers and code blocks)
3. Export immediately
4. Place in `public/`

**Choose based on your time budget before Epic 11 submission deadline.**

---

**Status After Completion:**
- ✅ Technical Write-up Markdown created
- ⏳ PDF generation (manual task)
- ⏳ Placement in `public/technical-writeup.pdf`

**Next:** Generate PDF using preferred method, then proceed with Epic 11 deployment.
