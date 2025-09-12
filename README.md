# Ordle

Ordle is a Danish word-guessing game inspired by Wordle, built as a web app. It currently features more than 3400 Danish [lemmas](<https://en.wikipedia.org/wiki/Lemma_(morphology)>), supports internationalization for Danish and English, and a flexible architecture for word sources.

It is hosted on GitHub pages at [skyggfisk.github.io/ordle/](https://skyggfisk.github.io/ordle/).

## Getting Started

You can run Ordle either locally or inside a Dev Container (recommended). The project uses [Bun](https://bun.sh/) as both package manager and JavaScript runtime.

### Prerequisites

- **Local development:** [Bun](https://bun.sh/) must be installed. Follow the instructions on the Bun website to install it for your platform.
- **Dev container:** Uses the [official bun Docker image](https://bun.sh/docs/installation#docker); no action needed.

### 1. Clone the repository

```bash
git clone https://github.com/Skyggfisk/ordle.git
cd ordle
```

### 2. Open in Dev Container (Recommended)

- Install [VS Code Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers).
- Open the project in VS Code and select “Reopen in Container” when prompted. Make sure your favorite container runtime is up and running.

### 3. Installing dependencies and starting the app

In the project terminal (local or container) run:

```bash
bun install
bun run dev
```

Vite should display a message with where the app is available, the default address is [http://localhost:5173/ordle/](http://localhost:5173/ordle/).

---

## Word Extraction Script

To update the word list, use the extraction script with a [TSV](https://en.wikipedia.org/wiki/Tab-separated_values) file from [Det Centrale Ordregister (COR)](https://ordregister.dk):

```bash
# Place your COR TSV file in scripts/
bun run generate:words
```

- The script expects a TSV file from COR. If you want to extract words from another format or registry, you’ll need to build a new script for that purpose.
- The current script can be adapted to extract more or less words if desired, by adding or removing [COR codes](https://ordregister.dk/doc/COR.html).
- Take a look at the script [extractWords](scripts/extractWords.ts).

---

## Technologies and Architecture

### Technologies

- **[Bun](https://bun.sh/)** – JavaScript runtime and package manager
- **[Vite](https://vitejs.dev/)** – Fast development/build tooling
- **[React](https://react.dev/)** (with TypeScript) – UI and component logic
- **[Tailwind CSS](https://tailwindcss.com/)** – Utility-first CSS framework
- **[react-i18next](https://react.i18next.com/)** – Internationalization support
- **[Dev Containers](https://code.visualstudio.com/docs/devcontainers/containers)** – Consistent development environments
- **[GitHub Actions](https://github.com/features/actions)** – CI/CD and deployment to GitHub Pages

### Architecture Overview

- **Game Logic & Data Layer:**  
  Game state and logic are managed in React hooks (`useGameState`). The word list is loaded from a preprocessed file.
- **Persistence:**  
  Game progress and settings are stored in local storage for session continuity.
- **Notifications:**  
  Uses a context/provider pattern for in-app notifications, allowing any component to trigger messages.
- **Word Source:**  
  Words are extracted from COR and processed into a TypeScript file for fast loading.
- **Internationalization (i18n):**  
  Uses a simple i18n setup with JSON locale files and a provider for language switching.
- **CI/CD:**  
  GitHub Actions build and deploy the app to GitHub Pages on push to main using [actions-gh-pages](https://github.com/peaceiris/actions-gh-pages).

---

## Testing

**TODO:**  
Testing setup and instructions will be added soon.

---

## Additional Information

- **Contributing:**  
  Contributions and suggestions are welcome! Please open issues or pull requests.
- **License:**  
  [MIT](LICENSE)
