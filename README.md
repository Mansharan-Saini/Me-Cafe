# Me.Cafe

A responsive coffee shop website featuring a product menu, customer reviews, and table-booking form.

## Features

- Browse coffee products and add them to a shopping cart.
- Adjust cart quantities, remove items, and see the order total.
- Keep cart contents between visits using browser `localStorage`.
- Mark products as favorites.
- Browse customer reviews in a Swiper carousel.
- Use the responsive navigation menu on smaller screens.
- Submit the table-booking form for an on-page confirmation.

> The sign-in, sign-up, and table-booking interactions are front-end demonstrations. They do not connect to an account service or send booking details to a server.

## Run locally

No build step or package installation is required. Clone the repository and open `index.html` in a browser. Alternatively, serve the project directory with any static file server.

The page loads Boxicons, Swiper, ScrollReveal, and Google Fonts from their respective CDNs, so those resources need an internet connection.

## Deploy with GitHub Pages

1. Open the repository's **Settings** on GitHub.
2. Select **Pages** in the sidebar.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select the `main` branch and `/ (root)` folder, then save.
5. Once deployment finishes, GitHub Pages will show the site URL in the Pages settings.

## Project structure

```text
.
├── css/
│   └── style.css
├── images/
├── js/
│   └── main.js
└── index.html
```