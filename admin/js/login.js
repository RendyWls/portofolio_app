// public/admin/js/login.js
document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  // Validasi client-side
  if (username.length < 6) {
    return showError("Username minimal 6 karakter.");
  }

  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/;
  if (!passwordRegex.test(password)) {
    return showError("Password harus minimal 6 karakter dan kombinasi huruf + angka.");
  }

  try {
    const response = await fetch("http://127.0.0.1:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const result = await response.json();

    if (response.ok) {
      localStorage.setItem("adminUsername", username);
      alert("Login berhasil!");
      window.location.href = "../index.html";
    } else {
      showError(result.message || "Login gagal.");
    }
  } catch (err) {
    showError("Gagal terhubung ke server.");
    console.error(err);
  }
});

function showError(message) {
  const errorDiv = document.getElementById("errorMsg");
  errorDiv.innerText = message;
  errorDiv.style.display = "block";
}
