/* ============================================================
   Дубинин Марк Александрович — визитка
   Мелочи: vCard, копирование в буфер, появление блоков
   ============================================================ */
(function () {
  'use strict';

  var PHONE = '+77085803766';
  var HANDLE = 'yung_pretty_boi';
  var TELEGRAM = 'https://t.me/' + HANDLE;
  var EMAIL = 'dubinimark@gmail.com';
  var INSTAGRAM = 'https://www.instagram.com/maik_cicle';
  var BOT = 'https://t.me/VIP_DAVA_MAKINTO_bot';

  /* ---------- данные карточки: правь здесь ---------- */
  var CARD = {
    lastName: 'Дубинин',
    firstName: 'Марк',
    middleName: 'Александрович',
    nickname: HANDLE,
    org: '',
    title: 'Telegram-боты · сайты · помощь с компьютером',
    phone: PHONE,
    email: EMAIL,
    url: TELEGRAM,
    instagram: INSTAGRAM,
    bot: BOT
  };

  CARD.fullName = [CARD.lastName, CARD.firstName, CARD.middleName].filter(Boolean).join(' ');

  function buildVCard() {
    var lines = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      'N:' + CARD.lastName + ';' + CARD.firstName + ';' + CARD.middleName + ';;',
      'FN:' + CARD.fullName,
      'NICKNAME:' + CARD.nickname,
      'TITLE:' + CARD.title,
      'TEL;TYPE=CELL;TYPE=VOICE:' + CARD.phone,
      'EMAIL;TYPE=INTERNET;TYPE=WORK:' + CARD.email,
      'URL:' + CARD.url,
      'URL:' + CARD.instagram,
      'URL:' + CARD.bot,
      'X-SOCIALPROFILE;TYPE=telegram:' + CARD.url,
      'X-SOCIALPROFILE;TYPE=instagram:' + CARD.instagram,
      'NOTE:Telegram-боты, сайты, помощь с компьютером. Связь удобнее всего в Telegram.',
      'END:VCARD'
    ];
    return lines.join('\r\n') + '\r\n';
  }

  function download(filename, text) {
    var blob = new Blob([text], { type: 'text/vcard;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
  }

  function flash(btn, text) {
    var original = btn.dataset.label || btn.textContent.trim();
    btn.dataset.label = original;
    btn.textContent = text;
    btn.classList.add('is-done');
    setTimeout(function () {
      btn.textContent = original;
      btn.classList.remove('is-done');
    }, 1800);
  }

  /* ---------- сохранить контакт ---------- */
  var saveBtn = document.getElementById('save-contact');
  if (saveBtn) {
    saveBtn.addEventListener('click', function () {
      download('dubinin-mark.vcf', buildVCard());
      flash(saveBtn, 'Контакт скачан');
    });
  }

  /* ---------- копировать в буфер (телефон, почта и т.д.) ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('[data-copy]'), function (btn) {
    btn.addEventListener('click', function () {
      var value = btn.dataset.copy;

      function done() { flash(btn, 'скопировано'); }

      function fallback() {
        var ta = document.createElement('textarea');
        ta.value = value;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); done(); }
        catch (e) { flash(btn, value); }
        document.body.removeChild(ta);
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).then(done, fallback);
      } else {
        fallback();
      }
    });
  });

  /* ---------- год в подвале ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- мягкое появление ---------- */
  var blocks = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

  if (!('IntersectionObserver' in window)) {
    blocks.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var i = blocks.indexOf(el);
          el.style.transitionDelay = Math.min(i, 4) * 90 + 'ms';
          el.classList.add('is-in');
          io.unobserve(el);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    blocks.forEach(function (el) { io.observe(el); });
  }
})();
