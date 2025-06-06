
const params  = new URLSearchParams(location.search);
const course  = params.get("course");           // des | mobile | iot
const files   = { des:"data/des.json", mobile:"data/mobile.json", iot:"data/iot.json" };
const titles  = { des:"اختبار تصميم وتحليل الأنظمة", mobile:"اختبار تطبيقات الموبايل",
                  iot:"اختبار إنترنت الأشياء" };

document.getElementById("title").textContent = titles[course] || "اختبار";

const quizBox   = document.getElementById("quiz");
const submitBtn = document.getElementById("submit");

let quizData=[], answers=[];

/* ---------- جلب ملف الأسئلة المناسب ---------- */
fetch(files[course]).then(r=>r.json()).then(data=>{
   quizData=data;
   renderQuestions();
});

function renderQuestions(){
   quizData.forEach((q,i)=>{
      const card = document.createElement("div");
      card.className="card";
      let html = `<h5 class="mb-2">${i+1}. ${q.question}</h5>`;
      q.options.forEach((opt,idx)=>{
          html += `
            <label class="option" id="lbl-${i}-${idx}">
               <input type="radio" name="q${i}" value="${idx}">
               ${opt}
            </label>`;
      });
      card.innerHTML = html;
      quizBox.appendChild(card);
   });
}

document.addEventListener("change", e=>{
   if(e.target.type==="radio"){
      // إزالة تحديد قديم
      document.querySelectorAll(`label[name="${e.target.name}-lbl"]`);
      // تظليل المختار
      document.querySelectorAll(`input[name="${e.target.name}"]`).forEach(inp=>{
         document.getElementById(`lbl-${e.target.name.slice(1)}-${inp.value}`)
                 .classList.toggle("selected", inp.checked);
      });

      answers = quizData.map((_,i)=>{
         const sel=document.querySelector(`input[name=q${i}]:checked`);
         return sel ? Number(sel.value): null;
      });
      submitBtn.disabled = answers.includes(null);
   }
});

/* ---------- النتيجة والمراجعة ---------- */
submitBtn.onclick = ()=>{
   let score=0;
   quizData.forEach((q,i)=>{
      const user = answers[i];
      const correct = q.correct_option_id;
      const lblCorrect = document.getElementById(`lbl-${i}-${correct}`);
      lblCorrect.classList.add("correct");

      if(user===correct){
         score++;
      }else{
         const lblWrong = document.getElementById(`lbl-${i}-${user}`);
         if(lblWrong) lblWrong.classList.add("wrong");
      }
   });

   document.body.innerHTML = `
     <div class="d-flex flex-column align-items-center justify-content-center vh-100 text-center">
        <h1 class="display-4 mb-3">النتيجة النهائية</h1>
        <p class="lead mb-4">درجتك: <strong>${score}</strong> من <strong>${quizData.length}</strong></p>
        <a class="btn btn-main mb-2" href="index.html">العودة للاختبارات</a>
        <button class="btn btn-outline-secondary" onclick="Telegram.WebApp.close()">إغلاق النافذة</button>
     </div>
   `;
};
