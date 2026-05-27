# Vulnerable Playground

> **INTENTIONALLY VULNERABLE — DO NOT DEPLOY**

A local **security scanner and manual testing lab**: a multi-module web app with deliberate OWASP-style weaknesses for education, tool calibration, and authorized practice only. It is not a production application and must never be exposed to the public internet.

## Quick start

From the repository root:

```bash
docker compose up --build
```

Open **http://127.0.0.1:3000** in your browser. The stack binds to localhost only (`127.0.0.1` in `docker-compose.yml`).

Optional: copy `.env.example` to `.env` and adjust `SESSION_SECRET` for your machine. Defaults are lab-only fiction.

Stop the lab:

```bash
docker compose down
```

## Purpose

- Exercise **manual** testing workflows (browser, Burp, curl, custom scanners).
- Map findings to **OWASP Top 10** categories via labeled modules and routes.
- Compare scanner output against known vulnerable patterns in a controlled environment.

All credentials, data, and “secrets” in this repo are **lab fiction** — not real users or production values.

## Module map

| Route | OWASP category | Description |
|-------|----------------|-------------|
| `/` | — | Lab home, module index, seeded user table |
| `/injection/` | A03 Injection | Injection module index |
| `/injection/sql` | A03 Injection | SQL injection via unsanitized `id` / `q` query (string-built query) |
| `/injection/html` | A03 Injection | HTML injection (GET/POST `html`) |
| `/xss/` | A03 Injection | XSS module index |
| `/xss/reflected` | A03 Injection | Reflected XSS via `?q=` echoed unsafely |
| `/xss/stored` | A03 Injection | Stored XSS guestbook (`POST` comment, no encoding) |
| `/auth/` | A07 Identification & Authentication Failures | Broken auth overview |
| `/auth/login` | A07 Identification & Authentication Failures | Plaintext password check, weak session cookie flags |
| `/auth/logout` | A07 Identification & Authentication Failures | Session teardown |
| `/auth/register` | A07 Identification & Authentication Failures | Registration stub |
| `/idor/` | A01 Broken Access Control | IDOR module index |
| `/idor/profile` | A01 Broken Access Control | Profile by `?userId=` with no ownership check |
| `/access/` | A01 Broken Access Control | Broken access control index |
| `/access/admin` | A01 Broken Access Control | “Admin” UI gated only by login, not role |
| `/csrf/` | A01 Broken Access Control | CSRF module index |
| `/csrf/transfer` | A01 Broken Access Control | Balance transfer with no CSRF token (`GET`/`POST`) |
| `/ssrf/` | A10 Server-Side Request Forgery | SSRF module index |
| `/ssrf/fetch` | A10 Server-Side Request Forgery | Server-side `fetch` to user-supplied URL |
| `/misconfig/` | A05 Security Misconfiguration | Misconfiguration index (`DEBUG` env hint) |
| `/misconfig/debug` | A05 Security Misconfiguration | Verbose debug page when `DEBUG=true` (fiction env dump) |
| `/exposure/` | A02 Sensitive Data Exposure | Sensitive data exposure index |
| `/exposure/config` | A02 Sensitive Data Exposure | JSON config leak with fiction API keys and DB passwords |

## Example test URLs

Copy-paste in a terminal (lab must be running):

```bash
# Home — should mention lab / Security Lab
curl -s http://127.0.0.1:3000/ | head -20

# Reflected XSS entry point
curl -s "http://127.0.0.1:3000/xss/reflected?q=test"

# SQL injection lab (benign id)
curl -s "http://127.0.0.1:3000/injection/sql?id=1"

# Sensitive config JSON (fiction secrets only)
curl -s "http://127.0.0.1:3000/exposure/config"

# CSRF transfer form
curl -s "http://127.0.0.1:3000/csrf/transfer"

# SSRF fetch lab
curl -s "http://127.0.0.1:3000/ssrf/fetch?url=http://127.0.0.1:3000/"

# Auth login page
curl -s "http://127.0.0.1:3000/auth/login"

# IDOR — fetch another user's profile without auth
curl -s "http://127.0.0.1:3000/idor/profile?userId=2"
```

Browser: same paths on **http://127.0.0.1:3000**.

## Demo accounts (lab fiction only)

These users exist only in the seeded SQLite database for exercises. **Do not reuse these passwords anywhere else.**

| Username | Password | Role |
|----------|----------|------|
| `alice` | `password` | user |
| `bob` | `password` | user |
| `admin` | `admin123` | admin |

Login: **http://127.0.0.1:3000/auth/login**

## Legal and educational disclaimer

You may use this software **only**:

- On systems you own or have **explicit written permission** to test.
- For **education**, security research, or tool development in isolated lab environments.

Unauthorized access to computer systems is illegal in many jurisdictions. The authors provide this project **as-is** with no warranty. You are solely responsible for compliance with applicable laws and organizational policies. **Do not deploy** this application to shared, staging, or production networks.

## Repository layout

- `playground/` — Node.js 20 + Express + EJS + SQLite app
- `Dockerfile`, `docker-compose.yml` — containerized lab runtime
- `.env.example` — optional local overrides (no real secrets)

## Security notice

This codebase contains **intentional vulnerabilities** by design. Do not fork it into production services, paste its patterns into real apps, or host it beyond localhost without understanding the risk.
