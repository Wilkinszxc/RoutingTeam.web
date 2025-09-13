const PEOPLE = [
  {name:"Al Wilkins Burgos",dept:"UF - Routing"},
  {name:"Aloha Mae Tayuran",dept:"UF - Routing"},
  {name:"Andrei Simon",dept:"UF - Routing"},
  {name:"Antonette Arado",dept:"UF - Routing"},
  {name:"Athea Reina Del Castillo",dept:"UF - Routing"},
  {name:"Chermae Augusto",dept:"UF - Routing"},
  {name:"Cherry Mae Castillote",dept:"UF - Routing"},
  {name:"Claire Ilaco",dept:"UF - Routing"},
  {name:"Daniel Sabal",dept:"UF - Routing"},
  {name:"David Landingin",dept:"UF - Routing"},
  {name:"Dina Liza Abaa",dept:"UF - Purchasing"},
  {name:"Gwyneth Olga Olaer",dept:"UF - Routing"},
  {name:"Hobert Ramos",dept:"UF - Routing"},
  {name:"Jarel Katug",dept:"UF - Routing"},
  {name:"Jenie Mae Cawaling",dept:"UF - Routing"},
  {name:"Jocelyn Sajol",dept:"UF - Routing"},
  {name:"Joshua Landingin",dept:"UF - Routing"},
  {name:"Keith Cortez",dept:"UF - Routing"},
  {name:"Kenneth Joseph Booc",dept:"UF - Routing"},
  {name:"Lorissa Jane Sencio",dept:"UF - Purchasing"},
  {name:"Lovely Jane Taldo",dept:"UF - Routing"},
  {name:"Mar Lourenz Peligrino",dept:"UF - Routing"},
  {name:"Myan Baguhin",dept:"UF - Routing"},
  {name:"Rae Mae Penazo",dept:"UF - Routing"},
  {name:"Rosecel Redondiez",dept:"UF - Routing"},
  {name:"WerfelDenn De Guzman",dept:"UF - Routing"},
  {name:"Zybell Salas",dept:"UF - Routing"},
];
 
const FIELDS = {
  "UF - Routing": [
    "# of Cases created/updated",
    "# of Webforms submitted on portal",
    "# of Orders Updated on WISE",
    "# of Orders Routed",
    "# of Orders Committed",
    "# of Orders Planned",
    "# of POs scheduled/rescheduled for pickup"
  ],
  "UF - Purchasing": [
    "# Created PO",
    "# Saved Order Form in the share drive",
    "# Created Packing Slip",
    "# Updated PO",
    "# Closed PO",
    "# Checked PODs & Invoices for Payment",
    "# of Emails",
    "# Meetings/ Vendor Calls Attended",
    "# Place Order",
    "# Roll back tickets",
    "# Approved tickets",
    "# Add items in BNP",
    "Create DN ( Showroom)",
    "Create RN ( Showroom)",
    "Assigned RN ( Showroom)"
  ]
};
 
const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const step3 = document.getElementById('step3');
const dateEl = document.getElementById('date');
const deptEl = document.getElementById('dept');
const nameEl = document.getElementById('name');
const toStep2Btn = document.getElementById('toStep2');
const metricsForm = document.getElementById('metricsForm');
const reviewBtn = document.getElementById('reviewBtn');
const backTo1Btn = document.getElementById('backTo1');
const outputBody = document.querySelector('#outputTable tbody');
const editBtn = document.getElementById('editBtn');
const copyBtn = document.getElementById('copyBtn');
const newEntryBtn = document.getElementById('newEntryBtn');
 
function todayLocalISO(){
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth()+1).padStart(2,'0');
  const dd = String(d.getDate()).padStart(2,'0');
  return `${yyyy}-${mm}-${dd}`;
}

function buildMetricRows(labels){
  metricsForm.innerHTML = labels.map((label,i)=>`
    <div class="form-row">
      <label for="m_${i}">${label}</label>
      <input id="m_${i}" type="number" min="0" step="1" value="0" data-label="${label}">
    </div>
  `).join('');
}

function revealCard(card){
  if(card.classList.contains('show')) return;
  card.classList.add('show');

  requestAnimationFrame(()=>{
    card.classList.add('visible');
    card.scrollIntoView({behavior:'smooth', block:'start'});
  });
}
 
dateEl.value = todayLocalISO();
nameEl.disabled = true;
 
deptEl.addEventListener('change', ()=>{
  nameEl.innerHTML = '<option value="" selected disabled>Select name</option>' +
    PEOPLE.filter(p=>p.dept===deptEl.value).map(p=>`<option>${p.name}</option>`).join('');
  nameEl.disabled = false;
  toStep2Btn.disabled = !(deptEl.value && nameEl.value);
});
 
nameEl.addEventListener('change', ()=>{
  toStep2Btn.disabled = !(deptEl.value && nameEl.value);
});
 
toStep2Btn.addEventListener('click', ()=>{
  buildMetricRows(FIELDS[deptEl.value] || []);
  revealCard(step2);
});
 
backTo1Btn.addEventListener('click', ()=>{
  step1.scrollIntoView({behavior:'smooth'});
});
 
reviewBtn.addEventListener('click', ()=>{
  const inputs = [...metricsForm.querySelectorAll('input[type="number"]')];
  outputBody.innerHTML = '';
  [["Date", dateEl.value],["Department", deptEl.value],["Name", nameEl.value]].forEach(([k,v])=>{
    const tr=document.createElement('tr');
    tr.innerHTML = `<td><strong>${k}</strong></td><td>${v}</td>`;
    outputBody.appendChild(tr);
  });
  inputs.forEach(inp=>{
    const tr=document.createElement('tr');
    tr.innerHTML = `<td>${inp.dataset.label}</td><td>${inp.value || 0}</td>`;
    outputBody.appendChild(tr);
  });
  revealCard(step3);
});
 
editBtn.addEventListener('click', ()=>{
  step2.scrollIntoView({behavior:'smooth'});
});
 
newEntryBtn.addEventListener('click', ()=>{
  dateEl.value = todayLocalISO();
  deptEl.value = "";
  nameEl.innerHTML = '<option value="" selected disabled>Select name</option>';
  nameEl.disabled = true;
  metricsForm.innerHTML = '';
  toStep2Btn.disabled = true;
  outputBody.innerHTML = '';
 
  step2.classList.remove('show','visible');
  step3.classList.remove('show','visible');
 
  step1.scrollIntoView({behavior:'smooth'});
});
 
async function copyText(text){
  try{
    await navigator.clipboard.writeText(text);
    return true;
  }catch{
    try{
      const ta=document.createElement('textarea');
      ta.value=text; ta.style.position='fixed'; ta.style.left='-9999px';
      document.body.appendChild(ta); ta.focus(); ta.select();
      const ok=document.execCommand('copy'); document.body.removeChild(ta);
      return ok;
    }catch{return false;}
  }
}
 
copyBtn.addEventListener('click', async ()=>{
  const values = [...document.querySelectorAll('#outputTable tbody tr:nth-child(n+4) td:nth-child(2)')]
    .map(td => td.textContent.trim());
  const payload = values.join('\n');
  const ok = await copyText(payload);
  if(ok){
    copyBtn.textContent = 'Copied!';
    setTimeout(()=>copyBtn.textContent='Copy Values', 1200);
  }else{
    window.prompt('Copy the values below, then paste into Excel:', payload);
  }
});