## Issues to fix
Not able to handle data that starts with empty row - Fixed 
not able to identify duplicated entries/activites alowing uploading of same file multiple /Fixed
times with a change of checksum
maping of case code and case type instead of description
case court_name is a name instead of fk to court table
activity to have judge table fk instead of judge name
court does not require code
Not able to handle untrimmed columns
[INFO] general: 🔧 Diagnostic: process.env.DATABASE_URL = postgresql://fiend:1a6n4g3e5l1a@127.0.0.1:5432/caseload


[DEBUG] import: Creating date from parts {
  day: { value: 30, type: 'number' },
  month: { value: 'May', type: 'string' },
  year: { value: 2022, type: 'number' }
}
[DEBUG] import: Converting date parts to numbers {
  dayNum: { value: 30, isNaN: false },
  yearNum: { value: 2022, isNaN: false }
}
[DEBUG] import: Created date object {
  input: { dayNum: 30, monthIndex: 4, yearNum: 2022 },
  created: 2022-05-29T21:00:00.000Z,
  validation: { getDate: 30, getMonth: 4, getFullYear: 2022, isValid: true }
}
[DEBUG] import: Valid date created { date: 2022-05-29T21:00:00.000Z }
[INFO] database: PROCESSING CASE TYPE {
  originalName: 'Civil Appeal',
  normalizedName: 'Civil Appeal',
  generatedCode: 'APPEAL'
}



Dasboard prompt 
Design a fully responsive, accessible, and ergonomically optimized dashboard for modern websites, with component placement as the critical design factor. Prioritize mobile-first interaction patterns and strict adherence to accessibility standards (WCAG 2.1 AA or higher). Every component’s position must be justified by usability on touch devices, logical interaction hierarchy, screen reader compatibility, and consistent behavior across breakpoints.

Adopt a mobile-first approach to layout and component positioning. Place primary actions, key performance indicators, and notifications within thumb-reachable zones on mobile devices — typically the bottom two-thirds of the screen. Use a bottom navigation bar with no more than five items, or a collapsible side drawer with clearly labeled large tap targets (minimum 44x44 pixels). Avoid hamburger menus unless the content structure is deep and complex. Stack cards and widgets vertically in a single column on mobile, allowing user-driven reordering or collapsing. Simplify data visualizations for mobile with summary views or sparklines, and provide “tap to expand” functionality for detailed charts. If a floating action button is necessary, anchor it to the bottom-right with sufficient margin to avoid OS gesture zones.

Ensure all component placement decisions support accessibility. Maintain a logical focus order that matches both DOM structure and visual flow, especially after responsive layout changes. Wrap major regions — navigation, main content, sidebar, alerts — in semantic ARIA landmarks. All interactive elements must meet minimum contrast ratios: 4.5:1 for text, 3:1 for UI components. Never rely on color alone to indicate state or meaning. Extend tap and click targets to at least 44x44 pixels, even if the visible element is smaller, using padding or invisible wrappers. Support full keyboard navigation with visible focus indicators and ensure all dynamic content updates are announced via ARIA live regions.

Define three core breakpoints: mobile (up to 480px), tablet (481px to 1024px), and desktop (1025px and above). Use CSS Grid and Flexbox to enable intelligent reflow — not just scaling. For example, convert sidebars into top navigation or collapsible drawers on mobile. Preserve spatial grouping of related components (e.g., filters and their results) across all screen sizes. Avoid hiding components on mobile; instead, collapse, stack, or simplify them.

Follow these component placement rules:

Primary Navigation: Bottom bar or top collapsible drawer. Must include ARIA labels and support keyboard focus trapping within drawers.
Notifications Indicator: Top bar with tap-to-expand list. Badge counts must be announced to screen readers.
Search Bar: Full-width at top. Must include an accessible label and a keyboard-operable clear button.
KPI Summary Cards: Stacked vertically and placed above the fold. Use semantic heading structure and announce data on load.
Charts: Default to simplified or tap-to-expand views. Use SVG with descriptive title and desc elements, and support keyboard zoom.
Action Buttons: Grouped inline or in a sticky bottom bar. Minimum 44px tap target and visible focus state required.
User Menu: Top-right on desktop, relocated to bottom on mobile. Dropdown must be operable via Enter, Space, and Esc keys.
Filters and Controls: Collapsible section placed directly above results. Group in fieldset elements and ensure keyboard navigability.
Deliverables must include:

An interactive prototype demonstrating component reflow across all three breakpoints and supporting keyboard navigation.
An accessibility audit sheet with annotated screenshots indicating focus order, color contrast ratios, ARIA implementation, and touch target sizes.
A mobile ergonomics heatmap overlay showing thumb-reach zones and alignment of key components.
A component placement rationale document explaining each positioning decision with reference to mobile usability heuristics, WCAG criteria, and user task priority.
Additional guidance: Simulate one-thumb usage during testing. Optimize for slow network conditions by prioritizing above-the-fold critical components. Use real user behavior data, if available, to weight placement of high-frequency features. Design for interruptions — allow users to pause, resume, or undo actions with minimal friction.

Remember: If a component is not reachable, readable, or operable by all users on all devices, its visual design is irrelevant. Mobile users and assistive technology users are not edge cases — they are core users. Design with anticipation, not just adaptation.