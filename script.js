
/*  ========= script.js =========  */
const tg = window.Telegram.WebApp;
tg.expand();                    // يفتح الميني-آب بالحجم الكامل

let answers = [];
let quizData = [];

// جلب أسئلة JSON من GitHub
fetch("https://raw.githubusercontent.com/AboALhasanx/json-files/refs/heads/main/dess_quiz.json")
  .then(r => r.json())
  .then(data => {
    quizData = data;
    const box = document.getElementById('quiz');

    data.forEach((q, i) => {
      const div = document.createElement('div');
      div.className = "card p-3";
      div.innerHTML = `
        <h5 class="mb-3">${i + 1}. ${q.question}</h5>
        ${q.options.map((opt, idx) => `
            <div class="form-check">
              <input class="form-check-input" type="radio"
                     name="q${i}" id="q${i}_${idx}" value="${idx}">
              <label class="form-check-label" for="q${i}_${idx}">
                  ${opt}
              </label>
            </div>
        `).join('')}
      `;
      box.appendChild(div);
    });
  });

// تحقّق من اختيار كل الأسئلة لتمكين زر الإرسال
document.addEventListener('change', () => {
  const total = quizData.length;
  answers = [];

  for (let i = 0; i < total; i++) {
    const sel = document.querySelector(`input[name=q${i}]:checked`);
    answers.push(sel ? Number(sel.value) : null);
  }

  document.getElementById('submit').disabled = answers.includes(null);
});

// إرسال البيانات إلى البوت
document.getElementById('submit').onclick = () => {
  tg.sendData(JSON.stringify({
    quiz: "des",
    answers
  }));
  tg.close();   // يُغلق الميني-آب ويعيد المستخدم إلى الدردشة
};
