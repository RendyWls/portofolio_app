// Cek login
const username = localStorage.getItem("adminUsername");
if (!username) {
  alert("Silahkan login terlebih dahulu.");
  window.location.href = "login.html";
}

// Logout tombol
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "login.html";
});

// Inisialisasi greeting
const welcomeMsg = document.getElementById("welcomeMsg");
if (welcomeMsg) {
  welcomeMsg.textContent = `Halo, ${username}`;
}

// Ambil dan tampilkan data akun dalam tabel
async function fetchAkunList() {
  try {
    const res = await fetch("http://localhost:5000/api/akun");
    const data = await res.json();

    const tbody = document.getElementById("akunTableBody");
    tbody.innerHTML = "";

    data.forEach((akun) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${akun.namaAkun}</td>
        <td>Rp ${akun.saldoAwal.toLocaleString("id-ID")}</td>
        <td>
          <button class="btn btn-sm btn-outline-danger" onclick="hapusAkun('${akun._id}')">Hapus</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  } catch (err) {
    console.error("Gagal ambil data akun:", err);
  }
}

async function hapusAkun(id) {
  if (!confirm("Yakin ingin menghapus akun ini?")) return;

  try {
    const res = await fetch(`http://localhost:5000/api/akun/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      fetchAkunList();
      loadAccountChart();
    } else {
      alert("Gagal menghapus akun.");
    }
  } catch (err) {
    console.error(err);
  }
}

// Chart
async function loadAccountChart() {
  try {
    const res = await fetch("http://localhost:5000/api/akun");
    const akunData = await res.json();

    const ctx = document.getElementById("accountChart");
    if (ctx) {
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: akunData.map((a) => a.namaAkun),
          datasets: [
            {
              label: "Total Saldo",
              data: akunData.map((a) => a.saldoAwal),
              backgroundColor: ["#0d6efd", "#198754", "#ffc107", "#dc3545"],
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: (value) => "Rp " + value.toLocaleString("id-ID"),
              },
            },
          },
        },
      });
    }
  } catch (err) {
    console.error("Gagal memuat data akun:", err);
  }
}

// Jalankan chart saat pertama kali tampil
loadAccountChart();

// Tambah akun
const akunForm = document.getElementById("addAkunForm");
akunForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const nama = document.getElementById("namaAkun").value.trim();
  const saldo = parseInt(document.getElementById("saldoAwal").value);

  if (!nama || saldo < 0) {
    return alert("Isi nama akun dan saldo awal dengan benar.");
  }
  console.log("Data yang akan dikirim:", { namaAkun: nama, saldoAwal: saldo });
  try {
    const res = await fetch("http://localhost:5000/api/akun", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ namaAkun: nama, saldoAwal: saldo }),
    });

    if (res.ok) {
      alert("Akun berhasil ditambahkan!");
      akunForm.reset();
      document.getElementById("addAkunModal").querySelector(".btn-close").click();
      fetchAkunList();
      loadAccountChart();
    } else {
      alert("Gagal menambahkan akun: " + data.message); // tampilkan pesan server
    }
  } catch (err) {
    console.error(err);
    alert("Terjadi kesalahan.");
  }
});

// Navigasi sidebar
function showSection(name) {
  const sections = ["dashboard", "akun", "transaksi", "budgeting"];
  sections.forEach((s) => {
    document.getElementById(`${s}Section`).classList.add("d-none");
  });
  document.getElementById(`${name}Section`).classList.remove("d-none");
  document.getElementById("pageTitle").textContent = name.charAt(0).toUpperCase() + name.slice(1);
}

// Tambah Portofolio Dummy (sementara)
const addBtn = document.getElementById("addBtn");
if (addBtn) {
  addBtn.addEventListener("click", () => {
    alert("Form tambah portofolio akan ditambahkan nanti.");
  });
}

// Jalankan fetch akun pertama kali
fetchAkunList();
