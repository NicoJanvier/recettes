function scrollToRef(ref, smooth) {
  if (!window || !ref || !ref.current) return;
  ref.current.scrollIntoView({
    behavior: smooth ? 'smooth' : 'instant',
    block: 'center',
  });
}

export { scrollToRef };