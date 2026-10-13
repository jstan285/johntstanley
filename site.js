const tabs = [...document.querySelectorAll('[data-chapter]')];
const timeline = document.querySelector('.timeline');
const panels = tabs.map((_, i) => document.getElementById(`chapter-${i}`));
function selectChapter(index, focus = false, updateAddress = false) {
  if (!tabs[index]) return;
  tabs.forEach((tab, i) => {
    tab.setAttribute('aria-selected', String(i === index));
    tab.tabIndex = i === index ? 0 : -1;
    panels[i].hidden = i !== index;
  });
  if (updateAddress) history.replaceState(null, '', `#chapter-${index}`);
  if (focus) tabs[index].focus();
}
if (tabs.length && panels.every(Boolean)) {
  timeline.setAttribute('role', 'tablist');
  const phoneLayout = matchMedia('(max-width:480px)');
  const updateOrientation = () => timeline.setAttribute('aria-orientation', phoneLayout.matches ? 'vertical' : 'horizontal');
  updateOrientation();
  phoneLayout.addEventListener('change', updateOrientation);
  tabs.forEach((tab, i) => {
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', `chapter-${i}`);
    panels[i].setAttribute('role', 'tabpanel');
    tab.addEventListener('click', event => {
      event.preventDefault(); selectChapter(i, false, true);
    });
    tab.addEventListener('keydown', event => {
      let next;
      if (['ArrowRight', 'ArrowDown'].includes(event.key)) next = (i + 1) % tabs.length;
      if (['ArrowLeft', 'ArrowUp'].includes(event.key)) next = (i + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (['Enter', ' '].includes(event.key)) next = i;
      if (next !== undefined) {event.preventDefault(); selectChapter(next, true, true);}
    });
  });
  const chapterFromAddress = () => {
    const match = location.hash.match(/^#chapter-([0-2])$/);
    return match ? Number(match[1]) : null;
  };
  selectChapter(chapterFromAddress() ?? 2);
  document.body.classList.add('chapters-enhanced');
  addEventListener('hashchange', () => {
    const chapter = chapterFromAddress();
    if (chapter !== null) selectChapter(chapter);
  });
  document.querySelectorAll('[data-select]').forEach(button => button.addEventListener('click', () => selectChapter(Number(button.dataset.select), true, true)));
}
const menus = [...document.querySelectorAll('.explore')];
menus.forEach(menu => {
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    menu.open = false;
  }));
  menu.addEventListener('toggle', () => {
    if (menu.open) menus.forEach(other => {if (other !== menu) other.open = false;});
  });
  menu.addEventListener('focusout', event => {
    if (event.relatedTarget && !menu.contains(event.relatedTarget)) menu.open = false;
  });
});
document.addEventListener('click', event => {
  menus.forEach(menu => {if (!menu.contains(event.target)) menu.open = false;});
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    const openMenu = menus.find(menu => menu.open);
    if (openMenu) {openMenu.open = false; openMenu.querySelector('summary').focus();}
  }
});
