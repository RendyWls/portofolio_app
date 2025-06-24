// public/admin/js/forgot-password.js

document.getElementById("forgotForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();

  try {
    const response = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const result = await response.json();

    if (response.ok) {
      alert("Link reset telah dikirim ke email (jika terdaftar).");
      window.location.href = "login.html";
    } else {
      alert(result.message || "Email tidak ditemukan.");
    }
  } catch (error) {
    alert("Terjadi kesalahan saat mengirim permintaan.");
    console.error(error);
  }
});
