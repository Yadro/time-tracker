function cn(...classes: (string | undefined | null | boolean)[]) {
  return classes.filter((i) => !!i).join(' ');
}

export default cn;
