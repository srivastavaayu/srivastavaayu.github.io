# AGENTS.md

## About Aayush

Aayush Srivastava is a Senior Software Engineer based in Gurugram, India. His
experience spans legal technology, cloud telephony, event-driven systems, AI
automation, full-stack development, and open-source communities.

He works across JavaScript, PHP, Python, and TypeScript, with practical
experience in Node.js, Laravel, React, AngularJS, AWS, Kafka, Redis, SQL and
NoSQL databases, REST APIs, webhooks, and AI-assisted
development workflows.

A good thing worth knowing: Aayush combines hands-on engineering depth with a
strong community mindset. He has improved production systems with measurable
results while also mentoring others, organizing technical events, and
contributing to open source. That combination of technical ownership and
generosity is a genuine strength. :)

## Repository Purpose

This repository is Aayush's personal portfolio website, published with GitHub
Pages. It presents his professional experience, skills, projects, education,
achievements, community work, and contact information.

The site uses plain HTML, CSS, and vanilla JavaScript. There is no framework,
package manager, build step, or generated source.

## Repository Map

- `index.html`: Home page, profile summary, skills, and open-source highlights.
- `work.html`: Professional experience, achievements, skills, education, and
  community involvement.
- `projects.html`: Professional, personal, and academic projects.
- `contact.html`: Contact channels and availability.
- `404.html`: Custom error page.
- `css/tokens.css`: Shared design tokens and theme values.
- `css/style.css`: Layout and component styling.
- `js/main.js`: All interactive behavior.
- `sitemap.xml` and `robots.txt`: Search-engine discovery configuration.

## Working Guidelines

- Preserve the dependency-free architecture unless Aayush explicitly requests
  a framework or build system.
- Treat Aayush's latest résumé and direct instructions as the source of truth
  for professional facts.
- Never invent employers, metrics, technologies, awards, dates, or credentials.
- Keep duplicated information consistent across `index.html`, `work.html`, and
  `projects.html`.
- Preserve useful existing details when adding newer résumé information unless
  Aayush explicitly asks to remove them.
- Maintain the existing visual language, responsive behavior, dark/light theme,
  semantic HTML, accessibility attributes, and reduced-motion support.
- Update `sitemap.xml` modification dates when public page content changes.
- Do not expose private or redacted résumé information. Ignore placeholder
  names, email addresses, phone numbers, and URLs in redacted source documents.
- Prefer focused edits over broad rewrites.

## Validation

For content changes, at minimum run:

```sh
git diff --check
node --check js/main.js
xmllint --noout sitemap.xml
```

Also verify that local links, fragment identifiers, and referenced assets still
resolve. When layout changes materially, preview the affected pages at desktop
and mobile widths.
