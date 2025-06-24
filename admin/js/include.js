// admin/js/include.js
document.addEventListener("DOMContentLoaded", () => {
  const includeHTML = async (selector, file) => {
    const element = document.querySelector(selector);
    if (element) {
      try {
        const res = await fetch(file);
        if (!res.ok) throw new Error(`Gagal memuat: ${file}`);
        const html = await res.text();
        element.innerHTML = html;
        console.log(`✅ Berhasil muat ${file} ke ${selector}`);
        if (selector === "#navbar") updateNavbar();
      } catch (err) {
        console.error(`❌ Error saat memuat ${file}:`, err.message);
      }
    }
  };

  includeHTML("#navbar", "/partials/navbar.html");
  includeHTML("#footer", "/partials/footer.html");

  const updateNavbar = () => {
    const username = localStorage.getItem("adminUsername");
    const navbarLinks = document.getElementById("navbarLinks");

    if (navbarLinks) {
      if (username) {
        navbarLinks.innerHTML = `
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle text-white" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown">
            Halo, ${username}
          </a>
          <ul class="dropdown-menu dropdown-menu-end">
            <li><a class="dropdown-item" href="/admin/profile.html">Edit Profil</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><button class="dropdown-item" id="logoutBtn">Logout</button></li>
          </ul>
        </li>
      `;

        document.getElementById("logoutBtn").addEventListener("click", () => {
          localStorage.clear();
          window.location.href = "/admin/login.html";
        });
      } else {
        navbarLinks.innerHTML = `
        <li class="nav-item"><a class="nav-link" href="/admin/login.html">Login</a></li>
        <li class="nav-item"><a class="nav-link" href="/admin/signup.html">Sign Up</a></li>
      `;
      }
    }
  };
});
