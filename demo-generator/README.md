# Demo Site Generator

Generates stunning, industry-specific single-page HTML demo sites for OpenClaw SMB leads.

## Setup

```bash
pip install playwright
playwright install chromium
```

## Usage

### CLI
```bash
echo '{"id":"abc123","business_name":"Smile Dental","industry":"Dental","time_waster":"Phone tag with patients"}' | python3 generator.py
```

### Output
- HTML saved to `sites/`
- Screenshot (1280x800) saved to `screenshots/`
- Returns JSON: `{ status, html_path, screenshot_path, theme, business_name }`

## Supported Industry Themes

| Industry | Theme | Colors |
|----------|-------|--------|
| Dental/Healthcare | Clean medical | Cyan + Blue |
| Roofing/Construction | Rugged industrial | Amber + Orange |
| Legal | Professional | Navy + Gold |
| HVAC | Technical | Sky + Slate |
| Restaurant | Warm hospitality | Red + Amber |
| Generic (fallback) | OpenClaw brand | Purple + Gold |

## Architecture
- Input: JSON via stdin (lead data)
- Output: JSON via stdout (paths + status)
- No server needed — called via Node.js `child_process` from the Next.js API
- Tailwind CSS via CDN (no build step)
- Playwright for headless screenshots
