/* ========= script.js ========= */
const tg = window.Telegram.WebApp;
tg.expand();                       // ملء الشاشة

let answers   = [];
let quizData  = [];

/* ❶ جلب الأسئلة */
fetch("https://raw.githubusercontent.com/AboALhasanx/json-files/refs/heads/main/dess_quiz.json")
  .then(r => r.json())
  .then(data => {
    quizData = data;
    const container = document.getElementById("quiz");

    data.forEach((q, i) => {
        const card = document.createElement("div");
        card.className = "card p-3";
        card.innerHTML = `
            <h5 class="mb-3">${i+1}. ${q.question}</h5>
            ${q.options.map((opt, idx)=>`
                <div class="form-check">
                   <input class="form-check-input" type="radio"
                          name="q${i}" id="q${i}_${idx}" value="${idx}">
                   <label class="form-check-label" for="q${i}_${idx}">
                       ${opt}
                   </label>
                </div>
            `).join("")}
        `;
        container.appendChild(card);
    });
  });

/* ❷ تفعيل زر الإرسال */
document.addEventListener("change", () => {
    answers = quizData.map((_, i) => {
        const sel = document.querySelector(`input[name=q${i}]:checked`);
        return sel ? Number(sel.value) : null;
    });
    document.getElementById("submit").disabled = answers.includes(null);
});

/* ❸ عند الإرسال: حساب النتيجة وعرضها */
document.getElementById("submit").onclick = () => {
    const score = answers.reduce((acc, ans, i) =>
        ans === quizData[i].correct_option_id ? acc + 1 : acc, 0);

    // محتوى صفحة النتيجة
    document.body.innerHTML = `
        <div class="d-flex flex-column align-items-center justify-content-center vh-100 text-center">
            <h1 class="display-4 mb-3">✅ تم التصحيح</h1>
            <p class="lead mb-4">درجتك: <strong>${score}</strong> من <strong>${quizData.length}</strong></p>
            <button class="btn btn-outline-primary" onclick="Telegram.WebApp.close()">إغلاق</button>
        </div>
    `;
};
