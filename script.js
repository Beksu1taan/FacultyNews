const elements = document.querySelectorAll("section");

window.addEventListener("scroll", () => {
  elements.forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight - 100) {
      el.classList.add("active");
    }
  });
});

async function sendForm() {
  const btn = document.querySelector(".form button");

  const name = document.getElementById("name").value;
  const course = document.getElementById("course").value;
  const email = document.getElementById("email").value;

  if (!name || !course || !email) {
    alert("Заполни все поля");
    return;
  }

  btn.innerText = "Sending...";
  btn.disabled = true;

  try {
    const res = await fetch("https://facultynews-production.up.railway.app/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, course, email })
    });

    const data = await res.json();

    if (data.success) {
      alert("Заявка отправлена");

      document.getElementById("name").value = "";
      document.getElementById("course").value = "";
      document.getElementById("email").value = "";
    } else {
      alert("Ошибка при отправке");
    }

  } catch (err) {
    alert("Сервер не отвечает");
    console.log(err);
  }

  btn.innerText = "Subscribe";
  btn.disabled = false;
}
