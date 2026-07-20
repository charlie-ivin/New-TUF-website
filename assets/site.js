// Loads content/site.json and builds the nav + footer on every page.
// Each page still adds its own internal nav links in HTML (Home, Timetable,
// Apply to Join, Timeline) — this script only injects the external links
// and footer text, which are the bits editors change most often.

async function loadSite() {
  const res = await fetch('content/site.json');
  const site = await res.json();

  const navLinks = document.querySelector('.nav-links');
  if (navLinks && site.external_links) {
    site.external_links.forEach(link => {
      const a = document.createElement('a');
      a.href = link.url;
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = link.label;
      navLinks.appendChild(a);
    });
  }

  const footer = document.querySelector('footer');
  if (footer && site.footer_text) {
    footer.innerHTML = `${site.footer_text} | ${site.footer_credit_label} <a href="${site.footer_credit_url}" target="_blank" rel="noopener" style="color:inherit;">${site.footer_credit_url.replace(/^https?:\/\//,'')}</a>`;
  }
}

loadSite();
