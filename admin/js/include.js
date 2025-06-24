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

        if (selector === "#navbar") updateNavbar();
      } catch (err) {
        console.error(err.message);
      }
    }
  };

  includeHTML("#navbar", "/partials/navbar.html");
  includeHTML("#footer", "/partials/footer.html");

  const updateNavbar = () => {
    console.log("Navbar script jalan");
    console.log("Username dari localStorage:", localStorage.getItem("adminUsername"));
    const username = localStorage.getItem("adminUsername");
    const navbarLinks = document.getElementById("navbarLinks");

    if (navbarLinks) {
      if (username) {
        navbarLinks.innerHTML = `
          <li class="nav-item me-3">
            <span class="text-white">Halo, ${username}</span>
          </li>
          <li class="nav-item">
            <button class="btn btn-sm btn-outline-light" id="logoutBtn">Logout</button>
          </li>
        `;
        document.getElementById("logoutBtn").addEventListener("click", () => {
          alert("Logout Berhasil. ");
          localStorage.clear();
          window.location.reload();
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
