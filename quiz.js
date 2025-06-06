/* ========= quiz.js ========= */
const params = new URLSearchParams(location.search);
const course = params.get("course");

const files = {
  des   : "https://raw.githubusercontent.com/AboALhasanx/json-files/refs/heads/main/dess_quiz.json",
  mobile: "https://raw.githubusercontent.com/AboALhasanx/json-files/refs/heads/main/mobApp_quiz.json",
  iot   : "https://raw.githubusercontent.com/AboALhasanx/json-files/refs/heads/main/iot_quiz.json"
};

const titles = {
  des   : "اختبار تصميم وتحليل الأنظمة",
  mobile: "اختبار تطبيقات الموبايل",
  iot   : "اختبار إنترنت الأشياء"
};

document.getElementById("title").textContent = titles[course] || "اختبار";

const quizBox   = document.getElementById("quiz");
const submitBtn = document.getElementById("submit");

let quizData = [];
let answers  = [];

/* 1. تحميل الأسئلة */
fetch(files[course])
 .then(r=>r.json())
 .then(data=>{
    quizData=data;
    renderQuestions();
 });

function renderQuestions(){
  quizData.forEach((q,i)=>{
    const card=document.createElement("div");
    card.className="card";
    card.innerHTML=`
      <h5 class="mb-2">${i+1}. ${q.question}</h5>
      ${q.options.map((opt,idx)=>`
        <label class="option" id="lbl-${i}-${idx}">
           <input type="radio" name="q${i}" value="${idx}">
           ${opt}
        </label>
      `).join("")}
    `;
    quizBox.appendChild(card);
  });
}

/* 2. تمكين زر الإرسال */
document.addEventListener("change",e=>{
  if(e.target.type==="radio"){
    const name=e.target.name;                      // q0
    document.querySelectorAll(`input[name="${name}"]`).forEach(inp=>{
       document.getElementById(`lbl-${name.slice(1)}-${inp.value}`)
               .classList.toggle("selected",inp.checked);
    });

    answers=quizData.map((_,i)=>{
      const sel=document.querySelector(`input[name=q${i}]:checked`);
      return sel?Number(sel.value):null;
    });
    submitBtn.disabled=answers.includes(null);
  }
});

/* 3. حساب الدرجة + إظهار شاشة نتيجة أولية */
let reviewed=false;

submitBtn.onclick=()=>{
  if(!reviewed){
      showScore();
      submitBtn.textContent="🔍 عرض التصحيح";
      reviewed=true;
      return;
  }
  // بعد الضغط مرة ثانية: عرض التصحيح بالألوان
  showReview();
  submitBtn.remove();               // نحذف الزر نهائياً
};

function showScore(){
  const score=answers.reduce((acc,ans,i)=>
        ans===quizData[i].correct_option_id?acc+1:acc,0);
  const summary=document.createElement("div");
  summary.className="alert alert-info text-center";
  summary.innerHTML=`درجتك: <strong>${score}</strong> من <strong>${quizData.length}</strong>`;
  quizBox.prepend(summary);
  window.scrollTo({top:0,behavior:"smooth"});
}

function showReview(){
  quizData.forEach((q,i)=>{
    const correct=q.correct_option_id;
    const user=answers[i];
    document.getElementById(`lbl-${i}-${correct}`).classList.add("correct");
    if(user!==correct){
      const userLbl=document.getElementById(`lbl-${i}-${user}`);
      if(userLbl) userLbl.classList.add("wrong");
    }
  });
  window.scrollTo({top:0,behavior:"smooth"});
}
