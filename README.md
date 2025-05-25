<p align="center">
  <h1>Holidaze</h1>
</p>

Holidaze is more than just a holiday venue booking platform, it is a conceptual exploration of how digital services can evolve alongside the users they serve.  
Holidaze envisions a near future where users are not passive consumers, but informed, sovereign participants in the digital experience.  
Rather than persuasive UX patterns or conversion-driven interfaces, Holidaze emphasizes clarity, autonomy, and radical transparency. Its brutalist minimalism reflects Web3 principles, prioritizing structure and user sovereignty over decoration and funneling.  
While building for Holidaze, synchronously an hypothesis was articulated;  

<p align="center"><strong>The future of the web doesn’t infantilize users, but empowers them.</strong></p>

Built with React, Tailwind CSS, and a purposeful design, this project is not only a technical implementation of a booking platform, but a space where the experience of rest begins.  
By clearing the clutter, canceling the noise, and offering space instead of pressure, Holidaze signals to the user that time off has already started.  

It is a transition portal; from noise to clarity, from routine to restoration, from overstimulation back to self.

---

## Features

### Globe Landing Page
- Slowly rotating 3D globe (built with react-globe.gl and three.js)
- Country click redirects to filtered venue listings
- Minimal hover-based tooltips
- "Explore" link navigates directly to all venues

---

### All Venues Page
- Responsive masonry grid layout with dynamic scaling on scroll
- Venue filtering by country, features, price, and guest count
- Glassmorphic modal for filters
- Lazy loading and infinite scroll
- Search and continent/country-based discovery

---

### Venue Details Page
- Route: /venues/:id
- Hero images with optional carousel
- Venue data, amenities, and location
- Calendar-based booking form with error handling
- Local review system using localStorage
- Breadcrumb navigation

---

### Login / Register
- Toggle between login register
- Guest browsing
- Email format validation for stud.noroff.no 
- Protected routes via localStorage token validation

---

### Customer Profile
- View and update avatar and bio
- List of upcoming bookings (with edit, cancel, rebook, review)
- View - edit - delete buttons for full user control
- Edit - delete buttons disappear after booking date
- Review button with review logic
- Modal system for booking actions
- Log out

---

### Manager Profile
- Add, view, edit, or delete venue listings
- View stats
- Search venues
- Modals for listing creation and updates

---

## Design & Philosophy

Holidaze is rooted in Web3 design principles, based on the belief that:  
Users are increasingly decentralized, data-literate, and choice-oriented.  
Trust is built through access to clear, truthful information, not manipulation or urgency.  
Interfaces should not lead or convert, but instead offer structure and clarity for intentional action.

To reflect this, Holidaze deliberately rejects traditional Web2 UI patterns, including:
- Rounded corners
- Drop shadows
- Visual hierarchies that guide behavior
- Repetitive or urgent call-to-action buttons

Instead, the platform introduces:
- A paper-like, Kindle-inspired interface
- Flat information structures
- Minimalistic glassmorphic overlays for interactions
- Subtle motion and transparency
- Typographic hierarchy stripped of urgency

This interface assumes a confident, digitally mature user — one who does not require nudging, but simply clarity and autonomy.  
Holidaze uses all-lowercase typography throughout the platform, with minimal contrast in size or weight.  
This may reduce immediate scannability for some users. However, it aligns with the broader design philosophy: to create an ambient, unintrusive interface that treats all information with equal visual weight.

---

## Accessibility & Intentional Trade-offs

| Element            | Rationale                                      |
|--------------------|------------------------------------------------|
| Low visual hierarchy | Designed to foster user autonomy              |
| Sparse CTAs        | Avoids urgency or funneling behavior          |
| Flat color palette | Minimizes visual noise and overstimulation    |

Accessibility is still respected through:
- Valid semantic HTML
- Keyboard navigability
- Proper color contrast and spacing
- WCAG validation
- Manual testing via Lighthouse, WAVE, and real user sessions

---

## Tech Stack

- HTML  
- CSS  
- JavaScript  
- React  
- Tailwind CSS  
- ESLint  
- Prettier

---

## Folder Structure

The codebase follows an atomic design-inspired structure.  
Main folders include:
- components/ (modals, venues, profiles)
- pages/ (page-level views)
- hooks/ (custom utilities)
- lib/ (API and config helpers)
- assets/ (static files)
- App.jsx and index.css (entry points)

---

## Protected Routes

- /account/customer → Requires login as customer  
- /account/manager → Requires login as venue manager  
- /venues/:id → Public  
- /auth → Public

---

## Testing & QA

- Manual User Story Testing  
- HTML & CSS Validation via W3C tools  
- Lighthouse performance and accessibility audits  
- WAVE accessibility testing  
- Hotjar user interaction insights  
- Design trade-offs were considered and balanced intentionally

---

## Future Enhancements

- Delete user profile  
- Notification system  
- Booking reminders  
- Publish/unpublish toggle (pending API)  
- Offline venue bookmarking  
- Improved review system

---

## Reflections

This project taught me how to stay committed to a vision, even when that vision diverged from common UI conventions.  
Holidaze was born from the belief that the future of the web should reflect a shift toward user autonomy and intentionality.  
Rather than relying on persuasive patterns, the aim was to create an experience that values space, trust, and clarity.

Subtle elements like scroll logic and the rotating globe added liveliness while preserving the minimal core.  
Throughout the process, I constantly asked: *Does this serve the user, or just the interface?*

Holidaze is not about leading users through a funnel. It is about creating a space for clarity and calm.

---

## Setup Instructions

```bash
git clone https://github.com/Kristinebjorgan/holidaze.git
cd holidaze
npm install
npm run dev
Project Resources
GitHub Repository: https://github.com/Kristinebjorgan/holidaze.git

## Links

Live App (Netlify): https://holid4ze.netlify.app/

Kanban Board (Trello): https://trello.com/invite/b/67f3818f73b83431e4e62241/ATTI41711d60eade7bf68d59afe1fecf84a67F57AB61/pe2

Gantt Chart: View on Canva

Figma Design: https://www.figma.com/design/vcDU8xQqTMmv8BeWEhiGgR/PE2--Holidaze?node-id=0-1

Figma Style Guide: https://www.figma.com/design/vcDU8xQqTMmv8BeWEhiGgR/PE2--Holidaze?node-id=0-1 
