function scrollToRef(ref) {
  if (!window || !ref) return;
  window.scrollTo(0, ref.current.offsetTop);
}

export { scrollToRef };
