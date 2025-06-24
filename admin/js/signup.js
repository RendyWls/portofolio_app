document.getElementById("signupForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const username = document.getElementById("username").value.trim();
  const dateOfBirth = document.getElementById("dob").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  // Validasi username
  if (username.length < 6) {
    return showError("Username minimal 6 karakter.");
  }

  // Validasi password
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/;
  if (!passwordRegex.test(password)) {
    return showError("Password harus minimal 6 karakter dan kombinasi huruf + angka.");
  }

  if (password !== confirmPassword) {
    return showError("Konfirmasi password tidak cocok.");
  }

  try {
    const response = await fetch("http://127.0.0.1:5000/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, username, dateOfBirth, password }),
    });

    const result = await response.json();

    if (response.ok) {
      alert("Registrasi berhasil! Silakan login.");
      window.location.href = "login.html";
    } else {
      showError(result.message || "Registrasi gagal.");
    }
  } catch (err) {
    showError("Gagal terhubung ke server.");
    console.error(err);
  }
});

function showError(message) {
  const errorDiv = document.getElementById("errorMsg");
  errorDiv.classList.remove("d-none");
  errorDiv.innerText = message;
}
