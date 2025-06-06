/* ========= script.js ========= */
const tg = window.Telegram.WebApp;
tg.expand();                              // يفتح الميني-آب بالحجم الكامل

let answers = [];
let quizData = [];

// ❶ جلب ملف الأسئلة (نفس الذي يستخدمه البوت)
fetch("https://raw.githubusercontent.com/AboALhasanx/json-files/refs/heads/main/dess_quiz.json")
  .then(r => r.json())
  .then(data => {
    quizData = data;
    const box = document.getElementById('quiz');

    data.forEach((q, i) => {
      const card = document.createElement('div');
      card.className = "card p-3";
      card.innerHTML = `
        <h5 class="mb-3">${i + 1}. ${q.question}</h5>
        ${q.options.map((opt, idx) => `
          <div class="form-check">
            <input class="form-check-input" type="radio"
                   name="q${i}" id="q${i}_${idx}" value="${idx}">
            <label class="form-check-label" for="q${i}_${idx}">${opt}</label>
          </div>
        `).join('')}
      `;
      box.appendChild(card);
    });
  });

// ❷ تمكين زرّ الإرسال بعد الإجابة على كلّ الأسئلة
document.addEventListener('change', () => {
  answers = quizData.map((_, i) => {
     const sel = document.querySelector(`input[name=q${i}]:checked`);
     return sel ? Number(sel.value) : null;
  });
  document.getElementById('submit').disabled = answers.includes(null);
});

// ❸ إرسال البيانات وإظهار رسالة نجاح دون إغلاق تلقائي
document.getElementById('submit').onclick = () => {
  tg.sendData(JSON.stringify({ quiz: "des", answers }));

  document.body.innerHTML = `
    <div class="d-flex flex-column align-items-center justify-content-center vh-100 text-center"
         style="background:#f1f3f5;color:#333">
      <h1 class="display-4 mb-3">✅ تم الإرسال</h1>
      <p class="lead mb-4">يمكنك العودة للدردشة لمعرفة نتيجتك.</p>
      <button class="btn btn-outline-primary" onclick="Telegram.WebApp.close()">
          إغلاق
      </button>
    </div>
  `;
};
