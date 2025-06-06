/* ============= quiz.js ============= */

/* — قراءة اسم المادّة من الـ URL —*/
const params  = new URLSearchParams(location.search);
const course  = params.get("course");               // des | mobile | iot

/* — روابط ملفات الأسئلة الخام على GitHub —*/
const files = {
  des   : "https://raw.githubusercontent.com/AboALhasanx/json-files/refs/heads/main/dess_quiz.json",
  mobile: "https://raw.githubusercontent.com/AboALhasanx/json-files/refs/heads/main/mobApp_quiz.json",
  iot   : "https://raw.githubusercontent.com/AboALhasanx/json-files/refs/heads/main/iot_quiz.json"
};

/* — عناوين المواد للعرض في رأس الصفحة —*/
const titles = {
  des   : "اختبار تصميم وتحليل الأنظمة",
  mobile: "اختبار تطبيقات الموبايل",
  iot   : "اختبار إنترنت الأشياء"
};

document.getElementById("title").textContent = titles[course] || "اختبار";

const quizBox   = document.getElementById("quiz");
const submitBtn = document.getElementById("submit");

let quizData = [];   // الأسئلة من JSON
let answers  = [];   // إجابات المستخدم (أرقام)

/* ---------- جلب ملف JSON المناسب ---------- */
fetch(files[course])
  .then(r => r.json())
  .then(data => {
      quizData = data;
      renderQuestions();
  })
  .catch(() => {
      quizBox.innerHTML = `<div class="alert alert-danger">تعذّر تحميل الأسئلة.</div>`;
  });

/* ---------- توليد بطاقات الأسئلة ---------- */
function renderQuestions() {
   quizData.forEach((q, i) => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
         <h5 class="mb-2">${i + 1}. ${q.question}</h5>
         ${q.options.map((opt, idx) => `
            <label class="option" id="lbl-${i}-${idx}">
              <input type="radio" name="q${i}" value="${idx}">
              ${opt}
            </label>
         `).join("")}
      `;
      quizBox.appendChild(card);
   });
}

/* ---------- متابعة الاختيارات لتمكين زر الإرسال ---------- */
document.addEventListener("change", e => {
   if (e.target.type === "radio") {
      const name = e.target.name;          // q0, q1, ...
      document.querySelectorAll(`input[name="${name}"]`).forEach(inp => {
         document
           .getElementById(`lbl-${name.slice(1)}-${inp.value}`)
           .classList.toggle("selected", inp.checked);
      });

      answers = quizData.map((_, i) => {
         const sel = document.querySelector(`input[name=q${i}]:checked`);
         return sel ? Number(sel.value) : null;
      });
      submitBtn.disabled = answers.includes(null);
   }
});

/* ---------- حساب النتيجة وعرض المراجعة ---------- */
submitBtn.onclick = () => {
   let score = 0;

   quizData.forEach((q, i) => {
      const user    = answers[i];
      const correct = q.correct_option_id;

      // تلوين الصحيح
      document
        .getElementById(`lbl-${i}-${correct}`)
        .classList.add("correct");

      if (user === correct) {
         score++;
      } else {
         // تلوين الخطأ (إن اختار شيئاً)
         if (user !== null) {
            document
              .getElementById(`lbl-${i}-${user}`)
              .classList.add("wrong");
         }
      }
   });

   // إظهار خلاصة الدرجة وزرين
   document.body.innerHTML = `
      <div class="d-flex flex-column align-items-center justify-content-center vh-100 text-center">
         <h1 class="display-4 mb-3">النتيجة النهائية</h1>
         <p class="lead mb-4">درجتك: <strong>${score}</strong> من <strong>${quizData.length}</strong></p>
         <a class="btn btn-main mb-2" href="index.html">العودة للاختبارات</a>
         <button class="btn btn-outline-secondary" onclick="Telegram.WebApp.close()">إغلاق النافذة</button>
      </div>
   `;
};
