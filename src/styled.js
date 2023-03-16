const styled =
  (tag) =>
  (strs, ...exprs) => {
    const style = exprs.reduce((result, expr, index) => {
      return result + expr + strs[index + 1];
    }, strs[0]);
    const el = document.createElement(tag);
    el.setAttribute("style", style);
    return el;
  };

export default styled;
