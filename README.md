# Voyara — Explore Beyond Borders

A responsive, premium travel-booking **frontend concept** for exploring journeys by flight, train, bus and ship. Built with HTML, CSS and vanilla JavaScript.

## Features

- Cinematic hero section with subtle scroll parallax
- Responsive navigation for desktop and mobile
- Four transport tabs and a universal journey search form
- Illustrative sample search results with clear demo messaging
- Destination cards with hover zoom
- Journey type cards, newsletter form and toast feedback
- Scroll reveal animations
- Accessible labels, live status messages and reduced-motion support
- Responsive layout for mobile, tablet and desktop

## Run locally

1. Download or clone this repository.
2. Open the project folder in VS Code.
3. Start a local server (recommended), for example with the VS Code **Live Server** extension.
4. Open `index.html` in your browser.

No build step is required. Google Fonts and the sample destination photographs load from external services, so an internet connection is needed for those assets.

## Project structure

```text
Voyara-Explore-Beyond-Borders/
├── index.html
├── css/
│   ├── style.css
│   ├── responsive.css
│   ├── animations.css
│   └── booking.css
├── js/
│   └── main.js
├── assets/
│   └── images/
└── README.md
```

## Important: demo versus real bookings

This repository is a frontend concept. Search options, fares and newsletter feedback are illustrative and do **not** represent live availability. It does not issue tickets, process payments, store accounts or connect to real transport inventory.

For a production service, add a backend (for example, Python + Flask), persistent storage, secure authentication, a payment provider and authorized APIs/partners for each transport type. Do not collect or store raw payment-card details yourself.

## Customization

- Replace the sample image URLs in `index.html` with licensed images or your own assets.
- Edit colors in the `:root` section of `css/style.css`.
- Add real provider integrations only after obtaining access credentials and reviewing their terms.
- Update brand copy, destinations, fare display and legal/privacy pages before public launch.

## License

Educational starter project. Verify licenses and terms for any external fonts, images or APIs before commercial use.
