# SauceDemo — Accessibility Testing Report

**Tester:** Subash Acharya  
**Date:** June 26, 2026  
**Application:** [SauceDemo (Swag Labs)](https://www.saucedemo.com)  
**Scope:** Login Page, Product Listing Page  
**Tools Used:** Manual testing, Chrome DevTools, Keyboard navigation

---

## 1. Keyboard Accessibility

### Login Page

| Element | Keyboard Accessible? | Notes |
|---------|---------------------|-------|
| Username field | ✅ Yes | Tab reaches it, focus visible |
| Password field | ✅ Yes | Tab order works |
| Login button | ✅ Yes | Enter triggers login |
| Demo user buttons | ❌ No | The auto-fill buttons (standard_user, locked_out_user, etc.) are not easily reachable via keyboard in a logical order |

**Issues Found:**

- **Issue #1 — Demo user buttons lack logical keyboard navigation.** The four "Login as X" buttons appear on the page but since they are styled as simple elements inside a form, tabbing through them feels inconsistent. Some versions render them as `<div>` or `<span>` elements without `tabindex`, making them completely inaccessible via keyboard.

### Product Listing Page

| Element | Keyboard Accessible? | Notes |
|---------|---------------------|-------|
| Product sort dropdown | ✅ Yes | Tab reaches it |
| Add to cart buttons | ✅ Yes | Each button focusable |
| Cart icon link | ✅ Yes | Navigable |
| Burger menu button | ⚠️ Partial | Opens on click but focus trapping inside menu is inconsistent |

- **Issue #2 — Burger menu focus trap.** After opening the sidebar menu via keyboard (Tab + Enter), focus is not always returned to the menu button when closing. Users can get lost inside the menu overlay.

---

## 2. Form Accessibility (Login Page)

### Labels and Input Association

| Check | Status | Notes |
|-------|--------|-------|
| Labels use `<label for="">` | ❌ No | Inputs use `placeholder` attributes only, no explicit `<label>` elements |
| ARIA labels present | ❌ No | No `aria-label` or `aria-labelledby` on inputs |
| Placeholder as label substitute | ⚠️ Partial | Placeholders disappear once user types, making it unclear which field is which |

- **Issue #3 — Missing form labels.** The username and password fields rely solely on placeholder text ("Username", "Password"). When a user starts typing, the placeholder disappears. Screen readers see unlabeled input fields.

### Error Messages

| Check | Status | Notes |
|-------|--------|-------|
| Error appears after bad login | ✅ Yes | Red error box appears |
| Error is announced to screen readers | ❌ No | The error container has no `role="alert"` or `aria-live="polite"` |
| Error text is descriptive | ⚠️ Partial | "Epic sadface: Username and password do not match any user in this service" — the tone is quirky, not professional |

- **Issue #4 — Error message not screen-reader friendly.** The error `<div>` appears dynamically but lacks `aria-live="assertive"`. Screen readers may not announce it.

---

## 3. Visual Accessibility

### Color Contrast

| Check | Status | Notes |
|-------|--------|-------|
| Text on white background | ✅ Pass | Dark text on white is fine |
| Red error text on white | ⚠️ Borderline | The red (#e2231a) on white is OK for large text but marginal for small text |
| Green "Add to cart" button text on white | ✅ Pass | OK |
| Product price text | ✅ Pass | Dark gray on white |

### Text Sizing

| Check | Status | Notes |
|-------|--------|-------|
| Page zoom to 200% | ⚠️ Partial | Layout holds but some product card text clips |
| Responsive below 768px | ❌ Poor | Product cards stack poorly on mobile widths |

- **Issue #5 — Product cards overflow at 200% zoom.** Text in product descriptions gets cut off or overlaps when zoomed to 200%, making the page hard to read for visually impaired users.

---

## 4. Screen Reader Experience

| Check | Status | Notes |
|-------|--------|-------|
| Alt text on product images | ❌ No | Product images have no meaningful `alt` attributes |
| ARIA landmarks used | ⚠️ Partial | Basic `<header>`, `<footer>` exist but no `<nav>` or `<main>` landmarks |
| Semantic HTML | ⚠️ Partial | Product list uses a generic `<div>` grid instead of `<ul>` / `<li>` |

- **Issue #6 — Product images missing alt text.** Each inventory item image has an empty or missing `alt` attribute. Screen readers skip the images entirely, losing the visual context of the product.

---

## 5. Navigation and Structure

| Check | Status | Notes |
|-------|--------|-------|
| Heading hierarchy | ❌ No | Page title uses a `<div>` with CSS styling instead of `<h1>` |
| Skip to content link | ❌ No | No skip navigation link present |
| Landmark regions | ⚠️ Partial | No `<main>` or `<nav>` elements — just generic `<div>` containers |

- **Issue #7 — No heading hierarchy.** The app title "Swag Labs" and page titles like "Products" are `<div>` elements styled to look like headings. Screen readers cannot navigate by heading level.

---

## Summary

| # | Issue | Page | Severity |
|---|-------|------|----------|
| 1 | Demo user buttons not keyboard-accessible | Login | Medium |
| 2 | Burger menu focus trap on close | Products | Medium |
| 3 | Login inputs missing `<label>` elements | Login | High |
| 4 | Error messages not announced by screen reader | Login | High |
| 5 | Product cards overflow at 200% zoom | Products | Medium |
| 6 | Product images missing alt text | Products | High |
| 7 | No heading hierarchy (`<h1>`-`<h6>`) | Both | High |

**Total Issues Found: 7**  
**High Severity: 4** | **Medium Severity: 3**

---

## Recommendations

1. Add `<label for="">` attributes to all form inputs (or use `aria-label`)
2. Add `role="alert"` or `aria-live="assertive"` to the error message container
3. Add descriptive `alt` text to all product images
4. Replace `<div>` headings with proper `<h1>` through `<h6>` elements
5. Add `tabindex` to demo user buttons for keyboard access
6. Add a skip-to-content link at the top of every page
7. Test and fix the burger menu focus trap
