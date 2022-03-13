const scrollBtn = document.getElementById('toTop');
var body = document.body,
    docE = document.documentElement;
this.addEventListener('DOMContentLoaded', () => {
  const bFooter = document.getElementById('bFooter');
  if ((body.scrollTop || docE.scrollTop) > docE.clientHeight) {
    bFooter.style.display='flex';
  };
  this.addEventListener('scroll', () => {
    if ((body.scrollTop || docE.scrollTop) > docE.clientHeight) {
      bFooter.style.display='flex';
    } else {
      bFooter.style.display='none';
    }
  });
});
this.addEventListener('load', () => {
  scrollBtn.addEventListener('click', () => {
    docE.scroll(0,0);
    scrollBtn.blur();
  });
});
