// ===========================
// AUTENTIKASI & INISIALISASI
// ===========================
const username = localStorage.getItem("adminUsername");
if (!username) {
  alert("Silahkan login terlebih dahulu.");
  window.location.href = "login.html";
}
const welcomeMsg = document.getElementById("welcomeMsg");
if (welcomeMsg) {
  welcomeMsg.textContent = `Halo, ${username}`;
}
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "login.html";
});

// ==========================
// AKUN: TABEL & TAMBAH/HAPUS
// ==========================
async function fetchAkunList() {
  try {
    const res = await fetch("http://localhost:5000/api/akun");
    const data = await res.json();

    const tbody = document.getElementById("akunTableBody");
    if (tbody) {
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
    }
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
      loadAkunSelect();
    } else {
      alert("Gagal menghapus akun.");
    }
  } catch (err) {
    console.error(err);
  }
}

const akunForm = document.getElementById("addAkunForm");
if (akunForm) {
  akunForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nama = document.getElementById("namaAkun").value.trim();
    const saldo = parseInt(document.getElementById("saldoAwal").value);

    if (!nama || saldo < 0) {
      return alert("Isi nama akun dan saldo awal dengan benar.");
    }

    try {
      const res = await fetch("http://localhost:5000/api/akun", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ namaAkun: nama, saldoAwal: saldo }),
      });

      if (res.ok) {
        alert("Akun berhasil ditambahkan!");
        akunForm.reset();
        document.querySelector("#addAkunModal .btn-close").click();
        fetchAkunList();
        loadAccountChart();
        loadAkunSelect();
      } else {
        const data = await res.json();
        alert("Gagal menambahkan akun: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan.");
    }
  });
}

// ========================
// AKUN: CHART SALDO BAR
// ========================
let akunChartInstance = null;
async function loadAccountChart() {
  try {
    const res = await fetch("http://localhost:5000/api/akun");
    const akunData = await res.json();

    const ctx = document.getElementById("accountChart");
    if (ctx) {
      // Destroy chart jika sudah ada
      if (akunChartInstance) akunChartInstance.destroy();

      akunChartInstance = new Chart(ctx, {
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

// ==========================
// TRANSAKSI: DROPDOWN & FORM
// ==========================
async function loadAkunSelect() {
  try {
    const res = await fetch("http://localhost:5000/api/akun");
    const akunList = await res.json();
    const akunSelect = document.getElementById("akunSelect");
    if (!akunSelect) return;

    akunSelect.innerHTML = '<option value="">Pilih Akun</option>';
    akunList.forEach((akun) => {
      const option = document.createElement("option");
      option.value = akun._id;
      option.textContent = akun.namaAkun;
      akunSelect.appendChild(option);
    });
  } catch (err) {
    console.error("Gagal memuat akun ke dropdown:", err);
  }
}

document.getElementById("tanggal").valueAsDate = new Date();

const formTransaksi = document.getElementById("formTransaksi");
if (formTransaksi) {
  formTransaksi.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = {
      akunId: document.getElementById("akunSelect").value,
      jumlah: parseInt(document.getElementById("jumlah").value),
      kategori: document.getElementById("kategori").value,
      jenis: document.getElementById("jenis").value,
      tanggal: document.getElementById("tanggal").value,
    };

    try {
      const res = await fetch("http://localhost:5000/api/transaksi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        alert("Transaksi berhasil ditambahkan.");
        document.querySelector("#addTransaksi .btn-close").click();
        e.target.reset();
        document.getElementById("tanggal").valueAsDate = new Date();
        loadTransaksiTable();
        loadAccountChart();
        fetchAkunList();
      } else {
        const error = await res.json();
        alert("Gagal: " + error.message);
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan.");
    }
  });
}

// ==========================
// TRANSAKSI: TABEL RIWAYAT
// ==========================
async function loadTransaksiTable() {
  try {
    const res = await fetch("http://localhost:5000/api/transaksi");
    const transaksiList = await res.json();
    const tbody = document.getElementById("transaksiTableBody");
    if (!tbody) return;

    tbody.innerHTML = "";
    transaksiList.forEach((trx) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${new Date(trx.tanggal).toLocaleDateString("id-ID")}</td>
        <td>${trx.akunId.namaAkun || "-"}</td>
        <td>${trx.jumlah.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}</td>
        <td>${trx.kategori}</td>
        <td>${trx.jenis.charAt(0).toUpperCase() + trx.jenis.slice(1)}</td>
        <td>${trx.saldoAkhir !== undefined ? trx.saldoAkhir.toLocaleString("id-ID", { style: "currency", currency: "IDR" }) : "-"}</td>
        <td>
            <button class="btn btn-sm btn-outline-danger" onclick="hapusAkun('${trx._id}')">Hapus</button>
            <button class="btn btn-sm btn-outline-primary" onclick="hapusAkun('${trx._id}')">Edit</button>
          </td>
      `;
      tbody.appendChild(row);
    });
  } catch (err) {
    console.error("Gagal memuat transaksi:", err);
  }
}

// ========================
// NAVIGASI SIDEBAR
// ========================
function showSection(name) {
  const sections = ["dashboard", "akun", "transaksi", "budgeting"];
  sections.forEach((s) => {
    document.getElementById(`${s}Section`).classList.add("d-none");
  });

  document.getElementById(`${name}Section`).classList.remove("d-none");
  document.getElementById("pageTitle").textContent = name.charAt(0).toUpperCase() + name.slice(1);

  // Load data sesuai halaman
  if (name === "dashboard") loadAccountChart();
  if (name === "akun") fetchAkunList();
  if (name === "transaksi") {
    loadAkunSelect();
    loadTransaksiTable();
  }
}

// ========================
// INISIALISASI AWAL
// ========================
document.addEventListener("DOMContentLoaded", () => {
  fetchAkunList();
  loadAkunSelect();
  loadAccountChart();
  loadTransaksiTable();
});
