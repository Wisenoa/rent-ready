// This file is required by Next.js even in App Router projects for backward compatibility.
// It is intentionally empty — actual HTML structure is in src/app/layout.tsx
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="fr">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
