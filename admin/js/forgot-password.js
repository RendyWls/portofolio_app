// admin/js/forgot-password.js
document.getElementById("forgotForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();

  try {
    const response = await fetch("http://127.0.0.1:5000/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const result = await response.json();

    if (response.ok) {
      document.getElementById("message").innerText = result.message;
      document.getElementById("message").style.display = "block";
      document.getElementById("errorMsg").style.display = "none";
    } else {
      document.getElementById("errorMsg").innerText = result.message;
      document.getElementById("errorMsg").style.display = "block";
      document.getElementById("message").style.display = "none";
    }
  } catch (err) {
    console.error(err);
    document.getElementById("errorMsg").innerText = "Gagal mengirim permintaan.";
    document.getElementById("errorMsg").style.display = "block";
  }
});
