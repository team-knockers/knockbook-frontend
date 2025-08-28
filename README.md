# Knockbook Frontend

## Frontend Structure
See the team wiki page via the link below for details on the frontend structure.  
- https://teamknockers.atlassian.net/wiki/spaces/knockbook/pages/13107314

## Style Structure
- Use the following files for global styles:
  - `index.css`: Global styles
  - `variables.css`: CSS variables
  - `App.css`: styles for App.tsx
- Do not create any additional global style files.
- For feature-specific styles, create individual `*.module.css` files within each feature directory.

## Components Structure
The `components/` directory contains reusable UI elements organized by category.  
Each subdirectory groups related components for better maintainability and scalability.

components/
├── layout/ # Structural elements such as Header, Footer, AppShell
├── navigation/ # Navigation elements: Navbar, Sidebar, Menu, Tabs, Breadcrumbs
├── forms/ # Form controls: Input, Select, Checkbox, Radio, Button
├── display/ # Display components: Banner, Card, List, Table, Badge, Avatar, CategoryChip
└── overlay/ # Overlay components: Dialog (Modal, Popup), Drawer, Popover, Tooltip

## Installation & Run
- `npm install` — Only for initial setup or when dependencies change  
- `npm run dev` — Start the development server

## Development Notes
- React 18 + TypeScript + Vite  
- ESLint & Prettier configured for code style consistency
- Follow team wiki for coding conventions and additional setup
