const $ = (sel) => document.querySelector(sel);

function setActiveNav() {
  const path = location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll("[data-nav]");
  navLinks.forEach(a => {
    const href = a.getAttribute("href").split("/").pop();
    a.dataset.active = (href === path) ? "true" : "false";
  });
}

function setTheme(t){
  document.body.setAttribute("data-theme", t);
  const icon = $("#themeIcon");
  if(icon) icon.textContent = t === "light" ? "☀️" : "🌙";
  localStorage.setItem("theme", t);
}
function initTheme(){
  const saved = localStorage.getItem("theme");
  setTheme(saved || "dark");
  $("#themeBtn")?.addEventListener("click", () => {
    const cur = document.body.getAttribute("data-theme") || "dark";
    setTheme(cur === "dark" ? "light" : "dark");
  });
}

function openModal({title, name="", role="", avatarChar="字", bodyText="", tags=[]}){
  $("#modalTitle").textContent = title || "详情";
  $("#modalName").textContent = name || "—";
  $("#modalRole").textContent = role || "";
  $("#modalAvatar").textContent = avatarChar || "字";
  $("#modalBody").textContent = bodyText || "";
  const tagsEl = $("#modalTags");
  if(tagsEl){
    tagsEl.innerHTML = "";
    (tags||[]).forEach(t=>{
      const sp = document.createElement("span");
      sp.className = "chip";
      sp.textContent = t;
      tagsEl.appendChild(sp);
    });
  }
  $("#modalBackdrop").style.display = "flex";
  $("#modalBackdrop").setAttribute("aria-hidden","false");
}
function closeModal(){
  $("#modalBackdrop").style.display = "none";
  $("#modalBackdrop").setAttribute("aria-hidden","true");
}

function initModal(){
  $("#modalCloseBtn")?.addEventListener("click", closeModal);
  $("#modalBackdrop")?.addEventListener("click", (e)=>{
    if(e.target === $("#modalBackdrop")) closeModal();
  });
  document.addEventListener("keydown", (e)=>{
    if(e.key === "Escape") closeModal();
  });
}

function wireListToModal(){
  document.querySelectorAll("[data-modal-title]").forEach(el=>{
    const click = ()=>{
      const title = el.dataset.modalTitle || "详情";
      const bodyText = el.dataset.modalBody || "";
      openModal({
        title,
        name: el.dataset.modalName || "北华大学1208实验室",
        role: el.dataset.modalRole || "公告/信息",
        avatarChar: el.dataset.modalAvatar || "🗞️",
        bodyText,
        tags: (el.dataset.modalTags || "").split(",").map(s=>s.trim()).filter(Boolean)
      });
    };
    el.addEventListener("click", click);
    el.setAttribute("role","button");
    el.setAttribute("tabindex","0");
    el.addEventListener("keydown",(e)=>{
      if(e.key === "Enter" || e.key === " "){
        e.preventDefault();
        click();
      }
    });
  });
}

function initContactForm(){
  $("#contactForm")?.addEventListener("submit", (e)=>{
    e.preventDefault();
    const form = e.target;
    const name = $("#name")?.value?.trim() || "—";
    const email = $("#email")?.value?.trim() || "—";
    const topic = $("#topic")?.value?.trim() || "—";
    const msg = $("#msg")?.value?.trim() || "";
    openModal({
      title: "提交成功（前端演示）",
      name,
      role: topic,
      avatarChar: "✅",
      bodyText: `已记录你的提交信息（示例，不会发到服务器）。\n\n联系方式：${email}\n内容摘要：${msg.slice(0,120)}${msg.length>120?'...':''}`,
      tags: ["表单", "演示"]
    });
    form.reset();
  });
}

function initCopy(){
  $("#copyEmailBtn")?.addEventListener("click", async ()=>{
    const email = $("#copyEmailBtn")?.dataset?.email || "1208lab@beihua.edu.cn";
    try{
      await navigator.clipboard.writeText(email);
      openModal({
        title:"已复制",
        name: email,
        role:"可粘贴到邮件/通讯工具",
        avatarChar:"📋",
        bodyText:"复制成功（示例）。如需改为真实邮箱，请在页面/代码中替换。",
        tags:["邮箱","复制"]
      });
    }catch{
      openModal({
        title:"复制失败",
        name:"请手动复制",
        role:"浏览器限制剪贴板权限",
        avatarChar:"⚠️",
        bodyText:"你的浏览器可能限制剪贴板权限。请手动复制页面中的邮箱信息。",
        tags:["权限","手动"]
      });
    }
  });
}

function initFooterYear(){
  const y = $("#year");
  if(y) y.textContent = new Date().getFullYear();
}

document.addEventListener("DOMContentLoaded", ()=>{
  setActiveNav();
  initTheme();
  initModal();
  wireListToModal();
  initContactForm();
  initCopy();
  initFooterYear();
});
