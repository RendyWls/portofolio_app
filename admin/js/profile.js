document.addEventListener("DOMContentLoaded", async () => {
  const username = localStorage.getItem("adminUsername");
  if (!username) return (window.location.href = "/admin/login.html");

  // Get current profile data
  try {
    const res = await fetch(`http://127.0.0.1:5000/api/auth/profile/${username}`);
    const data = await res.json();

    document.getElementById("email").value = data.email;
    document.getElementById("username").value = data.username;
    document.getElementById("dob").value = data.dateOfBirth?.split("T")[0] || "";
  } catch (err) {
    console.error("Gagal memuat profil:", err);
  }

  // Submit edited profile
  document.getElementById("profileForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const newUsername = document.getElementById("username").value;
    const dob = document.getElementById("dob").value;

    try {
      const res = await fetch(`http://127.0.0.1:5000/api/auth/profile/${username}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username: newUsername, dateOfBirth: dob }),
      });

      if (res.ok) {
        document.getElementById("successMsg").innerText = "Profil berhasil diperbarui.";
        document.getElementById("successMsg").style.display = "block";
        localStorage.setItem("adminUsername", newUsername);
      } else {
        alert("Gagal update profil.");
      }
    } catch (err) {
      console.error("Gagal:", err);
    }
  });
});
