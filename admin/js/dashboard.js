// public/admin/js/dashboard.js

// Cek login
if (!localStorage.getItem("adminUsername")) {
  window.location.href = "login.html";
}

document.getElementById("welcomeMsg").textContent = localStorage.getItem("adminUsername");

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "login.html";
});

// Simulasi fetch data (dummy sementara, nanti ambil dari MongoDB)
const dummyData = [
  { title: "Portofolio Rendy", desc: "Landing untuk proyek pribadi", template: "A" },
  { title: "Profile Freelance", desc: "Halaman profile freelance", template: "B" },
];

// Render dummy portofolio
const container = document.getElementById("portfolioList");
dummyData.forEach((item) => {
  const el = document.createElement("div");
  el.className = "col";
  el.innerHTML = `
    <div class="card shadow-sm">
      <div class="card-body">
        <h5 class="card-title">${item.title}</h5>
        <p class="card-text">${item.desc}</p>
        <span class="badge bg-secondary">Template ${item.template}</span>
        <div class="mt-3 d-flex justify-content-end">
          <button class="btn btn-sm btn-outline-primary me-2">Preview</button>
          <button class="btn btn-sm btn-outline-danger">Hapus</button>
        </div>
      </div>
    </div>
  `;
  container.appendChild(el);
});

// Tambah baru
document.getElementById("addBtn").addEventListener("click", () => {
  alert("Form tambah portofolio akan muncul di versi berikutnya!");
});

const username = localStorage.getItem("adminUsername");

if (!username) {
  alert("Silahkan Login Terlebih Dahulu.");
  window.location.href = "login.html";
} else {
  document.getElementById("welcomeMsg").textContent = `Halo, ${username}`;
}
