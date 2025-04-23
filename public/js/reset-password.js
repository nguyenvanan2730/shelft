document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("reset-password-form");
    const errorMsg = document.getElementById("password-error-msg");
    const resetBtn = document.getElementById("reset-btn");
  
    /**
     * Muestra un mensaje de error y aplica animación shake al botón
     * @param {string} message
     */
    function showError(message) {
      errorMsg.textContent = message;
      errorMsg.classList.remove("hidden-msg");
  
      resetBtn.classList.add("shake");
      setTimeout(() => {
        resetBtn.classList.remove("shake");
      }, 400);
    }
  
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const password = form.elements["new_password"].value;
      const confirmPassword = form.elements["confirm_password"].value;
  
      // Validaciones
      if (password.length < 8) {
        showError("Password must be at least 8 characters long.");
        return;
      }
  
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        showError("Password must include at least one special character.");
        return;
      }
  
      if (password !== confirmPassword) {
        showError("Passwords do not match.");
        return;
      }
  
      // Si todo va bien, ocultamos errores anteriores
      errorMsg.classList.add("hidden-msg");
  
      // Extrae el token de la URL
      const token = window.location.pathname.split("/").pop();
  
      try {
        const res = await fetch(`/api/reset-password/${token}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ new_password: password }),
        });
  
        if (!res.ok) {
          showError("There was a problem resetting your password.");
          return;
        }
  
        // Éxito: redirige al login
        window.location.href = "/login";
      } catch (error) {
        console.error("Error resetting password:", error);
        showError("Something went wrong. Please try again.");
      }
    });
  });
  