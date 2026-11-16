let users = JSON.parse(localStorage.getItem('bac_users') || '[]');
let lessons = JSON.parse(localStorage.getItem('bac_lessons') || '[]');
let currentUser = null;
let points = 0;
let chosen = '';

function saveUsers(){ localStorage.setItem('bac_users', JSON.stringify(users)); }
function saveLessons(){ localStorage.setItem('bac_lessons', JSON.stringify(lessons)); }

function register(){
  let name = document.getElementById('nameInput').value;
  let email = document.getElementById('emailInput').value;
  let pass = document.getElementById('passInput').value;
  if(!name || !email || !pass){ alert('عمر الكل'); return; }
  users.push({name, email, pass});
  saveUsers();
  document.getElementById('authMsg').innerText = 'تم إنشاء حسابك! توا ادخل';
}

function login(){
  let email = document.getElementById('emailInput').value;
  let pass = document.getElementById('passInput').value;
  // الأدمن
  if(email === 'imeds@gmail.com' && pass === 'admin123'){
    currentUser = {name:'الأدمن - Imeds', email, isAdmin:true};
    showApp(); return;
  }
  let found = users.find(u => u.email === email && u.pass === pass);
  if(found){
    currentUser = {name: found.name, email, isAdmin:false};
    showApp();
  } else {
    document.getElementById('authMsg').innerText = 'الإيميل ولا كلمة السر غالطة';
  }
}

function showApp(){
  document.getElementById('authBox').style.display = 'none';
  document.getElementById('studentBox').style.display = 'block';
  document.getElementById('userBar').innerText = 'مرحبا يا ' + currentUser.name;
  document.getElementById('welcomeText').innerText = 'مرحبا يا ' + currentUser.name;
  if(currentUser.isAdmin){
    document.getElementById('adminBox').style.display = 'block';
    updateStudents();
  }
  renderLessons();
  updatePoints();
}

function updateStudents(){
  document.getElementById('studentsCount').innerText = users.length;
  document.getElementById('studentsList').innerHTML = users.map(u => '<p>👤 ' + u.name + ' - ' + u.email + '</p>').join('');
}

function openAddContent(){ document.getElementById('addContentModal').style.display = 'block'; }
function closeAddContent(){ document.getElementById('addContentModal').style.display = 'none'; }

function chooseType(t){
  chosen = t;
  document.getElementById('contentForm').style.display = 'block';
  document.getElementById('chosenType').innerText = 'نوع المحتوى: ' + t;
}

function publishLesson(){
  let subj = document.getElementById('subjectInput').value;
  let axis = document.getElementById('axisInput').value;
  let title = document.getElementById('titleInput').value;
  let body = document.getElementById('bodyInput').value;
  let isFree = document.getElementById('freeInput').value;
  if(!title){ alert('اكتب عنوان الدرس'); return; }
  lessons.push({subj, axis, title, body, type: chosen, isFree});
  saveLessons();
  renderLessons();
  alert('تم نشر الدرس! التلامذة يشوفوه توا 🚀');
  closeAddContent();
}

function renderLessons(){
  let box = document.getElementById('lessonsList');
  if(lessons.length === 0){
    box.innerHTML = '<p>مازال ما فما حتى درس - الأدمن يزيد الدروس من زر إضافة محتوى</p>';
    return;
  }
  box.innerHTML = lessons.map((l, i) => {
    if(l.isFree === 'paid' && !currentUser.isAdmin){
      return '<div class="lesson">🔒 ' + l.subj + ' - ' + l.title + ' (مدفوع - اشترك باش تفتحو)</div>';
    }
    return '<div class="lesson"><b>' + l.type + ' - ' + l.subj + ' / ' + l.axis + '</b><br>' + l.title + '<br>' + l.body + '<br><button onclick="completeLesson()">كملت الدرس ✅ +20</button></div>';
  }).join('');
}

function updatePoints(){
  document.getElementById('pointsEl').innerText = points;
  let lvl = points < 100 ? 'مبتدئ' : points < 300 ? 'مجتهد' : points < 600 ? 'بطل' : 'أسطورة الباك';
  document.getElementById('levelEl').innerText = lvl;
  document.getElementById('progressBar').style.width = Math.min(points, 600)/6 + '%';
}
function addPoints(n){ points += n; updatePoints(); }
function completeLesson(){ addPoints(20); alert('برافو! +20 نقطة'); }
function answerQuiz(ok){
  if(ok){ addPoints(50); document.getElementById('quizMsg').innerText = 'برافو! +50 نقطة 🎉'; }
  else { document.getElementById('quizMsg').innerText = 'حاول مرة أخرى'; }
}

// باك أبيض - تجربة 2 دقيقة
let bacSec = 120, bacInt = null;
function startBac(){
  clearInterval(bacInt);
  bacSec = 120;
  bacInt = setInterval(() => {
    bacSec--;
    let m = Math.floor(bacSec/60), s = bacSec%60;
    document.getElementById('bacTimer').innerText = '00:' + (m<10?'0':'') + m + ':' + (s<10?'0':'') + s;
    if(bacSec <= 0){ clearInterval(bacInt); alert('وفى الوقت! سلم الورقة'); }
  }, 1000);
}
function submitBac(){
  clearInterval(bacInt);
  addPoints(100);
  document.getElementById('bacMsg').innerHTML = 'نتيجتك: <b>12.5 / 20</b><br>المقدمة 3/4 - التحليل 5/8 - النقاش 2.5/5 - الخاتمة 2/3<br>معدلك المتوقع في الباك: 13<br>برافو! +100 نقطة 🎉';
}

// بومودورو
let pomoSec = 25*60, pomoInt = null;
function startPomo(){
  clearInterval(pomoInt);
  pomoInt = setInterval(() => {
    pomoSec--;
    let m = Math.floor(pomoSec/60), s = pomoSec%60;
    document.getElementById('pomoTimer').innerText = (m<10?'0':'') + m + ':' + (s<10?'0':'') + s;
    if(pomoSec <= 0){ clearInterval(pomoInt); addPoints(20); alert('برافو! كملت جلسة +20'); pomoSec = 25*60; }
  }, 1000);
}
function stopPomo(){ clearInterval(pomoInt); }
function addTask(){
  let t = document.getElementById('taskInput').value;
  if(!t) return;
  let li = document.createElement('li');
  li.innerText = '✅ ' + t;
  document.getElementById('tasksList').appendChild(li);
  document.getElementById('taskInput').value = '';
}
function sendChat(){
  let msg = document.getElementById('chatInput').value;
  if(!msg) return;
  let d = document.createElement('p');
  d.innerText = 'انت: ' + msg;
  document.getElementById('chatBox').appendChild(d);
  document.getElementById('chatInput').value = '';
}
function encourage(){ addPoints(5); alert('شجعت صاحبك! +5 نقاط'); }
function logout(){ location.reload(); }