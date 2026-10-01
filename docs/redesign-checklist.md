# Redesign checklist

Visual reference requested: `reference/glass-sidebar.html`.

That file is not in this repo. Phase 2 (tokens) waits until it is added, so exact colors, blur, radius, and shadow values are copied from the file and not guessed.

Scope of the checked list below: screens the running app actually mounts (`src/router/index.tsx`). A second, unmounted emergency-operations UI still sits in `src/pages` and `src/components/layout`. It is listed at the bottom and is not in the proposed screen order.

## Live screens

- [ ] `/` — Landing (`src/pages/bms/LandingPage.tsx`). Top links, short intro. No app shell.
- [ ] `/login` — Sign in (`src/pages/bms/LoginPage.tsx`). Email or phone, OTP, role picker when an account has more than one role.
- [ ] `/register` — Create account (`src/pages/bms/RegisterPage.tsx`).
- [ ] `/forgot-password` — Forgot password (`src/pages/bms/ForgotPasswordPage.tsx`).
- [ ] `/reset-password` — Reset password (`src/pages/bms/ResetPasswordPage.tsx`).
- [ ] `/403` — Forbidden (`src/pages/bms/ForbiddenPage.tsx`).
- [ ] `*` — Not found (inline in `src/router/index.tsx`).
- [ ] Session bootstrap — Loading and session-error states (`src/bms/AuthBootstrap.tsx`). Not a route.
- [ ] `/app` — Customer home (`src/pages/bms/customer/CustomerHomePage.tsx`). Upcoming bookings and open tickets. Inside `CustomerShell`.
- [ ] `/app/book` — Book (`src/pages/bms/customer/BookPage.tsx`). Date, slots, booking form.
- [ ] `/app/bookings` — My bookings (`src/pages/bms/customer/MyBookingsPage.tsx`). List and cancel.
- [ ] `/app/tickets` — My tickets (`src/pages/bms/customer/MyTicketsPage.tsx`).
- [ ] `/app/tickets/new` — New ticket (`src/pages/bms/customer/NewTicketPage.tsx`).
- [ ] `/app/tickets/:id` — Ticket detail (`src/pages/bms/customer/TicketDetailPage.tsx`). Thread and attachment.
- [ ] Notifications drawer — Part of `CustomerShell`, not its own route. **Not final.** Stopping an `index.css` leak currently lays this panel in the page column (`position: static` in `theme.css`). Phase 4 must restore the slide-in sheet and restyle it as a glass drawer.
- [ ] `/account` — Account (`src/pages/bms/AccountPage.tsx`). Name, phone, password, role switch. Registered twice in the router with the same element.
- [ ] `/support` — Support placeholder (`AreaPage`, title "Support"). Role `AGENT`.
- [ ] `/lead` — Team lead placeholder (`AreaPage`, title "Team lead"). Role `TEAM_LEAD`.
- [ ] `/admin` — Admin placeholder (`AreaPage`, title "Admin"). Role `ADMIN`.

## Unmounted pages (not in the router)

These files are still in the tree. `App.tsx` does not render `AppShell`, and nothing imports these pages into `src/router/index.tsx`. Paths below are the ones the old sidebar and in-page links used. They are recorded so the inventory is complete. They are not part of the proposed restyle order.

- [ ] `/login` (old) — `src/pages/auth/LoginPage.tsx`
- [ ] `/dashboard` — `src/pages/dispatcher/DashboardPage.tsx`
- [ ] `/wallboard` — `src/pages/dispatcher/WallboardPage.tsx`
- [ ] Public wallboard — `src/pages/public/WallboardDisplayPage.tsx` (no live route found)
- [ ] `/queue` — `src/pages/dispatcher/QueuePage.tsx`
- [ ] Incident detail (`useParams` id) — `src/pages/dispatcher/IncidentDetailPage.tsx`
- [ ] `/fleet` — `src/pages/dispatcher/FleetPage.tsx`
- [ ] `/fleet/checklists` — `src/pages/dispatcher/FleetChecklistsPage.tsx`
- [ ] `/fleet/fuel` — `src/pages/dispatcher/FuelPage.tsx`
- [ ] `/fleet/standby` — `src/pages/dispatcher/StandbyPage.tsx`
- [ ] `/call-logs` — `src/pages/dispatcher/CallLogPage.tsx`
- [ ] `/gbv/dashboard` — `src/pages/gbv/GbvDashboardPage.tsx`
- [ ] GBV case detail — `src/pages/gbv/GbvCaseDetailPage.tsx`
- [ ] `/admin/users` — `src/pages/admin/UserManagementPage.tsx`
- [ ] `/admin/partners` — `src/pages/admin/PartnersPage.tsx`
- [ ] `/admin/partner-ambulances` — `src/pages/admin/PartnerAmbulancesPage.tsx`
- [ ] `/admin/facilities` — `src/pages/admin/FacilitiesPage.tsx`
- [ ] `/admin/nature-options` — `src/pages/admin/NatureOptionsPage.tsx`
- [ ] `/admin/inventory` — `src/pages/admin/InventoryPage.tsx`
- [ ] `/admin/sms` — `src/pages/admin/BulkSmsPage.tsx`
- [ ] `/admin/analytics` — `src/pages/admin/AnalyticsPage.tsx`
- [ ] `/admin/system-report` — `src/pages/admin/SystemReportPage.tsx`
- [ ] `/admin/settings` — `src/pages/admin/SystemSettingsPage.tsx`
- [ ] `/partner/dashboard` — `src/pages/partner/PartnerDashboardPage.tsx`
- [ ] Partner case detail — `src/pages/partner/PartnerCaseDetailPage.tsx`
- [ ] `/driver/dashboard` — `src/pages/driver/DriverDashboardPage.tsx`
- [ ] `/operator/assignment` — `src/pages/operator/AssignmentPage.tsx`
- [ ] `/operator/crew` — `src/pages/operator/CrewPage.tsx`
- [ ] `/operator/activity` — `src/pages/operator/ActivityPage.tsx`
- [ ] `/operator/history` — `src/pages/operator/HistoryPage.tsx`
- [ ] `/operator/inventory` — `src/pages/operator/InventoryPage.tsx`
- [ ] `/operator/checklist` — `src/pages/operator/ChecklistPage.tsx`
- [ ] Navigate — `src/pages/operator/NavigatePage.tsx`
- [ ] Patient data — `src/pages/operator/PatientDataPage.tsx`
- [ ] Patient care report — `src/pages/operator/PatientCareReportPage.tsx`
- [ ] `/watcher/new-incident` — `src/pages/watcher/NewIncidentWizard.tsx`
- [ ] Watcher dashboard — `src/pages/watcher/WatcherDashboardPage.tsx`
- [ ] `/profile` — `src/pages/shared/ProfilePage.tsx`
- [ ] `/emt/dashboard` and `/nurse/dashboard` — named in `ROLE_ROUTES`, no page file found
- [ ] `/unauthorized` — named in `src/components/shared/RoleGuard.tsx`, no page file found
